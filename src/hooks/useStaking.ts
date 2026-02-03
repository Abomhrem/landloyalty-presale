import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getStakingInfo } from '../services/stakingService';

interface StakingData {
  stakedAmount: number;
  rewards: number;
  apy: number;
  loading: boolean;
  error: string | null;
  poolInitialized: boolean;
}

export const useStaking = (
  walletAddress?: string,
  connection?: Connection
): StakingData => {
  const [stakedAmount, setStakedAmount] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [apy, setApy] = useState(25); // Default APY
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poolInitialized, setPoolInitialized] = useState(false);

     useEffect(() => {
    console.log('🔍 useStaking hook called with:', { walletAddress, hasConnection: !!connection });
    if (!walletAddress || !connection) {
      console.log('⚠️ Staking: Waiting for wallet connection...', { walletAddress, connection: !!connection });
      setStakedAmount(0);
      setRewards(0);
      setPoolInitialized(false);
      return;
    }

    const fetchStakingData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('🔍 Fetching staking data...');

        const userPublicKey = new PublicKey(walletAddress);
        const data = await getStakingInfo(userPublicKey, connection);
        
        if (!data) {
          console.log('⚠️ Staking pool not initialized');
          setPoolInitialized(false);
          setStakedAmount(0);
          setRewards(0);
          setApy(25); // Default APY
        } else {
          console.log('✅ Staking data fetched:', data);
          setStakedAmount(data.amountStaked || 0);
          setRewards(data.pendingRewards || 0);
          setApy(data.apyRate || 25);
          setPoolInitialized(true);
        }

      } catch (err: any) {
        console.warn('⚠️ Staking fetch error:', err.message);
        setError(err.message);
        setPoolInitialized(false);
        setStakedAmount(0);
        setRewards(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStakingData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStakingData, 30000);

    return () => clearInterval(interval);
  }, [walletAddress, connection]);

  return {
    stakedAmount,
    rewards,
    apy,
    loading,
    error,
    poolInitialized
  };
};
