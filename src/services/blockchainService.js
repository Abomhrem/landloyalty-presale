// ============================================================================
// ENTERPRISE-GRADE BLOCKCHAIN SERVICE v2.0
// ============================================================================
// Production-ready service for Solana blockchain interactions
// Features: Error handling, retry logic, caching, monitoring, validation
// ============================================================================

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

// ============================================================================
// CONFIGURATION
// ============================================================================
export const BLOCKCHAIN_CONFIG = {
  NETWORK: 'devnet', // Change to 'mainnet-beta' for production
  RPC_ENDPOINT: 'https://api.devnet.solana.com',
  COMMITMENT: 'confirmed',
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // ms
  CACHE_DURATION: 30000, // 30 seconds
  
  ADDRESSES: {
    PROGRAM_ID: new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo'),
    LLTY_MINT: new PublicKey('6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf'),
    USDC_MINT: new PublicKey('7e54j2gSb31gpeW3sLZktexZBqrA1tLzg14ncuiphrP4'),
    USDT_MINT: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuwSzGqKzNNc98FK'),
    PRESALE_PDA: new PublicKey('9b55xaKqELt1fYHn6MXA9vETy4ngTPxSZZ1SJmTQN1Kr'),
  }
};

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================
const balanceCache = new Map();

const getCachedBalance = (key) => {
  const cached = balanceCache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > BLOCKCHAIN_CONFIG.CACHE_DURATION) {
    balanceCache.delete(key);
    return null;
  }
  
  return cached.data;
};

const setCachedBalance = (key, data) => {
  balanceCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// ============================================================================
// CONNECTION SINGLETON WITH RETRY
// ============================================================================
let connectionInstance = null;

export const getConnection = () => {
  if (!connectionInstance) {
    connectionInstance = new Connection(
      BLOCKCHAIN_CONFIG.RPC_ENDPOINT,
      {
        commitment: BLOCKCHAIN_CONFIG.COMMITMENT,
        confirmTransactionInitialTimeout: 60000
      }
    );
  }
  return connectionInstance;
};

// ============================================================================
// RETRY WRAPPER FOR FAILED REQUESTS
// ============================================================================
const withRetry = async (fn, retries = BLOCKCHAIN_CONFIG.RETRY_COUNT) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      console.warn(`Retry ${i + 1}/${retries} after error:`, error.message);
      await new Promise(resolve => setTimeout(resolve, BLOCKCHAIN_CONFIG.RETRY_DELAY * (i + 1)));
    }
  }
};

// ============================================================================
// FETCH SOL BALANCE
// ============================================================================
export const fetchSOLBalance = async (publicKey) => {
  try {
    const connection = getConnection();
    const pubKey = typeof publicKey === 'string' 
      ? new PublicKey(publicKey) 
      : publicKey;
    
    // Check cache first
    const cacheKey = `sol_${pubKey.toString()}`;
    const cached = getCachedBalance(cacheKey);
    if (cached) return cached;
    
    const lamports = await withRetry(() => connection.getBalance(pubKey));
    const solBalance = lamports / LAMPORTS_PER_SOL;
    
    const result = {
      success: true,
      balance: solBalance,
      lamports,
      timestamp: Date.now()
    };
    
    setCachedBalance(cacheKey, result);
    return result;
    
  } catch (error) {
    console.error('fetchSOLBalance error:', error);
    return {
      success: false,
      balance: 0,
      error: error.message,
      timestamp: Date.now()
    };
  }
};

