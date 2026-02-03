import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, CheckCircle, Clock, Building, Percent } from 'lucide-react';
import { useAppKitAccount } from '@reown/appkit/react';
import profitDistributionService, { DistributionCycle, ClaimInfo } from '../../services/profitDistributionService';

interface ProfitDistributionSectionProps {
  lang: 'ar' | 'en';
  showNotification: (type: string, message: string, duration?: number) => void;
}

const ProfitDistributionSection: React.FC<ProfitDistributionSectionProps> = ({ lang, showNotification }) => {
  const { address, isConnected } = useAppKitAccount();
  const [cycles, setCycles] = useState<DistributionCycle[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<number | null>(null);

  useEffect(() => {
    loadDistributionData();
  }, [address]);

  const loadDistributionData = async () => {
    setLoading(true);
    try {
      const allCycles = await profitDistributionService.getAllCycles();
      setCycles(allCycles);

      if (address) {
        const balance = await profitDistributionService.getUserLLTYBalance(address);
        setUserBalance(balance);
      }
    } catch (error) {
      console.error('Error loading distribution data:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'finalized': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { ar: string; en: string }> = {
      active: { ar: 'نشط', en: 'Active' },
      pending: { ar: 'قيد الانتظار', en: 'Pending' },
      finalized: { ar: 'مكتمل', en: 'Finalized' }
    };
    return statusMap[status]?.[lang] || status;
  };

  // Estimate share for display
  const estimateShare = (cycle: DistributionCycle) => {
    const totalSupply = 10_000_000_000; // 10B LLTY
    return profitDistributionService.estimateUserShare(
      userBalance,
      totalSupply,
      cycle.totalDistributableAmount
    );
  };

  return (
    <section id="profit-distribution" className="mb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <DollarSign className="mx-auto mb-4 text-green-400" size={64} />
          <h2 className="text-4xl font-bold text-green-400 mb-4">
            {lang === 'ar' ? 'توزيع الأرباح' : 'Profit Distribution'}
          </h2>
          <p className="text-xl text-gray-300">
            {lang === 'ar'
              ? 'احصل على حصتك من أرباح العقارات كل ربع سنة'
              : 'Receive your share of real estate profits every quarter'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl p-6 border border-green-500/30" style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)'
          }}>
            <Building className="text-green-400 mb-2" size={24} />
            <p className="text-sm text-gray-400">
              {lang === 'ar' ? 'إجمالي التوزيعات' : 'Total Distributions'}
            </p>
            <p className="text-2xl font-bold text-white">{cycles.length}</p>
          </div>

          <div className="rounded-2xl p-6 border border-green-500/30" style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)'
          }}>
            <DollarSign className="text-green-400 mb-2" size={24} />
            <p className="text-sm text-gray-400">
              {lang === 'ar' ? 'رصيدك' : 'Your Balance'}
            </p>
            <p className="text-2xl font-bold text-white">
              {userBalance.toLocaleString()} LLTY
            </p>
          </div>

          <div className="rounded-2xl p-6 border border-green-500/30" style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)'
          }}>
            <Percent className="text-green-400 mb-2" size={24} />
            <p className="text-sm text-gray-400">
              {lang === 'ar' ? 'حصتك التقديرية' : 'Your Est. Share'}
            </p>
            <p className="text-2xl font-bold text-white">
              {((userBalance / 10_000_000_000) * 100).toFixed(6)}%
            </p>
          </div>

          <div className="rounded-2xl p-6 border border-green-500/30" style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)'
          }}>
            <TrendingUp className="text-green-400 mb-2" size={24} />
            <p className="text-sm text-gray-400">
              {lang === 'ar' ? 'التوزيعات النشطة' : 'Active Distributions'}
            </p>
            <p className="text-2xl font-bold text-white">
              {cycles.filter(c => c.status === 'active').length}
            </p>
          </div>
        </div>

        {/* Distribution Cycles */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white mb-4">
            {lang === 'ar' ? 'دورات التوزيع' : 'Distribution Cycles'}
          </h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full"></div>
            </div>
          ) : cycles.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-gray-700" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            }}>
              <DollarSign className="mx-auto mb-4 text-gray-500" size={64} />
              <p className="text-xl text-gray-400">
                {lang === 'ar' ? 'لا توجد توزيعات حتى الآن' : 'No distributions yet'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {lang === 'ar'
                  ? 'سيتم الإعلان عن التوزيعات بعد أول استثمار عقاري'
                  : 'Distributions will be announced after the first property investment'}
              </p>
            </div>
          ) : (
            cycles.map((cycle) => {
              const estimatedShare = estimateShare(cycle);
              
              return (
                <div
                  key={cycle.id}
                  className="rounded-2xl p-6 border-2 transition-all hover:border-green-500/50 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    borderColor: selectedCycle === cycle.id ? '#22c55e' : 'rgba(34, 197, 94, 0.2)'
                  }}
                  onClick={() => setSelectedCycle(selectedCycle === cycle.id ? null : cycle.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-white">
                          Q{cycle.quarter} {cycle.year}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(cycle.status)}`}>
                          {getStatusText(cycle.status)}
                        </span>
                      </div>
                      <p className="text-gray-400">{cycle.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {lang === 'ar' ? 'إجمالي التوزيع' : 'Total Distribution'}
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        {formatCurrency(cycle.totalDistributableAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'المطالب به' : 'Claimed'}
                      </span>
                      <span className="text-green-400">
                        {((cycle.totalClaimed / cycle.totalDistributableAmount) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${(cycle.totalClaimed / cycle.totalDistributableAmount) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedCycle === cycle.id && (
                    <div className="border-t border-gray-700 pt-4 mt-4 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">
                            {lang === 'ar' ? 'إجمالي الأرباح' : 'Gross Profit'}
                          </p>
                          <p className="font-bold text-white">{formatCurrency(cycle.totalProfitGross)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            {lang === 'ar' ? 'المستفيدون' : 'Claimants'}
                          </p>
                          <p className="font-bold text-white">{cycle.totalClaimants.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            {lang === 'ar' ? 'نوع العملة' : 'Token Type'}
                          </p>
                          <p className="font-bold text-white">{cycle.tokenType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            {lang === 'ar' ? 'ينتهي في' : 'Ends'}
                          </p>
                          <p className="font-bold text-white">{formatDate(cycle.claimEndTime)}</p>
                        </div>
                      </div>

                      {/* User's Estimated Share */}
                      {isConnected && userBalance > 0 && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">
                                {lang === 'ar' ? 'حصتك التقديرية' : 'Your Estimated Share'}
                              </p>
                              <p className="text-2xl font-bold text-green-400">
                                {formatCurrency(estimatedShare)}
                              </p>
                            </div>
                            {cycle.status === 'active' && (
                              <button
                                disabled={claiming}
                                className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50"
                                style={{
                                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                  color: 'white'
                                }}
                              >
                                {claiming ? (
                                  <span className="flex items-center gap-2">
                                    <Clock className="animate-spin" size={16} />
                                    {lang === 'ar' ? 'جاري...' : 'Processing...'}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    {lang === 'ar' ? 'المطالبة' : 'Claim'}
                                  </span>
                                )}
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {lang === 'ar'
                              ? '* التقدير بناءً على رصيدك الحالي. المبلغ الفعلي يعتمد على اللقطة'
                              : '* Estimate based on current balance. Actual amount depends on snapshot'}
                          </p>
                        </div>
                      )}

                      {/* Property Info */}
                      {cycle.propertyAddress && (
                        <div className="p-4 rounded-xl bg-slate-800/50 border border-gray-700">
                          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                            <Building size={16} />
                            {lang === 'ar' ? 'تفاصيل العقار' : 'Property Details'}
                          </h4>
                          <p className="text-gray-400">{cycle.propertyAddress}</p>
                          {cycle.propertyValue && (
                            <p className="text-sm text-gray-500 mt-1">
                              {lang === 'ar' ? 'القيمة:' : 'Value:'} {formatCurrency(cycle.propertyValue)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 rounded-2xl border border-green-500/30" style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.05) 100%)'
        }}>
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-400" />
            {lang === 'ar' ? 'كيف يعمل توزيع الأرباح؟' : 'How Profit Distribution Works'}
          </h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• {lang === 'ar' ? 'يتم توزيع الأرباح كل ربع سنة من إيرادات العقارات' : 'Profits are distributed quarterly from property income'}</li>
            <li>• {lang === 'ar' ? 'حصتك تعتمد على رصيد LLTY الخاص بك في وقت اللقطة' : 'Your share is based on your LLTY balance at snapshot time'}</li>
            <li>• {lang === 'ar' ? 'يتم الدفع بعملة USDC مباشرة إلى محفظتك' : 'Payments are made in USDC directly to your wallet'}</li>
            <li>• {lang === 'ar' ? 'لديك 90 يومًا للمطالبة بحصتك من كل توزيع' : 'You have 90 days to claim your share from each distribution'}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProfitDistributionSection;
