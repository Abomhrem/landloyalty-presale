// ============================================================================
// BLOCKCHAIN CONFIGURATION
// ============================================================================
// Production-ready Solana blockchain configuration for LLTY Presale
// Network: Devnet (change to mainnet-beta for production)
// ============================================================================

import { PublicKey } from '@solana/web3.js';

// ============================================================================
// NETWORK CONFIGURATION
// ============================================================================
export const NETWORK = 'devnet'; // Change to 'mainnet-beta' for production
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Production RPC endpoints (uncomment for mainnet)
// export const NETWORK = 'mainnet-beta';
// export const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
// Or use premium RPC:
// export const RPC_ENDPOINT = 'https://solana-mainnet.g.alchemy.com/v2/YOUR_KEY';

// ============================================================================
// SMART CONTRACT ADDRESSES (V2)
// ============================================================================
export const ADDRESSES = {
  PROGRAM_ID: new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo'),
  LLTY_MINT: new PublicKey('6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf'),
  USDC_MINT: new PublicKey('7e54j2gSb31gpeW3sLZktexZBqrA1tLzg14ncuiphrP4'),
  USDT_MINT: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuwSzGqKzNNc98FK'),
  PRESALE_PDA: new PublicKey('9b55xaKqELt1fYHn6MXA9vETy4ngTPxSZZ1SJmTQN1Kr'),
  LLTY_VAULT: new PublicKey('9UqwUfRpi41GBTVuHPiSjWXUoW4EoWah3aYdiUspfU7f'),
  USDC_VAULT: new PublicKey('Hzmv4eWhLFbfC7XpDmf3dpMCn6jHDXDSYWosv87Nmegh'),
  USDT_VAULT: new PublicKey('EfHXwphpyAkeGrogUEGPQVSiPwXQDvpaFZvwJBbkmB9k')
};

// ============================================================================
// PRESALE TIMING CONFIGURATION
// ============================================================================
export const PRESALE_START = new Date('2026-01-01T00:00:00Z').getTime();
export const VIP_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
export const PUBLIC_START = PRESALE_START + VIP_DURATION;
export const PRESALE_END = new Date('2026-02-11T23:59:59Z').getTime();
export const PHASE_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days per phase

// ============================================================================
// PHASE PRICING (USD per LLTY)
// ============================================================================
export const PHASE_PRICES = {
  vip: 0.001,  // VIP exclusive price
  1: 0.004,    // Phase 1 (Public)
  2: 0.005,    // Phase 2
  3: 0.006     // Phase 3
};

// ============================================================================
// PHASE ALLOCATIONS (tokens available per phase)
// ============================================================================
export const PHASE_ALLOCATIONS = {
  1: 1_000_000_000, // 1B LLTY for Phase 1
  2: 1_500_000_000, // 1.5B LLTY for Phase 2
  3: 1_500_000_000  // 1.5B LLTY for Phase 3
};

// ============================================================================
// TOTAL SUPPLY & DISTRIBUTION
// ============================================================================
export const TOTAL_SUPPLY = 10_000_000_000; // 10 Billion LLTY

export const TOKEN_DISTRIBUTION = {
  presale: { percentage: 40, amount: 4_000_000_000 },
  liquidity: { percentage: 20, amount: 2_000_000_000 },
  team: { percentage: 20, amount: 2_000_000_000 },
  marketing: { percentage: 10, amount: 1_000_000_000 },
  reserve: { percentage: 9, amount: 900_000_000 },
  socialImpact: { percentage: 1, amount: 100_000_000 }
};

// ============================================================================
// PRESALE TARGET CALCULATION
// ============================================================================
export const PRESALE_TARGET = (
  (PHASE_ALLOCATIONS[1] * PHASE_PRICES[1]) +
  (PHASE_ALLOCATIONS[2] * PHASE_PRICES[2]) +
  (PHASE_ALLOCATIONS[3] * PHASE_PRICES[3])
); // Total: $29,500,000