// ============================================================================
// FETCH TOKEN BALANCE (LLTY, USDC, USDT)
// ============================================================================
export const fetchTokenBalance = async (publicKey, mintAddress) => {
  try {
    const connection = getConnection();
    const pubKey = typeof publicKey === 'string' 
      ? new PublicKey(publicKey) 
      : publicKey;
    const mint = typeof mintAddress === 'string'
      ? new PublicKey(mintAddress)
      : mintAddress;
    
    // Check cache first
    const cacheKey = `token_${pubKey.toString()}_${mint.toString()}`;
    const cached = getCachedBalance(cacheKey);
    if (cached) return cached;
    
    // Get associated token account address
    const ata = await getAssociatedTokenAddress(mint, pubKey);
    
    // Check if account exists
    const accountInfo = await withRetry(() => connection.getAccountInfo(ata));
    
    if (!accountInfo) {
      const result = {
        success: true,
        balance: 0,
        accountExists: false,
        ata: ata.toString(),
        timestamp: Date.now()
      };
      setCachedBalance(cacheKey, result);
      return result;
    }
    
    // Get token balance
    const tokenBalance = await withRetry(() => connection.getTokenAccountBalance(ata));
    
    const result = {
      success: true,
      balance: tokenBalance.value.uiAmount || 0,
      decimals: tokenBalance.value.decimals,
      accountExists: true,
      ata: ata.toString(),
      rawAmount: tokenBalance.value.amount,
      timestamp: Date.now()
    };
    
    setCachedBalance(cacheKey, result);
    return result;
    
  } catch (error) {
    console.error('fetchTokenBalance error:', error);
    return {
      success: false,
      balance: 0,
      error: error.message,
      timestamp: Date.now()
    };
  }
};

// ============================================================================
// FETCH ALL WALLET BALANCES AT ONCE
// ============================================================================
export const fetchAllBalances = async (publicKey) => {
  try {
    const pubKey = typeof publicKey === 'string' 
      ? new PublicKey(publicKey) 
      : publicKey;
    
    console.log('🔍 Fetching balances from blockchain for:', pubKey.toString().slice(0, 8) + '...');
    
    // Fetch all balances in parallel using Promise.allSettled
    // This ensures one failure doesn't break everything
    const [solResult, lltyResult, usdcResult, usdtResult] = await Promise.allSettled([
      fetchSOLBalance(pubKey),
      fetchTokenBalance(pubKey, BLOCKCHAIN_CONFIG.ADDRESSES.LLTY_MINT),
      fetchTokenBalance(pubKey, BLOCKCHAIN_CONFIG.ADDRESSES.USDC_MINT),
      fetchTokenBalance(pubKey, BLOCKCHAIN_CONFIG.ADDRESSES.USDT_MINT)
    ]);
    
    // Extract values safely
    const getBalanceFromResult = (result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        return result.value.balance;
      }
      console.warn('Balance fetch failed:', result.reason || result.value?.error);
      return 0;
    };
    
    const balances = {
      SOL: getBalanceFromResult(solResult),
      LLTY: getBalanceFromResult(lltyResult),
      USDC: getBalanceFromResult(usdcResult),
      USDT: getBalanceFromResult(usdtResult)
    };
    
    console.log('✅ Balances fetched successfully:', balances);
    
    return {
      success: true,
      balances,
      details: {
        SOL: solResult.status === 'fulfilled' ? solResult.value : { error: solResult.reason?.message },
        LLTY: lltyResult.status === 'fulfilled' ? lltyResult.value : { error: lltyResult.reason?.message },
        USDC: usdcResult.status === 'fulfilled' ? usdcResult.value : { error: usdcResult.reason?.message },
        USDT: usdtResult.status === 'fulfilled' ? usdtResult.value : { error: usdtResult.reason?.message }
      },
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('❌ fetchAllBalances critical error:', error);
    return {
      success: false,
      balances: { SOL: 0, LLTY: 0, USDC: 0, USDT: 0 },
      error: error.message,
      timestamp: Date.now()
    };
  }
};

