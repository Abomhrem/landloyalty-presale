import React, { useState, useEffect } from 'react';
import DAOAdminPanel from '../../components/admin/DAOAdminPanel';
import { fetchPresaleStats, fetchTreasuryTotals, fetchWalletBalances } from '../../services/adminService';
import { usePresaleTiming } from '../../hooks/usePresaleTiming';

interface DashboardStats {
  totalRaised: number;
  totalTokensSold: number;
  totalBuyers: number;
  currentPhase: string;
  isActive: boolean;
}

interface TreasuryTotals {
  sol: number;
  usdc: number;
  usdt: number;
  llty: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [treasury, setTreasury] = useState<TreasuryTotals | null>(null);
  const [wallets, setWallets] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { timing } = usePresaleTiming();

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const [presaleStats, treasuryTotals, walletBalances] = await Promise.all([
        fetchPresaleStats().catch(() => null),
        fetchTreasuryTotals().catch(() => null),
        fetchWalletBalances().catch(() => null)
      ]);
      if (presaleStats) setStats(presaleStats);
      if (treasuryTotals) setTreasury(treasuryTotals);
      if (walletBalances) setWallets(walletBalances);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | undefined | null, decimals: number = 2): string => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toFixed(decimals);
  };

  const formatCurrency = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return '$0.00';
    return '$' + num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-400 mt-1">Real-time presale metrics</p>
        </div>
        <button onClick={loadDashboardData} className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all">
          Refresh
        </button>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30 p-6">
          <p className="text-sm text-gray-400">Total Raised</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats?.totalRaised)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
          <p className="text-sm text-gray-400">Tokens Sold</p>
          <p className="text-2xl font-bold text-white">{formatNumber(stats?.totalTokensSold)} LLTY</p>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
          <p className="text-sm text-gray-400">Total Buyers</p>
          <p className="text-2xl font-bold text-white">{stats?.totalBuyers || 0}</p>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
          <p className="text-sm text-gray-400">Current Phase</p>
          <p className="text-2xl font-bold text-white">{stats?.currentPhase || 'Phase 1'}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Treasury Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
            <p className="text-sm text-gray-400">SOL Balance</p>
            <p className="text-xl font-bold text-purple-400">{(treasury?.sol || 0).toFixed(4)} SOL</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
            <p className="text-sm text-gray-400">USDC Collected</p>
            <p className="text-xl font-bold text-blue-400">${formatNumber(treasury?.usdc)}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
            <p className="text-sm text-gray-400">USDT Collected</p>
            <p className="text-xl font-bold text-green-400">${formatNumber(treasury?.usdt)}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
            <p className="text-sm text-gray-400">LLTY in Vault</p>
            <p className="text-xl font-bold text-yellow-400">{formatNumber(treasury?.llty)}</p>
          </div>
        </div>
      </div>

      {wallets && (
        <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Vault Balances</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
              <p className="text-sm text-gray-400">LLTY Vault</p>
              <p className="font-bold text-white">{formatNumber(wallets.llty?.llty)} LLTY</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
              <p className="text-sm text-gray-400">USDC Vault</p>
              <p className="font-bold text-white">${formatNumber(wallets.usdc?.usdc)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
              <p className="text-sm text-gray-400">USDT Vault</p>
              <p className="font-bold text-white">${formatNumber(wallets.usdt?.usdt)}</p>
            </div>
          </div>
        </div>
      )}

      <DAOAdminPanel />

      <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/transactions" className="p-4 rounded-xl bg-slate-900/50 border border-gray-700 hover:border-yellow-500/50 transition-all text-center">
            <span className="text-2xl">💸</span>
            <p className="text-sm font-medium text-white mt-2">Transactions</p>
          </a>
          <a href="/admin/wallets" className="p-4 rounded-xl bg-slate-900/50 border border-gray-700 hover:border-yellow-500/50 transition-all text-center">
            <span className="text-2xl">👛</span>
            <p className="text-sm font-medium text-white mt-2">Wallets</p>
          </a>
          <a href="/admin/reports" className="p-4 rounded-xl bg-slate-900/50 border border-gray-700 hover:border-yellow-500/50 transition-all text-center">
            <span className="text-2xl">📊</span>
            <p className="text-sm font-medium text-white mt-2">Reports</p>
          </a>
          <a href="/admin/settings" className="p-4 rounded-xl bg-slate-900/50 border border-gray-700 hover:border-yellow-500/50 transition-all text-center">
            <span className="text-2xl">⚙️</span>
            <p className="text-sm font-medium text-white mt-2">Settings</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
