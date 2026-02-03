// ============================================================================
// ADMIN SERVICE - REAL-TIME BLOCKCHAIN DATA
// ============================================================================
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ADMIN_CONFIG } from '../admin-config';

const RPC_ENDPOINT = ADMIN_CONFIG.rpc.devnet;
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Rate limiting helper
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 200; // ms between requests

const rateLimitedRequest = async <T>(fn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
  return fn();
};

// ============================================================================
// WALLET BALANCES
// ============================================================================
export const fetchWalletBalances = async () => {
  try {
    console.log('📊 Fetching real wallet balances...');

    const balances = {
      llty: { sol: 0, usdc: 0, usdt: 0, llty: 0, address: ADMIN_CONFIG.wallets.vaults.llty },
      usdc: { sol: 0, usdc: 0, usdt: 0, llty: 0, address: ADMIN_CONFIG.wallets.vaults.usdc },
      usdt: { sol: 0, usdc: 0, usdt: 0, llty: 0, address: ADMIN_CONFIG.wallets.vaults.usdt },
      presale: { sol: 0, usdc: 0, usdt: 0, llty: 0, address: ADMIN_CONFIG.wallets.presale }
    };

    // Fetch SOL balances for each vault
    const vaultEntries = Object.entries(ADMIN_CONFIG.wallets.vaults);
    for (const [key, vault] of vaultEntries) {
      if (key === 'sol') continue; // Skip sol vault for SOL balance (it's a PDA)
      try {
        const pubkey = new PublicKey(vault);
        const balance = await rateLimitedRequest(() => connection.getBalance(pubkey));
        if (balances[key as keyof typeof balances]) {
          balances[key as keyof typeof balances].sol = balance / LAMPORTS_PER_SOL;
        }
      } catch (error) {
        console.error(`Error fetching SOL for ${key}:`, error);
      }
    }

    // Fetch presale PDA SOL balance
    try {
      const presalePubkey = new PublicKey(ADMIN_CONFIG.wallets.presale);
      const balance = await rateLimitedRequest(() => connection.getBalance(presalePubkey));
      balances.presale.sol = balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching presale SOL:', error);
    }

    // Fetch token balances (USDC, USDT, LLTY)
    const tokenMints = {
      usdc: new PublicKey(ADMIN_CONFIG.blockchain.usdcMint),
      usdt: new PublicKey(ADMIN_CONFIG.blockchain.usdtMint),
      llty: new PublicKey(ADMIN_CONFIG.blockchain.lltyMint)
    };

    // Fetch LLTY vault token balance (the main one with ~5B tokens)
    try {
      const lltyVaultPubkey = new PublicKey(ADMIN_CONFIG.wallets.vaults.llty);
      const tokenBalance = await rateLimitedRequest(() => 
        connection.getTokenAccountBalance(lltyVaultPubkey)
      );
      balances.llty.llty = parseFloat(tokenBalance.value.uiAmount?.toString() || '0');
    } catch (error) {
      console.error('Error fetching LLTY vault balance:', error);
    }

    // Fetch USDC vault balance
    try {
      const usdcVaultPubkey = new PublicKey(ADMIN_CONFIG.wallets.vaults.usdc);
      const tokenBalance = await rateLimitedRequest(() => 
        connection.getTokenAccountBalance(usdcVaultPubkey)
      );
      balances.usdc.usdc = parseFloat(tokenBalance.value.uiAmount?.toString() || '0');
    } catch (error) {
      console.error('Error fetching USDC vault balance:', error);
    }

    // Fetch USDT vault balance
    try {
      const usdtVaultPubkey = new PublicKey(ADMIN_CONFIG.wallets.vaults.usdt);
      const tokenBalance = await rateLimitedRequest(() => 
        connection.getTokenAccountBalance(usdtVaultPubkey)
      );
      balances.usdt.usdt = parseFloat(tokenBalance.value.uiAmount?.toString() || '0');
    } catch (error) {
      console.error('Error fetching USDT vault balance:', error);
    }

    console.log('✅ Wallet balances fetched:', balances);
    return balances;
  } catch (error) {
    console.error('❌ Error fetching wallet balances:', error);
    throw error;
  }
};

