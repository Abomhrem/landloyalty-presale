import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { ADMIN_CONFIG } from '../../admin-config';

const PROGRAM_ID = new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo');
const PROPOSAL_COUNTER = new PublicKey('EG3ppJc1w9Rwnr4PazycjmSiCfVBA6yioL8WdewTVuZ5');

export default function DAOAdminPanel() {
  const [loading, setLoading] = useState(true);
  const [daoStatus, setDaoStatus] = useState<{
    initialized: boolean;
    proposalCount: number;
    counterAddress: string;
  } | null>(null);

  useEffect(() => {
    checkDAOStatus();
  }, []);

  const checkDAOStatus = async () => {
    setLoading(true);
    try {
      const connection = new Connection(ADMIN_CONFIG.rpc.devnet, 'confirmed');
      
      // Check if proposal counter exists
      const counterAccount = await connection.getAccountInfo(PROPOSAL_COUNTER);
      
      if (counterAccount) {
        // Parse next_id from counter
        const dataView = new DataView(counterAccount.data.buffer, counterAccount.data.byteOffset);
        const nextId = Number(dataView.getBigUint64(8, true));
        
        setDaoStatus({
          initialized: true,
          proposalCount: nextId - 1,
          counterAddress: PROPOSAL_COUNTER.toString()
        });
      } else {
        setDaoStatus({
          initialized: false,
          proposalCount: 0,
          counterAddress: PROPOSAL_COUNTER.toString()
        });
      }
    } catch (error) {
      console.error('Error checking DAO status:', error);
      setDaoStatus({
        initialized: false,
        proposalCount: 0,
        counterAddress: PROPOSAL_COUNTER.toString()
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🏛️</span> DAO Governance Status
        </h3>
        <button
          onClick={checkDAOStatus}
          className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
          <p className="text-sm text-gray-400">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-3 h-3 rounded-full ${daoStatus?.initialized ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <p className="font-bold text-white">
              {daoStatus?.initialized ? 'Initialized' : 'Not Initialized'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
          <p className="text-sm text-gray-400">Total Proposals</p>
          <p className="text-xl font-bold text-yellow-400">{daoStatus?.proposalCount || 0}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
          <p className="text-sm text-gray-400">Counter PDA</p>
          <p className="text-xs font-mono text-gray-300 truncate" title={daoStatus?.counterAddress}>
            {daoStatus?.counterAddress?.slice(0, 8)}...{daoStatus?.counterAddress?.slice(-8)}
          </p>
        </div>
      </div>

      {daoStatus?.initialized && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <p className="text-green-400 text-sm flex items-center gap-2">
            <span>✅</span>
            DAO governance is active. Users can create and vote on proposals.
          </p>
        </div>
      )}

      {!daoStatus?.initialized && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-yellow-400 text-sm flex items-center gap-2">
            <span>⚠️</span>
            DAO governance needs to be initialized. Run the initialization script.
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="text-sm font-bold text-white mb-3">DAO Configuration</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Min Proposal Power:</span>
            <span className="text-white">100 LLTY</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Voting Period:</span>
            <span className="text-white">7 days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Quorum Required:</span>
            <span className="text-white">4%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Stake Multiplier:</span>
            <span className="text-white">2x voting power</span>
          </div>
        </div>
      </div>
    </div>
  );
}
