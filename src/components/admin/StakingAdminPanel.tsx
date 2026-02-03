import React, { useState } from 'react';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { PublicKey } from '@solana/web3.js';
import { getConnection } from '../../services/blockchainService';
import { initializeStakingPool } from '../../services/adminService';

export default function StakingAdminPanel() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('solana');
  const [isInitializing, setIsInitializing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInitialize = async () => {
    if (!isConnected || !address || !walletProvider) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    setIsInitializing(true);
    setMessage(null);

    try {
      const connection = getConnection();
      const userPublicKey = new PublicKey(address);

      const result = await initializeStakingPool(connection, userPublicKey, walletProvider);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Staking pool initialized! Signature: ${result.signature}`,
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to initialize staking pool',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred',
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Staking Pool Administration
      </h2>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Initialize Staking Pool
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            This creates the staking pool account on-chain. Only needs to be done once.
          </p>
          <button
            onClick={handleInitialize}
            disabled={isInitializing || !isConnected}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isInitializing ? 'Initializing...' : 'Initialize Staking Pool'}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}
          >
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
