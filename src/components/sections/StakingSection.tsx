import React, { useState, useCallback } from 'react';
import { Lock, TrendingUp, Award, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useStaking } from '../../hooks/useStaking';
import { useAppKitAccount, useAppKit, useAppKitProvider } from '@reown/appkit/react';
import { PublicKey } from '@solana/web3.js';
import { getConnection } from '../../services/blockchainService';
import { buildStakeTransaction, buildClaimRewardsTransaction, buildUnstakeTransaction, executeStakingTransaction } from "../../services/stakingService.ts";
import { detectWalletCompatibility, getRecommendedWallets } from "../../utils/walletDetection";

interface StakingSectionProps {
  lang: 'ar' | 'en';
  showNotification: (type: string, message: string, duration?: number) => void;
}

const StakingSection: React.FC<StakingSectionProps> = ({ lang, showNotification }) => {


  // Get connection
  const connection = getConnection();

  // Helper function to calculate APY based on duration
    const getAPYForDuration = (months: number): number => {
    if (months >= 36) return 6.70;  // 3 years = 6.70%
    if (months >= 24) return 5.65;  // 2 years = 5.65%
    if (months >= 12) return 3.75;  // 1 year = 3.75%
    return 2.35;                    // 6 months = 2.35%
  };

  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("solana");
  
  // Use the hook correctly - it only returns these fields
  const { stakedAmount, rewards, apy, loading, error, poolInitialized } = useStaking(address, connection);

  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<'6months' | '1year' | '2years' | '3years'>('1year');
  const [processing, setProcessing] = useState(false);

  // Mock data for stakingPool and stakingData until we fetch real data
  const stakingPool = poolInitialized ? {
    totalStaked: 1000000000000000,
    totalStakers: 150,
    totalRewardsDistributed: 50000000000000,
    rewardPoolBalance: 4000000000000000
  } : null;

  const stakingData = stakedAmount > 0 ? {
    isActive: true,
    amountStaked: stakedAmount * 1e9,
    duration: selectedDuration,
    apyRate: apy * 100,
    stakeStartTime: Date.now(),
    lockEndTime: Date.now() + (365 * 24 * 60 * 60 * 1000),
    pendingRewards: rewards * 1e9,
    totalRewardsClaimed: 0,
    isUnlocked: false,
    daoEligible: true
  } : null;

  const pendingRewards = rewards * 1e9;
  const timeRemaining = 86400; // 1 day in seconds for demo
  const isUnlocked = false;
  const earlyUnstakePenalty = stakedAmount > 0 ? (stakedAmount * 0.5 * 1e9) : 0;

  const durations = [
    { value: '6months', label: lang === 'ar' ? '6 أشهر' : '6 Months', apy: 2.35 },
    { value: '1year', label: lang === 'ar' ? 'سنة واحدة' : '1 Year', apy: 3.75 },
    { value: '2years', label: lang === 'ar' ? 'سنتان' : '2 Years', apy: 5.65 },
    { value: '3years', label: lang === 'ar' ? '3 سنوات' : '3 Years', apy: 6.70 }
  ];

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}${lang === 'ar' ? ' يوم' : 'd'} ${hours}${lang === 'ar' ? ' ساعة' : 'h'}`;
    }
    return `${hours}${lang === 'ar' ? ' ساعة' : 'h'} ${minutes}${lang === 'ar' ? ' دقيقة' : 'm'}`;
  };

  const handleStake = useCallback(async () => {
    if (!isConnected || !address) {
      showNotification('error', lang === 'ar' ? 'المحفظة غير متصلة' : 'Wallet not connected');
      return;
    }
    
    // ✅ CHECK WALLET COMPATIBILITY
    const compatibilityInfo = detectWalletCompatibility(walletProvider, address);
    if (!compatibilityInfo.isCompatible) {
      const recommendedWallets = getRecommendedWallets();
      const walletList = recommendedWallets.map(w => w.name).join(', ');
      
      showNotification(
        'error',
        lang === 'ar'
          ? `${compatibilityInfo.walletName} غير متوافقة. استخدم: ${walletList}`
          : `${compatibilityInfo.walletName} is incompatible. Please use: ${walletList}`
      );
      return;
    }
 
    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0) {
      showNotification('error', lang === 'ar' ? 'المبلغ غير صحيح' : 'Invalid amount');
      return;
    }

    try {
      setProcessing(true);
      showNotification('info', lang === 'ar' ? 'جاري المعالجة...' : 'Processing...');

      // Build transaction using TypeScript service
      const userPublicKey = new PublicKey(address);
      const buildResult = await buildStakeTransaction({
        userPublicKey,
        amount,
        duration: selectedDuration,
        connection
      });

      if (!buildResult.success || !buildResult.transaction) {
        throw new Error(buildResult.error || 'Failed to build transaction');
      }

      const provider = walletProvider;
      if (!provider) {
        throw new Error('Wallet provider not available');
      }

      // Execute transaction
      const executeResult = await executeStakingTransaction(
        buildResult.transaction,
        provider,
        connection
      );

      if (!executeResult.success) {
        throw new Error(executeResult.error || 'Transaction failed');
      }

      showNotification(
        'success',
        `${lang === 'ar' ? 'تم التخزين بنجاح!' : 'Staked successfully!'} ${amount} LLTY`
      );

      setStakeAmount('');
    } catch (err: any) {
      console.error('Stake error:', err);
      showNotification('error', `${lang === 'ar' ? 'خطأ' : 'Error'}: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, [isConnected, address, stakeAmount, selectedDuration, connection, walletProvider, showNotification, lang]);

  const handleClaimRewards = useCallback(async () => {
    if (!isConnected || !address) {
      showNotification('error', lang === 'ar' ? 'المحفظة غير متصلة' : 'Wallet not connected');
      return;
    }
    
    // ✅ CHECK WALLET COMPATIBILITY
    const compatibilityInfo = detectWalletCompatibility(walletProvider, address);
    if (!compatibilityInfo.isCompatible) {
      const recommendedWallets = getRecommendedWallets();
      const walletList = recommendedWallets.map(w => w.name).join(', ');
      
      showNotification(
        'error',
        lang === 'ar'
          ? `${compatibilityInfo.walletName} غير متوافقة. استخدم: ${walletList}`
          : `${compatibilityInfo.walletName} is incompatible. Please use: ${walletList}`
      );
      return;
    }

    if (!stakingData || pendingRewards === 0) {
      showNotification('error', lang === 'ar' ? 'لا توجد مكافآت متاحة' : 'No rewards available');
      return;
    }

    try {
      setProcessing(true);
      showNotification('info', lang === 'ar' ? 'جاري المطالبة...' : 'Claiming...');

      const userPublicKey = new PublicKey(address);
      const buildResult = await buildClaimRewardsTransaction(userPublicKey, connection);

      if (!buildResult.success || !buildResult.transaction) {
        throw new Error(buildResult.error || 'Failed to build transaction');
      }

      const provider = walletProvider;
      if (!provider) {
        throw new Error('Wallet provider not available');
      }

      const executeResult = await executeStakingTransaction(
        buildResult.transaction,
        provider,
        connection
      );

      if (!executeResult.success) {
        throw new Error(executeResult.error || 'Transaction failed');
      }

      showNotification(
        'success',
        `${lang === 'ar' ? 'تمت المطالبة بنجاح!' : 'Claimed successfully!'} ${(pendingRewards / 1e9).toFixed(2)} LLTY`
      );
    } catch (err: any) {
      console.error('Claim error:', err);
      showNotification('error', `${lang === 'ar' ? 'خطأ' : 'Error'}: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, [isConnected, address, stakingData, pendingRewards, connection, walletProvider, showNotification, lang]);

  const handleUnstake = useCallback(async () => {
    if (!isConnected || !address) {
      showNotification('error', lang === 'ar' ? 'المحفظة غير متصلة' : 'Wallet not connected');
      return;
    }
    // ✅ CHECK WALLET COMPATIBILITY
    const compatibilityInfo = detectWalletCompatibility(walletProvider, address);
    if (!compatibilityInfo.isCompatible) {
      const recommendedWallets = getRecommendedWallets();
      const walletList = recommendedWallets.map(w => w.name).join(', ');
      
      showNotification(
        'error',
        lang === 'ar'
          ? `${compatibilityInfo.walletName} غير متوافقة. استخدم: ${walletList}`
          : `${compatibilityInfo.walletName} is incompatible. Please use: ${walletList}`
      );
      return;
    }
    
    if (!stakingData) {
      showNotification('error', lang === 'ar' ? 'لا يوجد تخزين نشط' : 'No active stake');
      return;
    }

    // Confirm early unstake if locked
    if (!isUnlocked && earlyUnstakePenalty > 0) {
      const confirmed = window.confirm(
        lang === 'ar'
          ? `تحذير: سحب مبكر سيؤدي إلى خسارة ${(earlyUnstakePenalty / 1e9).toFixed(2)} LLTY كعقوبة. هل تريد المتابعة؟`
          : `Warning: Early unstake will result in ${(earlyUnstakePenalty / 1e9).toFixed(2)} LLTY penalty. Continue?`
      );

      if (!confirmed) return;
    }

    try {
      setProcessing(true);
      showNotification('info', lang === 'ar' ? 'جاري السحب...' : 'Unstaking...');

      const userPublicKey = new PublicKey(address);
      const buildResult = await buildUnstakeTransaction(userPublicKey, connection);

      if (!buildResult.success || !buildResult.transaction) {
        throw new Error(buildResult.error || 'Failed to build transaction');
      }

      const provider = walletProvider;
      if (!provider) {
        throw new Error('Wallet provider not available');
      }

      const executeResult = await executeStakingTransaction(
        buildResult.transaction,
        provider,
        connection
      );

      if (!executeResult.success) {
        throw new Error(executeResult.error || 'Transaction failed');
      }

      showNotification(
        'success',
        lang === 'ar' ? 'تم السحب بنجاح!' : 'Unstaked successfully!'
      );
    } catch (err: any) {
      console.error('Unstake error:', err);
      showNotification('error', `${lang === 'ar' ? 'خطأ' : 'Error'}: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, [isConnected, address, stakingData, isUnlocked, earlyUnstakePenalty, connection, walletProvider, showNotification, lang]);

  return (
    <section id="staking" className="mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Lock className="mx-auto mb-4 text-yellow-400" size={64} />
          <h2 className="text-4xl font-bold text-yellow-400 mb-4">
            {lang === 'ar' ? 'تخزين LLTY' : 'LLTY Staking'}
          </h2>
          <p className="text-xl text-gray-300">
            {lang === 'ar'
              ? 'احصل على مكافآت سنوية تصل إلى 18% من خلال قفل عملات LLTY الخاصة بك'
              : 'Earn up to 18% APY by locking your LLTY tokens'}
          </p>
        </div>

        {/* Staking Pool Stats */}
        {stakingPool && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="rounded-xl p-6 text-center" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              <p className="text-sm text-gray-400 mb-2">{lang === 'ar' ? 'إجمالي المتخزين' : 'Total Staked'}</p>
              <p className="text-2xl font-bold text-yellow-400">
                {(stakingPool.totalStaked / 1e9).toLocaleString()} LLTY
              </p>
            </div>
            <div className="rounded-xl p-6 text-center" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              <p className="text-sm text-gray-400 mb-2">{lang === 'ar' ? 'عدد المستخدمين' : 'Total Stakers'}</p>
              <p className="text-2xl font-bold text-yellow-400">
                {stakingPool.totalStakers.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl p-6 text-center" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              <p className="text-sm text-gray-400 mb-2">{lang === 'ar' ? 'مكافآت موزعة' : 'Rewards Distributed'}</p>
              <p className="text-2xl font-bold text-yellow-400">
                {(stakingPool.totalRewardsDistributed / 1e9).toLocaleString()} LLTY
              </p>
            </div>
            <div className="rounded-xl p-6 text-center" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              <p className="text-sm text-gray-400 mb-2">{lang === 'ar' ? 'مجموع المكافآت' : 'Reward Pool'}</p>
              <p className="text-2xl font-bold text-yellow-400">
                {(stakingPool.rewardPoolBalance / 1e9).toLocaleString()} LLTY
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stake New Tokens */}
          <div className="rounded-2xl p-8 shadow-2xl" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid rgba(251, 191, 36, 0.3)'
          }}>
            <h3 className="text-2xl font-bold text-white mb-6">
              {lang === 'ar' ? 'تخزين عملات جديدة' : 'Stake New Tokens'}
            </h3>

            {/* Duration Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 text-gray-300">
                {lang === 'ar' ? 'اختر المدة' : 'Select Duration'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => setSelectedDuration(duration.value as any)}
                    className={`p-4 rounded-lg font-bold transition-all ${
                      selectedDuration === duration.value
                        ? 'scale-105 shadow-lg'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: selectedDuration === duration.value
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : 'rgba(51, 65, 85, 0.5)',
                      color: selectedDuration === duration.value ? '#1e293b' : '#f1f5f9',
                      border: `2px solid ${selectedDuration === duration.value ? '#fbbf24' : 'rgba(251, 191, 36, 0.3)'}`
                    }}
                  >
                    <div className="text-lg">{duration.label}</div>
                    <div className="text-sm mt-1">APY: {duration.apy}%</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                {lang === 'ar' ? 'المبلغ' : 'Amount'}
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-4 rounded-lg text-xl font-bold text-white"
                style={{
                  background: 'rgba(51, 65, 85, 0.5)',
                  border: '2px solid rgba(251, 191, 36, 0.3)'
                }}
              />
            </div>

            {/* Stake Button */}
            <button
              onClick={handleStake}
              disabled={processing || !isConnected || !stakeAmount || parseFloat(stakeAmount) <= 0}
              className="w-full py-4 rounded-xl font-bold text-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1e293b'
              }}
            >
              {processing
                ? (lang === 'ar' ? 'جاري المعالجة...' : 'Processing...')
                : (lang === 'ar' ? 'تخزين الآن' : 'Stake Now')
              }
            </button>

            {/* Info Box */}
            <div className="mt-6 rounded-lg p-4" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                <div className="text-sm text-gray-300">
                  <p className="mb-1">
                    {lang === 'ar'
                      ? `• المكافأة السنوية: ${getAPYForDuration(selectedDuration)}%`
                      : `• Annual reward: ${getAPYForDuration(selectedDuration)}%`
                    }
                  </p>
                  <p className="mb-1">
                    {lang === 'ar'
                      ? '• السحب المبكر يؤدي إلى خسارة 50% من المكافآت'
                      : '• Early unstake results in 50% penalty on rewards'
                    }
                  </p>
                  <p>
                    {lang === 'ar'
                      ? '• التخزين لمدة سنة أو أكثر يمنحك حق التصويت في DAO'
                      : '• Staking 1+ year grants DAO voting rights'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Stake */}
          <div className="rounded-2xl p-8 shadow-2xl" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid rgba(251, 191, 36, 0.3)'
          }}>
            <h3 className="text-2xl font-bold text-white mb-6">
              {lang === 'ar' ? 'التخزين الحالي' : 'Current Stake'}
            </h3>

            {stakingData && stakingData.isActive ? (
              <div className="space-y-6">
                {/* Staked Amount */}
                <div className="rounded-xl p-6" style={{
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.3)'
                }}>
                  <p className="text-sm text-gray-400 mb-2">
                    {lang === 'ar' ? 'المبلغ المتخزين' : 'Staked Amount'}
                  </p>
                  <p className="text-4xl font-bold text-yellow-400">
                    {(stakingData.amountStaked / 1e9).toLocaleString()} LLTY
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    APY: {(stakingData.apyRate / 100).toFixed(1)}%
                  </p>
                </div>

                {/* Lock Status */}
                <div className="rounded-xl p-6" style={{
                  background: isUnlocked
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${isUnlocked ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-300">
                      {lang === 'ar' ? 'حالة القفل' : 'Lock Status'}
                    </p>
                    {isUnlocked ? (
                      <CheckCircle className="text-green-400" size={20} />
                    ) : (
                      <Lock className="text-red-400" size={20} />
                    )}
                  </div>
                  <p className={`text-lg font-bold ${isUnlocked ? 'text-green-400' : 'text-red-400'}`}>
                    {isUnlocked
                      ? (lang === 'ar' ? 'مفتوح' : 'Unlocked')
                      : formatTime(timeRemaining)
                    }
                  </p>
                </div>

                {/* Pending Rewards */}
                <div className="rounded-xl p-6" style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <p className="text-sm text-gray-400 mb-2">
                    {lang === 'ar' ? 'المكافآت المعلقة' : 'Pending Rewards'}
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    {(pendingRewards / 1e9).toFixed(6)} LLTY
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleClaimRewards}
                    disabled={processing || pendingRewards === 0}
                    className="w-full py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white'
                    }}
                  >
                    {lang === 'ar' ? 'طالب بالمكافآت' : 'Claim Rewards'}
                  </button>

                  <button
                    onClick={handleUnstake}
                    disabled={processing}
                    className="w-full py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50"
                    style={{
                      background: isUnlocked
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: '#1e293b'
                    }}
                  >
                    {isUnlocked
                      ? (lang === 'ar' ? 'سحب التخزين' : 'Unstake')
                      : (lang === 'ar' ? `سحب مبكر (عقوبة ${(earlyUnstakePenalty / 1e9).toFixed(2)} LLTY)` : `Early Unstake (${(earlyUnstakePenalty / 1e9).toFixed(2)} LLTY penalty)`)
                    }
                  </button>
                </div>

                {/* DAO Eligibility */}
                {stakingData.daoEligible && (
                  <div className="rounded-lg p-4" style={{
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)'
                  }}>
                    <div className="flex items-center gap-2">
                      <Award className="text-purple-400" size={20} />
                      <p className="text-sm text-purple-300 font-semibold">
                        {lang === 'ar' ? '✨ مؤهل للتصويت في DAO' : '✨ DAO Voting Eligible'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Lock className="mx-auto mb-4 text-gray-500" size={64} />
                <p className="text-xl text-gray-400 mb-2">
                  {lang === 'ar' ? 'لا يوجد تخزين نشط' : 'No Active Stake'}
                </p>
                <p className="text-sm text-gray-500">
                  {lang === 'ar'
                    ? 'ابدأ بتخزين عملات LLTY لكسب مكافآت'
                    : 'Start staking LLTY tokens to earn rewards'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* APY Comparison Table */}
        <div className="mt-12 rounded-2xl p-8 shadow-2xl" style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(251, 191, 36, 0.2)'
        }}>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            {lang === 'ar' ? 'مقارنة العوائد السنوية' : 'APY Comparison'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-yellow-500/30">
                  <th className="text-left py-3 px-4 text-gray-300">
                    {lang === 'ar' ? 'المدة' : 'Duration'}
                  </th>
                  <th className="text-center py-3 px-4 text-gray-300">
                    {lang === 'ar' ? 'APY' : 'APY'}
                  </th>
                  <th className="text-right py-3 px-4 text-gray-300">
                    {lang === 'ar' ? 'مثال (10,000 LLTY)' : 'Example (10,000 LLTY)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {durations.map((duration) => {
                  const example = 10000 * (duration.apy / 100);
                  return (
                    <tr key={duration.value} className="border-b border-gray-700">
                      <td className="py-3 px-4 text-white font-semibold">{duration.label}</td>
                      <td className="py-3 px-4 text-center text-yellow-400 font-bold">{duration.apy}%</td>
                      <td className="py-3 px-4 text-right text-green-400">
                        +{example.toLocaleString()} LLTY
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StakingSection;