// ============================================================================
// PRESALE STATISTICS
// ============================================================================
export const fetchPresaleStats = async () => {
  try {
    console.log('📊 Fetching presale statistics...');

    const presalePubkey = new PublicKey(ADMIN_CONFIG.blockchain.presalePda);

    // Fetch presale account data
    const accountInfo = await rateLimitedRequest(() => connection.getAccountInfo(presalePubkey));

    if (!accountInfo) {
      console.warn('⚠️ Presale account not initialized yet');
      return {
        totalRaised: 0,
        totalTokensSold: 0,
        totalBuyers: 0,
        currentPhase: 'Phase 1',
        isActive: false
      };
    }

    // Parse presale data from account
    const data = accountInfo.data;
    
    // Get token vault balance to calculate tokens sold
    const lltyVaultPubkey = new PublicKey(ADMIN_CONFIG.wallets.vaults.llty);
    let tokensSold = 0;
    try {
      const tokenBalance = await rateLimitedRequest(() => 
        connection.getTokenAccountBalance(lltyVaultPubkey)
      );
      const currentBalance = parseFloat(tokenBalance.value.uiAmount?.toString() || '0');
      // Assuming 5B was initial allocation for presale
      tokensSold = 5000000000 - currentBalance;
    } catch (e) {
      console.error('Error calculating tokens sold:', e);
    }

    // Parse other fields from presale account data
    // These offsets depend on your Rust struct layout
    const stats = {
      totalRaised: tokensSold * 0.004, // Approximate based on phase 1 price
      totalTokensSold: tokensSold,
      totalBuyers: 0, // Would need to query buyer accounts
      currentPhase: 'Phase 1',
      isActive: true
    };

    console.log('✅ Presale stats fetched:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error fetching presale stats:', error);
    return {
      totalRaised: 0,
      totalTokensSold: 0,
      totalBuyers: 0,
      currentPhase: 'Phase 1',
      isActive: false
    };
  }
};

// ============================================================================
// TRANSACTION HISTORY
// ============================================================================
export const fetchTransactionHistory = async (limit: number = 50) => {
  try {
    console.log('📊 Fetching transaction history...');

    const programId = new PublicKey(ADMIN_CONFIG.blockchain.programId);
    
    // Get recent signatures for the program
    const signatures = await rateLimitedRequest(() => 
      connection.getSignaturesForAddress(programId, { limit })
    );

    const transactions = [];
    
    // Limit parsing to avoid rate limits
    for (const sig of signatures.slice(0, 10)) {
      try {
        const tx = await rateLimitedRequest(() => 
          connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 })
        );
        
        if (tx) {
          transactions.push({
            signature: sig.signature,
            blockTime: sig.blockTime,
            slot: sig.slot,
            err: sig.err,
            memo: sig.memo
          });
        }
      } catch (e) {
        // Skip failed transaction fetches
      }
    }

    console.log(`✅ Fetched ${transactions.length} transactions`);
    return transactions;
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    return [];
  }
};

// ============================================================================
// TREASURY TOTALS
// ============================================================================
export const fetchTreasuryTotals = async () => {
  try {
    console.log('📊 Calculating treasury totals...');
    
    const balances = await fetchWalletBalances();
    
    const totals = {
      sol: balances.presale.sol + balances.llty.sol + balances.usdc.sol + balances.usdt.sol,
      usdc: balances.usdc.usdc,
      usdt: balances.usdt.usdt,
      llty: balances.llty.llty
    };

    console.log('✅ Treasury totals calculated:', totals);
    return totals;
  } catch (error) {
    console.error('❌ Error calculating treasury:', error);
    return { sol: 0, usdc: 0, usdt: 0, llty: 0 };
  }
};

// ============================================================================
// PRESALE CONFIGURATION
// ============================================================================
export const fetchPresaleConfig = async () => {
  try {
    console.log('📊 Fetching presale configuration...');
    
    const presalePubkey = new PublicKey(ADMIN_CONFIG.blockchain.presalePda);
    const accountInfo = await rateLimitedRequest(() => connection.getAccountInfo(presalePubkey));
    
    if (!accountInfo) {
      return {
        prices: ADMIN_CONFIG.presale.prices,
        phases: ['VIP', 'Phase 1', 'Phase 2', 'Phase 3'],
        currentPhase: 1,
        isActive: false
      };
    }

    // Return config from ADMIN_CONFIG for now
    return {
      prices: ADMIN_CONFIG.presale.prices,
      phases: ['VIP', 'Phase 1', 'Phase 2', 'Phase 3'],
      currentPhase: 1,
      isActive: true
    };
  } catch (error) {
    console.error('❌ Error fetching presale config:', error);
    return {
      prices: ADMIN_CONFIG.presale.prices,
      phases: ['VIP', 'Phase 1', 'Phase 2', 'Phase 3'],
      currentPhase: 1,
      isActive: false
    };
  }
};

// Export all functions
export default {
  fetchWalletBalances,
  fetchPresaleStats,
  fetchTransactionHistory,
  fetchTreasuryTotals,
  fetchPresaleConfig
};

// ============================================================================
// STAKING POOL INITIALIZATION (Placeholder)
// ============================================================================
export const initializeStakingPool = async (walletProvider: any) => {
  console.log('📊 Initialize staking pool called');
  // This would be implemented with actual staking pool initialization
  // For now, return a placeholder
  throw new Error('Staking pool initialization requires wallet connection and signing');
};

export const updateStakingConfig = async (config: any, walletProvider: any) => {
  console.log('📊 Update staking config called', config);
  // This would be implemented with actual config update
  throw new Error('Staking config update requires wallet connection and signing');
};