// ============================================================================
// CHECK IF WALLET HAS SUFFICIENT BALANCE FOR PURCHASE
// ============================================================================
export const checkSufficientBalance = async (
  publicKey,
  amount,
  currency,
  includeGasFees = true
) => {
  try {
    const balances = await fetchAllBalances(publicKey);
    
    if (!balances.success) {
      return {
        sufficient: false,
        reason: 'Could not fetch balances from blockchain',
        balances: null
      };
    }
    
    // Gas fees estimation (SOL required for all transactions)
    const GAS_RESERVE_SOL = 0.005; // Minimum 0.005 SOL for transaction fees
    const SAFE_MARGIN = 1.02; // 2% safety margin
    
    const currentBalance = balances.balances[currency];
    const solBalance = balances.balances.SOL;
    
    // Check if has minimum SOL for gas
    if (solBalance < GAS_RESERVE_SOL) {
      return {
        sufficient: false,
        reason: `Need at least ${GAS_RESERVE_SOL} SOL for transaction fees`,
        balances: balances.balances,
        required: {
          currency,
          amount,
          gasInSOL: GAS_RESERVE_SOL
        },
        available: {
          currency,
          amount: currentBalance,
          gasInSOL: solBalance
        },
        deficit: GAS_RESERVE_SOL - solBalance
      };
    }
    
    // Check if has sufficient currency balance (with margin)
    const requiredWithMargin = amount * SAFE_MARGIN;
    const sufficient = currentBalance >= requiredWithMargin;
    
    return {
      sufficient,
      reason: sufficient 
        ? 'Sufficient balance' 
        : `Insufficient ${currency} balance (need ${requiredWithMargin.toFixed(4)}, have ${currentBalance.toFixed(4)})`,
      balances: balances.balances,
      required: {
        currency,
        amount,
        withMargin: requiredWithMargin,
        gasInSOL: GAS_RESERVE_SOL
      },
      available: {
        currency,
        amount: currentBalance,
        gasInSOL: solBalance
      },
      deficit: sufficient ? 0 : requiredWithMargin - currentBalance
    };
  } catch (error) {
    console.error('checkSufficientBalance error:', error);
    return {
      sufficient: false,
      reason: error.message,
      balances: null
    };
  }
};

// ============================================================================
// VERIFY TRANSACTION ON-CHAIN
// ============================================================================
export const verifyTransaction = async (signature) => {
  try {
    const connection = getConnection();
    
    // Get transaction status with retry
    const status = await withRetry(() => connection.getSignatureStatus(signature));
    
    if (!status || !status.value) {
      return {
        verified: false,
        reason: 'Transaction not found on blockchain',
        signature
      };
    }
    
    // Check confirmation status
    const confirmed = status.value.confirmationStatus === 'confirmed' ||
                     status.value.confirmationStatus === 'finalized';
    
    // Check if successful (no errors)
    const successful = !status.value.err;
    
    let transactionDetails = null;
    if (confirmed && successful) {
      try {
        transactionDetails = await withRetry(() => 
          connection.getTransaction(signature, {
            maxSupportedTransactionVersion: 0
          })
        );
      } catch (err) {
        console.warn('Could not fetch transaction details:', err);
      }
    }
    
    return {
      verified: confirmed && successful,
      confirmed,
      successful,
      confirmationStatus: status.value.confirmationStatus,
      slot: status.value.slot,
      error: status.value.err,
      transaction: transactionDetails,
      signature,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('verifyTransaction error:', error);
    return {
      verified: false,
      reason: error.message,
      signature,
      timestamp: Date.now()
    };
  }
};

// ============================================================================
// HEALTH CHECK - Test RPC Connection
// ============================================================================
export const healthCheck = async () => {
  try {
    const connection = getConnection();
    
    const [version, slot, blockHeight] = await Promise.all([
      connection.getVersion(),
      connection.getSlot(),
      connection.getBlockHeight()
    ]);
    
    return {
      healthy: true,
      network: BLOCKCHAIN_CONFIG.NETWORK,
      rpcEndpoint: BLOCKCHAIN_CONFIG.RPC_ENDPOINT,
      version,
      slot,
      blockHeight,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('healthCheck error:', error);
    return {
      healthy: false,
      error: error.message,
      network: BLOCKCHAIN_CONFIG.NETWORK,
      rpcEndpoint: BLOCKCHAIN_CONFIG.RPC_ENDPOINT,
      timestamp: Date.now()
    };
  }
};

// ============================================================================
// CLEAR CACHE (useful after transactions)
// ============================================================================
export const clearCache = (publicKey) => {
  if (!publicKey) {
    balanceCache.clear();
    console.log('🗑️ All balance cache cleared');
    return;
  }
  
  const pubKeyStr = typeof publicKey === 'string' ? publicKey : publicKey.toString();
  const keysToDelete = [];
  
  for (const [key] of balanceCache) {
    if (key.includes(pubKeyStr)) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => balanceCache.delete(key));
  console.log(`🗑️ Cleared ${keysToDelete.length} cached entries for wallet`);
};

// ============================================================================
// EXPORTS
// ============================================================================
export default {
  getConnection,
  fetchSOLBalance,
  fetchTokenBalance,
  fetchAllBalances,
  checkSufficientBalance,
  verifyTransaction,
  healthCheck,
  clearCache,
  BLOCKCHAIN_CONFIG
};