// ============================================================================
// BONUS TIERS (Purchase amount → Bonus percentage)
// ============================================================================
export const BONUS_TIERS = [
  { minAmount: 10000, bonus: 15 }, // 15% bonus for $10k+
  { minAmount: 5000, bonus: 10 },  // 10% bonus for $5k+
  { minAmount: 1000, bonus: 5 }    // 5% bonus for $1k+
];

// ============================================================================
// VIP CONFIGURATION
// ============================================================================
export const VIP_CONFIG = {
  maxBuyers: 50,
  minPurchase: 1000, // $1,000 minimum
  exclusiveBonus: 10 // Additional 10% bonus for VIP buyers
};

// ============================================================================
// TRANSACTION CONFIGURATION
// ============================================================================
export const TX_CONFIG = {
  commitment: 'confirmed',
  skipPreflight: false,
  preflightCommitment: 'confirmed',
  maxRetries: 3,
  confirmationTimeout: 60000 // 60 seconds
};

// ============================================================================
// REFERRAL CONFIGURATION
// ============================================================================
export const REFERRAL_CONFIG = {
  bonusPercentage: 5, // 5% bonus for referrals
  cookieExpiry: 30 * 24 * 60 * 60 * 1000 // 30 days
};

// ============================================================================
// WITHDRAWAL CONFIGURATION
// ============================================================================
export const WITHDRAWAL_CONFIG = {
  duringPresale: 0.6,  // 60% withdrawable during presale
  afterPresale: 1.0    // 100% withdrawable after presale
};

// ============================================================================
// JUPITER SWAP CONFIGURATION (for SOL → USDC swaps)
// ============================================================================
export const JUPITER_CONFIG = {
  apiUrl: 'https://quote-api.jup.ag/v6',
  slippageBps: 50, // 0.5% slippage
  timeout: 30000   // 30 seconds
};

// ============================================================================
// RATE LIMITING
// ============================================================================
export const RATE_LIMITS = {
  purchaseAttempts: 5,        // Max purchases per minute
  balanceRefresh: 10000,      // Refresh balance every 10 seconds
  priceUpdate: 60000          // Update prices every 60 seconds
};

// ============================================================================
// EXPLORER URLS
// ============================================================================
export const getExplorerUrl = (signature) => {
  const cluster = NETWORK === 'mainnet-beta' ? '' : `?cluster=${NETWORK}`;
  return `https://explorer.solana.com/tx/${signature}${cluster}`;
};

export const getAddressExplorerUrl = (address) => {
  const cluster = NETWORK === 'mainnet-beta' ? '' : `?cluster=${NETWORK}`;
  return `https://explorer.solana.com/address/${address}${cluster}`;
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================
export const isValidSolanaAddress = (address) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const isPresaleActive = () => {
  const now = Date.now();
  return now >= PRESALE_START && now <= PRESALE_END;
};

export const isVipPeriod = () => {
  const now = Date.now();
  return now >= PRESALE_START && now < PUBLIC_START;
};

export const getCurrentPhase = () => {
  const now = Date.now();
  
  if (now < PUBLIC_START) return 0; // VIP or pre-presale
  if (now > PRESALE_END) return 4;  // Ended
  
  const elapsed = now - PUBLIC_START;
  return Math.min(Math.floor(elapsed / PHASE_DURATION) + 1, 3);
};

// ============================================================================
// EXPORT ALL
// ============================================================================
export default {
  NETWORK,
  RPC_ENDPOINT,
  ADDRESSES,
  PRESALE_START,
  VIP_DURATION,
  PUBLIC_START,
  PRESALE_END,
  PHASE_DURATION,
  PHASE_PRICES,
  PHASE_ALLOCATIONS,
  TOTAL_SUPPLY,
  TOKEN_DISTRIBUTION,
  PRESALE_TARGET,
  BONUS_TIERS,
  VIP_CONFIG,
  TX_CONFIG,
  REFERRAL_CONFIG,
  WITHDRAWAL_CONFIG,
  JUPITER_CONFIG,
  RATE_LIMITS,
  getExplorerUrl,
  getAddressExplorerUrl,
  isValidSolanaAddress,
  isPresaleActive,
  isVipPeriod,
  getCurrentPhase
};
