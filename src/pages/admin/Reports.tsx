import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ADMIN_CONFIG } from '../../admin-config';

interface PresaleStats {
  totalRaisedUSD: number;
  totalTokensSold: number;
  totalBuyers: number;
  avgPurchaseSize: number;
  solRaised: number;
  usdcRaised: number;
  usdtRaised: number;
}

interface DailyData {
  date: string;
  sales: number;
  buyers: number;
  volume: number;
}

const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<PresaleStats>({
    totalRaisedUSD: 0,
    totalTokensSold: 0,
    totalBuyers: 0,
    avgPurchaseSize: 0,
    solRaised: 0,
    usdcRaised: 0,
    usdtRaised: 0
  });
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [tokenDistribution, setTokenDistribution] = useState<any[]>([]);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    
    try {
      const connection = new Connection(ADMIN_CONFIG.rpc.devnet, 'confirmed');
      
      // Fetch presale account data
      const presalePDA = new PublicKey(ADMIN_CONFIG.blockchain.presalePda);
      const accountInfo = await connection.getAccountInfo(presalePDA);
      
      if (accountInfo) {
        // Parse presale data (simplified - in production parse actual struct)
        // For demo, using mock data
        setStats({
          totalRaisedUSD: 125000,
          totalTokensSold: 31250000,
          totalBuyers: 156,
          avgPurchaseSize: 801.28,
          solRaised: 450,
          usdcRaised: 75000,
          usdtRaised: 50000
        });
      }

      // Generate daily data for chart
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const mockDailyData: DailyData[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        mockDailyData.push({
          date: date.toISOString().split('T')[0],
          sales: Math.floor(Math.random() * 500000) + 100000,
          buyers: Math.floor(Math.random() * 20) + 5,
          volume: Math.floor(Math.random() * 10000) + 2000
        });
      }
      setDailyData(mockDailyData);

      // Token distribution
      setTokenDistribution([
        { name: 'Presale Vault', value: 4999591713, color: '#fbbf24' },
        { name: 'Team Wallet', value: 2000000000, color: '#8b5cf6' },
        { name: 'Liquidity Pool', value: 2000000000, color: '#3b82f6' },
        { name: 'Marketing', value: 1000000000, color: '#10b981' },
        { name: 'Sold', value: 408287, color: '#ef4444' }
      ]);

    } catch (error) {
      console.error('Error fetching report data:', error);
    }
    
    setLoading(false);
  };

  const exportReport = (format: 'csv' | 'pdf' | 'json') => {
    const data = {
      generatedAt: new Date().toISOString(),
      dateRange,
      stats,
      dailyData
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `landloyalty-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      let csv = 'Date,Sales (LLTY),Buyers,Volume (USD)\n';
      dailyData.forEach(d => {
        csv += `${d.date},${d.sales},${d.buyers},${d.volume}\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `landloyalty-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const reports = [
    { id: 'overview', label: 'Sales Overview', icon: '📊' },
    { id: 'tokens', label: 'Token Distribution', icon: '🪙' },
    { id: 'buyers', label: 'Buyer Analytics', icon: '👥' },
    { id: 'revenue', label: 'Revenue Breakdown', icon: '💰' },
    { id: 'phases', label: 'Phase Analysis', icon: '📈' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-gray-400 mt-1">Comprehensive presale performance data</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
          <div className="relative group">
            <button className="px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center gap-2">
              📥 Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-xl border border-gray-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => exportReport('csv')}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 rounded-t-xl transition-all"
              >
                📊 Export as CSV
              </button>
              <button
                onClick={() => exportReport('json')}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-all"
              >
                📄 Export as JSON
              </button>
              <button
                onClick={() => exportReport('pdf')}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 rounded-b-xl transition-all"
              >
                📑 Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reports.map(report => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeReport === report.id
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <span>{report.icon}</span>
            <span className="font-medium">{report.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">💰</span>
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">+12.5%</span>
          </div>
          <p className="text-sm text-gray-400">Total Raised</p>
          <p className="text-2xl font-bold text-white">${formatNumber(stats.totalRaisedUSD)}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-yellow-500/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🪙</span>
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">+8.3%</span>
          </div>
          <p className="text-sm text-gray-400">Tokens Sold</p>
          <p className="text-2xl font-bold text-white">{formatNumber(stats.totalTokensSold)}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-yellow-500/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">👥</span>
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">+15.2%</span>
          </div>
          <p className="text-sm text-gray-400">Total Buyers</p>
          <p className="text-2xl font-bold text-white">{stats.totalBuyers}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-yellow-500/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-sm text-gray-400">Avg Purchase</p>
          <p className="text-2xl font-bold text-white">${stats.avgPurchaseSize.toFixed(2)}</p>
        </div>
      </div>

      {/* Main Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-yellow-500/10 p-6">
          <h3 className="text-lg font-bold text-white mb-6">Sales Over Time</h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Simple bar chart */}
              <div className="flex items-end gap-1 h-48">
                {dailyData.slice(-14).map((d, i) => {
                  const maxSales = Math.max(...dailyData.map(x => x.sales));
                  const height = (d.sales / maxSales) * 100;
                  return (
                    <div key={i} className="flex-1 group relative">
                      <div
                        className="w-full bg-gradient-to-t from-yellow-500 to-orange-500 rounded-t transition-all hover:from-yellow-400 hover:to-orange-400"
                        style={{ height: `${height}%` }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                        {formatNumber(d.sales)} LLTY
                        <br />
                        {d.date}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>{dailyData[dailyData.length - 14]?.date}</span>
                <span>{dailyData[dailyData.length - 1]?.date}</span>
              </div>
            </div>
          )}
        </div>

        {/* Token Distribution */}
        <div className="bg-slate-800/50 rounded-xl border border-yellow-500/10 p-6">
          <h3 className="text-lg font-bold text-white mb-6">Token Distribution</h3>
          
          <div className="space-y-4">
            {tokenDistribution.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">{item.name}</span>
                  <span className="text-sm font-medium text-white">{formatNumber(item.value)}</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.value / 10000000000) * 100}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Supply</span>
              <span className="text-lg font-bold text-white">10B LLTY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-slate-800/50 rounded-xl border border-yellow-500/10 p-6">
        <h3 className="text-lg font-bold text-white mb-6">Revenue by Payment Method</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">◎</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">SOL</p>
                <p className="text-xl font-bold text-white">{stats.solRaised} SOL</p>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '36%' }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">36% of total</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-2xl">$</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">USDC</p>
                <p className="text-xl font-bold text-white">${formatNumber(stats.usdcRaised)}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">60% of total</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-2xl">₮</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">USDT</p>
                <p className="text-xl font-bold text-white">${formatNumber(stats.usdtRaised)}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '40%' }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">40% of total</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-slate-800/50 rounded-xl border border-yellow-500/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Top Buyers</h3>
          <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
            View All →
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Wallet</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Tokens Purchased</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Total Spent</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Purchases</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, wallet: 'B85G...tcbd', tokens: 67725.575, spent: 270.90, purchases: 5 },
                { rank: 2, wallet: 'DQJn...VAJ', tokens: 50000, spent: 200, purchases: 2 },
                { rank: 3, wallet: 'AB6G...TZ4', tokens: 41000, spent: 164, purchases: 1 },
              ].map((buyer, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-slate-800/50">
                  <td className="py-4 px-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      buyer.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      buyer.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {buyer.rank}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm text-white">{buyer.wallet}</td>
                  <td className="py-4 px-4 text-white">{formatNumber(buyer.tokens)} LLTY</td>
                  <td className="py-4 px-4 text-green-400">${buyer.spent.toFixed(2)}</td>
                  <td className="py-4 px-4 text-gray-400">{buyer.purchases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
