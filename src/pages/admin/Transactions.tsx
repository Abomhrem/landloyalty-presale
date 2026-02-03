import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

interface Transaction {
  id: string;
  signature: string;
  wallet: string;
  walletFull: string;
  amount: number;
  token: string;
  llty: number;
  date: string;
  timestamp: number;
  status: string;
}

const Transactions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      console.log('Loading transactions...');
      const txs = await adminService.fetchTransactions(100);
      setTransactions(txs);
      console.log('Loaded:', txs.length);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'space-y-6' },
      React.createElement('h2', { className: 'text-3xl font-black text-white' }, 'Transaction History'),
      React.createElement('div', { className: 'text-center py-12' },
        React.createElement('div', { className: 'w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4' }),
        React.createElement('p', { className: 'text-gray-400 font-semibold' }, 'Loading transactions from blockchain...')
      )
    );
  }

  if (transactions.length === 0) {
    return React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-3xl font-black text-white' }, 'Transaction History'),
          React.createElement('p', { className: 'text-sm text-gray-400 mt-1' }, 'Real-time data from Solana blockchain')
        ),
        React.createElement('button', {
          onClick: loadTransactions,
          className: 'px-6 py-3 rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 font-bold'
        }, '🔄 Refresh')
      ),
      React.createElement('div', { className: 'rounded-2xl p-12 border border-yellow-500/20 bg-gradient-to-br from-slate-900/50 to-slate-800/50 text-center' },
        React.createElement('p', { className: 'text-2xl font-bold text-gray-400' }, 'No transactions found'),
        React.createElement('p', { className: 'text-sm text-gray-500 mt-2' }, 'Transactions will appear here once the presale begins')
      )
    );
  }

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h2', { className: 'text-3xl font-black text-white' }, 'Transaction History'),
        React.createElement('p', { className: 'text-sm text-gray-400 mt-1' }, 'Real-time data from Solana blockchain')
      ),
      React.createElement('button', {
        onClick: loadTransactions,
        disabled: loading,
        className: 'px-6 py-3 rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 font-bold disabled:opacity-50'
      }, '🔄 Refresh')
    ),
    React.createElement('div', { className: 'rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl overflow-hidden shadow-2xl' },
      React.createElement('div', { className: 'overflow-x-auto' },
        React.createElement('table', { className: 'w-full' },
          React.createElement('thead', { className: 'bg-slate-950/50 border-b border-yellow-500/10' },
            React.createElement('tr', null,
              React.createElement('th', { className: 'px-6 py-4 text-left text-sm font-black text-gray-300' }, 'TX ID'),
              React.createElement('th', { className: 'px-6 py-4 text-left text-sm font-black text-gray-300' }, 'Wallet'),
              React.createElement('th', { className: 'px-6 py-4 text-left text-sm font-black text-gray-300' }, 'Amount'),
              React.createElement('th', { className: 'px-6 py-4 text-left text-sm font-black text-gray-300' }, 'LLTY Received'),
              React.createElement('th', { className: 'px-6 py-4 text-left text-sm font-black text-gray-300' }, 'Date'),
              React.createElement('th', { className: 'px-6 py-4 text-left text-sm font-black text-gray-300' }, 'Status'),
              React.createElement('th', { className: 'px-6 py-4 text-left text-sm font-black text-gray-300' }, 'View')
            )
          ),
          React.createElement('tbody', null,
            transactions.map((tx) =>
              React.createElement('tr', { key: tx.signature, className: 'border-t border-gray-700/30 hover:bg-slate-900/50 transition-colors' },
                React.createElement('td', { className: 'px-6 py-4' },
                  React.createElement('span', { className: 'text-sm font-mono text-yellow-400 font-bold' }, tx.id)
                ),
                React.createElement('td', { className: 'px-6 py-4' },
                  React.createElement('span', { className: 'text-sm font-mono text-white font-semibold' }, tx.wallet)
                ),
                React.createElement('td', { className: 'px-6 py-4' },
                  React.createElement('span', { className: 'text-sm text-white font-bold' }, `${tx.amount.toFixed(4)} ${tx.token}`)
                ),
                React.createElement('td', { className: 'px-6 py-4' },
                  React.createElement('span', { className: 'text-sm text-green-400 font-bold' }, `${tx.llty.toLocaleString()} LLTY`)
                ),
                React.createElement('td', { className: 'px-6 py-4' },
                  React.createElement('span', { className: 'text-sm text-gray-400 font-medium' }, tx.date)
                ),
                React.createElement('td', { className: 'px-6 py-4' },
                  React.createElement('span', {
                    className: `px-3 py-1 rounded-full text-xs font-bold ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`
                  }, tx.status)
                ),
                React.createElement('td', { className: 'px-6 py-4' },
                  React.createElement('a', {
                    href: `https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'text-blue-400 hover:text-blue-300 font-bold text-sm'
                  }, '🔗 Explorer')
                )
              )
            )
          )
        )
      )
    )
  );
};

export default Transactions;
