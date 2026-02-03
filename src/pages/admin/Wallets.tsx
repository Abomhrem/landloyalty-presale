import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { ADMIN_CONFIG } from '../../admin-config';

interface WalletBalance {
  sol: number;
  usdc: number;
  usdt: number;
  llty: number;
  address: string;
}

interface WalletsData {
  llty: WalletBalance;
  usdc: WalletBalance;
  usdt: WalletBalance;
  presale: WalletBalance;
}

const Wallets: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<WalletsData>({
    llty: { sol: 0, usdc: 0, usdt: 0, llty: 0, address: '' },
    usdc: { sol: 0, usdc: 0, usdt: 0, llty: 0, address: '' },
    usdt: { sol: 0, usdc: 0, usdt: 0, llty: 0, address: '' },
    presale: { sol: 0, usdc: 0, usdt: 0, llty: 0, address: '' }
  });

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setLoading(true);
      const balances = await adminService.fetchWalletBalances();
      setWallets(balances);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const walletsData = [
    { key: 'llty' as keyof WalletsData, name: 'LLTY Vault', address: ADMIN_CONFIG.wallets.vaults.llty, type: 'vault', color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30' },
    { key: 'usdc' as keyof WalletsData, name: 'USDC Vault', address: ADMIN_CONFIG.wallets.vaults.usdc, type: 'vault', color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30' },
    { key: 'usdt' as keyof WalletsData, name: 'USDT Vault', address: ADMIN_CONFIG.wallets.vaults.usdt, type: 'vault', color: 'from-green-500/20 to-green-600/20 border-green-500/30' },
    { key: 'presale' as keyof WalletsData, name: 'Presale PDA', address: ADMIN_CONFIG.wallets.presale, type: 'presale', color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30' },
  ];

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    alert('Address copied!');
  };

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h2', { className: 'text-3xl font-black text-white' }, 'Wallet Management'),
        React.createElement('p', { className: 'text-sm text-gray-400 mt-1' }, 'Live balances from Solana blockchain')
      ),
      React.createElement('button', {
        onClick: loadWallets,
        disabled: loading,
        className: 'px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold hover:scale-105 transition-all disabled:opacity-50'
      }, loading ? 'Loading...' : '🔄 Refresh Balances')
    ),
    React.createElement('div', { className: 'grid gap-6' },
      walletsData.map((wallet) =>
        React.createElement('div', {
          key: wallet.key,
          className: `rounded-2xl p-8 border bg-gradient-to-br ${wallet.color} backdrop-blur-xl shadow-2xl`
        },
          React.createElement('div', { className: 'flex items-start justify-between mb-6' },
            React.createElement('div', { className: 'flex items-center gap-4' },
              React.createElement('div', { className: 'w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center backdrop-blur-xl border border-white/20' },
                React.createElement('span', { className: 'text-3xl' }, wallet.type === 'vault' ? '👛' : '🏦')
              ),
              React.createElement('div', null,
                React.createElement('h3', { className: 'text-2xl font-black text-white' }, wallet.name),
                React.createElement('div', { className: 'flex items-center gap-2 mt-2' },
                  React.createElement('p', { className: 'text-sm text-gray-300 font-mono bg-black/30 px-3 py-1 rounded-lg' }, `${wallet.address.slice(0, 12)}...${wallet.address.slice(-12)}`),
                  React.createElement('button', {
                    onClick: () => copyAddress(wallet.address),
                    className: 'p-2 hover:bg-white/10 rounded-lg transition-all',
                    title: 'Copy'
                  }, React.createElement('span', { className: 'text-lg' }, '📋')),
                  React.createElement('a', {
                    href: `https://explorer.solana.com/address/${wallet.address}?cluster=devnet`,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'p-2 hover:bg-white/10 rounded-lg transition-all',
                    title: 'Explorer'
                  }, React.createElement('span', { className: 'text-lg' }, '🔗'))
                )
              )
            ),
            React.createElement('span', {
              className: `px-4 py-2 rounded-full text-sm font-bold ${wallet.type === 'vault' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`
            }, wallet.type.toUpperCase())
          ),
          React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
            [
              { label: 'SOL', value: wallets[wallet.key]?.sol || 0, decimals: 4 },
              { label: 'USDC', value: wallets[wallet.key]?.usdc || 0, decimals: 2 },
              { label: 'USDT', value: wallets[wallet.key]?.usdt || 0, decimals: 2 },
              { label: 'LLTY', value: wallets[wallet.key]?.llty || 0, decimals: 0 }
            ].map((token, idx) =>
              React.createElement('div', { key: idx, className: 'bg-black/30 backdrop-blur-xl rounded-xl p-4 border border-white/10' },
                React.createElement('p', { className: 'text-xs text-gray-400 font-bold mb-2' }, token.label),
                React.createElement('p', { className: 'text-2xl font-black text-white' },
                  loading ? '...' : token.value.toLocaleString('en-US', { minimumFractionDigits: token.decimals, maximumFractionDigits: token.decimals })
                )
              )
            )
          )
        )
      )
    )
  );
};

export default Wallets;
