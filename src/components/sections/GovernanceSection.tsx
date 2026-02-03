import React, { useState, useCallback } from 'react';
import { Vote, TrendingUp, CheckCircle, XCircle, MinusCircle, Users, Award, Clock, AlertTriangle } from 'lucide-react';
import { useGovernance } from '../../hooks/useGovernance';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';

interface GovernanceSectionProps {
  lang: 'ar' | 'en';
  showNotification: (type: string, message: string, duration?: number) => void;
}

const GovernanceSection: React.FC<GovernanceSectionProps> = ({ lang, showNotification }) => {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKit();
  const {
    proposals,
    votingPower,
    loading,
    activeProposals,
    canCreateProposal,
    canVote,
    getProposalById,
    hasVoted,
    calculateProposalProgress,
    hasProposalPassed,
    governanceService
  } = useGovernance(address);

  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [votedProposals, setVotedProposals] = useState<Set<number>>(new Set());

  // Create Proposal State
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    action: 'TreasuryTransfer',
    propertyAddress: '',
    propertyValue: '',
    transferAmount: '',
    recipientAddress: ''
  });

  const proposalActions = [
    { value: 'TreasuryTransfer', label: lang === 'ar' ? 'تحويل من الخزينة' : 'Treasury Transfer' },
    { value: 'UpdateStakingParams', label: lang === 'ar' ? 'تحديث معايير التخزين' : 'Update Staking Params' },
    { value: 'PauseProtocol', label: lang === 'ar' ? 'إيقاف البروتوكول' : 'Pause Protocol' },
    { value: 'CustomAction', label: lang === 'ar' ? 'إجراء مخصص' : 'Custom Action' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-blue-400 bg-blue-500/20';
      case 'Succeeded':
        return 'text-green-400 bg-green-500/20';
      case 'Defeated':
        return 'text-red-400 bg-red-500/20';
      case 'Executed':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { ar: string; en: string }> = {
      Draft: { ar: 'مسودة', en: 'Draft' },
      Active: { ar: 'نشط', en: 'Active' },
      Succeeded: { ar: 'نجح', en: 'Succeeded' },
      Defeated: { ar: 'فشل', en: 'Defeated' },
      Executed: { ar: 'تم التنفيذ', en: 'Executed' },
      Cancelled: { ar: 'ملغي', en: 'Cancelled' },
      Expired: { ar: 'منتهي', en: 'Expired' }
    };
    return statusMap[status]?.[lang] || status;
  };

  const formatTimeRemaining = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;
    
    if (remaining <= 0) {
      return lang === 'ar' ? 'انتهى' : 'Ended';
    }

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    
    if (days > 0) {
      return `${days}${lang === 'ar' ? ' يوم' : 'd'} ${hours}${lang === 'ar' ? ' ساعة' : 'h'}`;
    }
    return `${hours}${lang === 'ar' ? ' ساعة' : 'h'}`;
  };

  const handleCreateProposal = useCallback(async () => {
    if (!isConnected || !address) {
      showNotification('error', lang === 'ar' ? 'المحفظة غير متصلة' : 'Wallet not connected');
      return;
    }

    if (!canCreateProposal) {
      showNotification('error', lang === 'ar' ? 'تحتاج إلى 100 LLTY على الأقل' : 'Need at least 100 LLTY');
      return;
    }

    if (!newProposal.title || !newProposal.description) {
      showNotification('error', lang === 'ar' ? 'الرجاء ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    try {
      setProcessing(true);
      showNotification('info', lang === 'ar' ? 'جاري الإنشاء...' : 'Creating...');

      const proposalData = {
        title: Buffer.from(newProposal.title),
        description: Buffer.from(newProposal.description),
        action: newProposal.action,
        propertyAddress: newProposal.propertyAddress ? Buffer.from(newProposal.propertyAddress) : null,
        propertyValueUsd: newProposal.propertyValue ? parseInt(newProposal.propertyValue) * 1e6 : null,
        propertyId: null,
        targetRecipient: newProposal.recipientAddress || null,
        transferAmount: newProposal.transferAmount ? parseInt(newProposal.transferAmount) * 1e6 : null,
        customVotingDurationDays: null,
        customQuorumBps: null,
        customApprovalThresholdBps: null
      };

      const { tx, proposalId } = await governanceService.createProposal(address, proposalData);

      const provider = await walletProvider;
      if (!provider) {
        throw new Error('Wallet provider not available');
      }

      const signed = await provider.signTransaction(tx);
      const signature = await governanceService.connection.sendRawTransaction(signed.serialize());

      await governanceService.connection.confirmTransaction(signature, 'confirmed');

      showNotification(
        'success',
        `${lang === 'ar' ? 'تم إنشاء الاقتراح بنجاح!' : 'Proposal created successfully!'} #${proposalId}`
      );

      setShowCreateModal(false);
      setNewProposal({
        title: '',
        description: '',
        action: 'TreasuryTransfer',
        propertyAddress: '',
        propertyValue: '',
        transferAmount: '',
        recipientAddress: ''
      });
    } catch (err: any) {
      console.error('Create proposal error:', err);
      showNotification('error', `${lang === 'ar' ? 'خطأ' : 'Error'}: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, [isConnected, address, canCreateProposal, newProposal, governanceService, showNotification, lang]);

  const handleVote = useCallback(async (proposalId: number, support: 'Yes' | 'No' | 'Abstain') => {
    if (!isConnected || !address) {
      showNotification('error', lang === 'ar' ? 'المحفظة غير متصلة' : 'Wallet not connected');
      return;
    }

    if (!canVote) {
      showNotification('error', lang === 'ar' ? 'لا توجد قوة تصويت' : 'No voting power');
      return;
    }

    // Check if already voted
    const alreadyVoted = await hasVoted(proposalId);
    if (alreadyVoted) {
      showNotification('error', lang === 'ar' ? 'لقد صوتت بالفعل' : 'Already voted');
      return;
    }

    try {
      setProcessing(true);
      showNotification('info', lang === 'ar' ? 'جاري التصويت...' : 'Voting...');

      const tx = await governanceService.voteOnProposal(address, proposalId, support);

      const provider = await walletProvider;
      if (!provider) {
        throw new Error('Wallet provider not available');
      }

      const signed = await provider.signTransaction(tx);
      const signature = await governanceService.connection.sendRawTransaction(signed.serialize());

      await governanceService.connection.confirmTransaction(signature, 'confirmed');

      showNotification(
        'success',
        `${lang === 'ar' ? 'تم التصويت بنجاح!' : 'Voted successfully!'} ${support}`
      );

      // Add to voted set
      setVotedProposals(prev => new Set(prev).add(proposalId));
    } catch (err: any) {
      console.error('Vote error:', err);
      showNotification('error', `${lang === 'ar' ? 'خطأ' : 'Error'}: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, [isConnected, address, canVote, hasVoted, governanceService, showNotification, lang]);

  const handleExecuteProposal = useCallback(async (proposalId: number) => {
    if (!isConnected || !address) {
      showNotification('error', lang === 'ar' ? 'المحفظة غير متصلة' : 'Wallet not connected');
      return;
    }

    const proposal = getProposalById(proposalId);
    if (!proposal) {
      showNotification('error', lang === 'ar' ? 'الاقتراح غير موجود' : 'Proposal not found');
      return;
    }

    if (proposal.status !== 'Succeeded') {
      showNotification('error', lang === 'ar' ? 'الاقتراح لم ينجح بعد' : 'Proposal has not succeeded');
      return;
    }

    try {
      setProcessing(true);
      showNotification('info', lang === 'ar' ? 'جاري التنفيذ...' : 'Executing...');

      const tx = await governanceService.executeProposal(address, proposalId);

      const provider = await walletProvider;
      if (!provider) {
        throw new Error('Wallet provider not available');
      }

      const signed = await provider.signTransaction(tx);
      const signature = await governanceService.connection.sendRawTransaction(signed.serialize());

      await governanceService.connection.confirmTransaction(signature, 'confirmed');

      showNotification(
        'success',
        lang === 'ar' ? 'تم تنفيذ الاقتراح بنجاح!' : 'Proposal executed successfully!'
      );
    } catch (err: any) {
      console.error('Execute proposal error:', err);
      showNotification('error', `${lang === 'ar' ? 'خطأ' : 'Error'}: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, [isConnected, address, getProposalById, governanceService, showNotification, lang]);

  return (
    <section id="governance" className="mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Vote className="mx-auto mb-4 text-yellow-400" size={64} />
          <h2 className="text-4xl font-bold text-yellow-400 mb-4">
            {lang === 'ar' ? 'حوكمة DAO' : 'DAO Governance'}
          </h2>
          <p className="text-xl text-gray-300">
            {lang === 'ar' 
              ? 'شارك في قرارات المجتمع وصوت على مقترحات الاستثمار العقاري'
              : 'Participate in community decisions and vote on real estate investment proposals'}
          </p>
        </div>

        {/* Voting Power Card */}
        {isConnected && votingPower && (
          <div className="rounded-2xl p-8 mb-12 shadow-2xl" style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
            border: '2px solid rgba(251, 191, 36, 0.3)'
          }}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Users className="mx-auto mb-2 text-purple-200" size={32} />
                <p className="text-sm text-purple-200 mb-1">
                  {lang === 'ar' ? 'رصيد العملات' : 'Token Balance'}
                </p>
                <p className="text-2xl font-bold text-white">
                  {votingPower.tokenBalance.toLocaleString()} LLTY
                </p>
              </div>
              <div className="text-center">
                <Award className="mx-auto mb-2 text-purple-200" size={32} />
                <p className="text-sm text-purple-200 mb-1">
                  {lang === 'ar' ? 'العملات المخزّنة' : 'Staked Tokens'}
                </p>
                <p className="text-2xl font-bold text-white">
                  {votingPower.stakedAmount.toLocaleString()} LLTY
                </p>
              </div>
              <div className="text-center">
                <TrendingUp className="mx-auto mb-2 text-purple-200" size={32} />
                <p className="text-sm text-purple-200 mb-1">
                  {lang === 'ar' ? 'قوة التصويت الكلية' : 'Total Voting Power'}
                </p>
                <p className="text-3xl font-bold text-yellow-400">
                  {votingPower.totalPower.toLocaleString()}
                </p>
                {votingPower.hasDAOEligibility && (
                  <p className="text-xs text-green-300 mt-1">
                    ✨ {lang === 'ar' ? 'مضاعف 2x نشط' : '2x Multiplier Active'}
                  </p>
                )}
              </div>
            </div>

            {canCreateProposal && (
              <button
                onClick={() => setShowCreateModal(true)}
                disabled={processing}
                className="w-full mt-6 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1e293b'
                }}
              >
                {lang === 'ar' ? '+ إنشاء اقتراح جديد' : '+ Create New Proposal'}
              </button>
            )}
          </div>
        )}

        {/* Proposals List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              {lang === 'ar' ? 'الاقتراحات' : 'Proposals'}
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-400">
                {activeProposals?.length || 0} {lang === 'ar' ? 'نشط' : 'Active'}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-500/20 text-gray-400">
                {proposals?.length || 0} {lang === 'ar' ? 'إجمالي' : 'Total'}
              </span>
            </div>
          </div>

          {(proposals?.length || 0) === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              <Vote className="mx-auto mb-4 text-gray-500" size={64} />
              <p className="text-xl text-gray-400">
                {lang === 'ar' ? 'لا توجد اقتراحات حتى الآن' : 'No proposals yet'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {lang === 'ar' 
                  ? 'كن أول من يقترح استثماراً عقارياً'
                  : 'Be the first to propose a real estate investment'}
              </p>
            </div>
          ) : (
            proposals.map((proposal) => {
              const progress = calculateProposalProgress(proposal);
              const passed = hasProposalPassed(proposal);
              const now = Math.floor(Date.now() / 1000);
              const isVotingActive = now >= proposal.votingStart && now <= proposal.votingEnd;

              return (
                <div
                  key={proposal.id}
                  className="rounded-2xl p-8 shadow-2xl border-2 cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    borderColor: selectedProposal === proposal.id 
                      ? '#fbbf24' 
                      : 'rgba(251, 191, 36, 0.2)'
                  }}
                  onClick={() => setSelectedProposal(selectedProposal === proposal.id ? null : proposal.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-400">
                          #{proposal.id}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(proposal.status)}`}>
                          {getStatusText(proposal.status)}
                        </span>
                        {isVotingActive && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 flex items-center gap-1">
                            <Clock size={12} />
                            {formatTimeRemaining(proposal.votingEnd)}
                          </span>
                        )}
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">
                        {proposal.title}
                      </h4>
                      <p className="text-gray-300 line-clamp-2">
                        {proposal.description}
                      </p>
                    </div>
                  </div>

                  {/* Voting Progress */}
                  <div className="space-y-3 mb-6">
                    {/* Quorum Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'النصاب القانوني' : 'Quorum'}
                        </span>
                        <span className={`font-bold ${progress.quorumProgress >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {progress.quorumProgress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-700">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(progress.quorumProgress, 100)}%`,
                            background: progress.quorumProgress >= 100 
                              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                              : 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Voting Results */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-lg bg-green-500/10">
                        <CheckCircle className="mx-auto mb-1 text-green-400" size={20} />
                        <p className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'نعم' : 'Yes'}</p>
                        <p className="text-lg font-bold text-green-400">
                          {progress.yesPercentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-red-500/10">
                        <XCircle className="mx-auto mb-1 text-red-400" size={20} />
                        <p className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'لا' : 'No'}</p>
                        <p className="text-lg font-bold text-red-400">
                          {progress.noPercentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gray-500/10">
                        <MinusCircle className="mx-auto mb-1 text-gray-400" size={20} />
                        <p className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'امتناع' : 'Abstain'}</p>
                        <p className="text-lg font-bold text-gray-400">
                          {progress.abstainPercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {selectedProposal === proposal.id && (
                    <div className="border-t border-gray-700 pt-6 space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          {lang === 'ar' ? 'الوصف الكامل' : 'Full Description'}
                        </p>
                        <p className="text-gray-300">
                          {proposal.description}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">
                            {lang === 'ar' ? 'نوع الإجراء' : 'Action Type'}
                          </p>
                          <p className="text-white font-semibold">{proposal.action}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">
                            {lang === 'ar' ? 'إجمالي الناخبين' : 'Total Voters'}
                          </p>
                          <p className="text-white font-semibold">{proposal.totalVoters}</p>
                        </div>
                      </div>

                      {/* Vote Buttons */}
                      {isConnected && canVote && isVotingActive && proposal.status === 'Active' && (
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(proposal.id, 'Yes');
                            }}
                            disabled={processing || votedProposals.has(proposal.id)}
                            className="flex-1 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white'
                            }}
                          >
                            <CheckCircle className="inline mr-2" size={20} />
                            {lang === 'ar' ? 'نعم' : 'Yes'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(proposal.id, 'No');
                            }}
                            disabled={processing || votedProposals.has(proposal.id)}
                            className="flex-1 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              color: 'white'
                            }}
                          >
                            <XCircle className="inline mr-2" size={20} />
                            {lang === 'ar' ? 'لا' : 'No'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(proposal.id, 'Abstain');
                            }}
                            disabled={processing || votedProposals.has(proposal.id)}
                            className="flex-1 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              background: 'rgba(107, 114, 128, 0.3)',
                              color: 'white',
                              border: '1px solid rgba(156, 163, 175, 0.5)'
                            }}
                          >
                            <MinusCircle className="inline mr-2" size={20} />
                            {lang === 'ar' ? 'امتناع' : 'Abstain'}
                          </button>
                        </div>
                      )}

                      {/* Execute Button */}
                      {proposal.status === 'Succeeded' && !proposal.isExecuted && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExecuteProposal(proposal.id);
                          }}
                          disabled={processing}
                          className="w-full py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50"
                          style={{
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            color: '#1e293b'
                          }}
                        >
                          {lang === 'ar' ? 'تنفيذ الاقتراح' : 'Execute Proposal'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Create Proposal Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="max-w-2xl w-full rounded-2xl p-8 shadow-2xl" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid rgba(251, 191, 36, 0.3)'
            }}>
              <h3 className="text-3xl font-bold text-yellow-400 mb-6">
                {lang === 'ar' ? 'إنشاء اقتراح جديد' : 'Create New Proposal'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    {lang === 'ar' ? 'العنوان' : 'Title'}
                  </label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    placeholder={lang === 'ar' ? 'عنوان الاقتراح' : 'Proposal title'}
                    className="w-full px-4 py-3 rounded-lg text-white"
                    style={{
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '1px solid rgba(251, 191, 36, 0.3)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    {lang === 'ar' ? 'الوصف' : 'Description'}
                  </label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                    placeholder={lang === 'ar' ? 'وصف تفصيلي للاقتراح' : 'Detailed description'}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg text-white"
                    style={{
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '1px solid rgba(251, 191, 36, 0.3)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    {lang === 'ar' ? 'نوع الإجراء' : 'Action Type'}
                  </label>
                  <select
                    value={newProposal.action}
                    onChange={(e) => setNewProposal({ ...newProposal, action: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-white"
                    style={{
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '1px solid rgba(251, 191, 36, 0.3)'
                    }}
                  >
                    {proposalActions.map((action) => (
                      <option key={action.value} value={action.value}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                </div>

                {newProposal.action === 'TreasuryTransfer' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        {lang === 'ar' ? 'عنوان العقار' : 'Property Address'}
                      </label>
                      <input
                        type="text"
                        value={newProposal.propertyAddress}
                        onChange={(e) => setNewProposal({ ...newProposal, propertyAddress: e.target.value })}
                        placeholder={lang === 'ar' ? 'عنوان العقار' : 'Property address'}
                        className="w-full px-4 py-3 rounded-lg text-white"
                        style={{
                          background: 'rgba(51, 65, 85, 0.5)',
                          border: '1px solid rgba(251, 191, 36, 0.3)'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        {lang === 'ar' ? 'قيمة العقار (USD)' : 'Property Value (USD)'}
                      </label>
                      <input
                        type="number"
                        value={newProposal.propertyValue}
                        onChange={(e) => setNewProposal({ ...newProposal, propertyValue: e.target.value })}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-lg text-white"
                        style={{
                          background: 'rgba(51, 65, 85, 0.5)',
                          border: '1px solid rgba(251, 191, 36, 0.3)'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        {lang === 'ar' ? 'المبلغ المطلوب (USD)' : 'Transfer Amount (USD)'}
                      </label>
                      <input
                        type="number"
                        value={newProposal.transferAmount}
                        onChange={(e) => setNewProposal({ ...newProposal, transferAmount: e.target.value })}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-lg text-white"
                        style={{
                          background: 'rgba(51, 65, 85, 0.5)',
                          border: '1px solid rgba(251, 191, 36, 0.3)'
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        {lang === 'ar' ? 'عنوان المستلم' : 'Recipient Address'}
                      </label>
                      <input
                        type="text"
                        value={newProposal.recipientAddress}
                        onChange={(e) => setNewProposal({ ...newProposal, recipientAddress: e.target.value })}
                        placeholder="Solana address"
                        className="w-full px-4 py-3 rounded-lg text-white"
                        style={{
                          background: 'rgba(51, 65, 85, 0.5)',
                          border: '1px solid rgba(251, 191, 36, 0.3)'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={processing}
                  className="flex-1 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50"
                  style={{
                    background: 'rgba(107, 114, 128, 0.3)',
                    color: 'white',
                    border: '1px solid rgba(156, 163, 175, 0.5)'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleCreateProposal}
                  disabled={processing || !newProposal.title || !newProposal.description}
                  className="flex-1 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#1e293b'
                  }}
                >
                  {processing 
                    ? (lang === 'ar' ? 'جاري الإنشاء...' : 'Creating...')
                    : (lang === 'ar' ? 'إنشاء' : 'Create')
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GovernanceSection;
