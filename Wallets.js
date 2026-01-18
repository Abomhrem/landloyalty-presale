// ============================================================================
// WALLET CONFIGURATION
// ============================================================================
// Production-ready wallet adapter configuration supporting 15+ wallets
// Includes: Phantom, Solflare, Backpack, Trust Wallet, MetaMask, and more
// ============================================================================

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
  GlowWalletAdapter,
  SlopeWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  Coin98WalletAdapter,
  SolletWalletAdapter,
  MathWalletAdapter,
  TokenaryWalletAdapter,
  ExodusWalletAdapter,
  BraveWalletAdapter,
  TrustWalletAdapter,
} from '@solana/wallet-adapter-wallets';

// ============================================================================
// WALLET ADAPTERS CONFIGURATION
// ============================================================================

/**
 * Get all supported wallet adapters
 * @param {string} network - Network name ('devnet' | 'mainnet-beta')
 * @returns {Array} Array of wallet adapter instances
 */
export const getWalletAdapters = (network = 'devnet') => {
  return [
    // ========================================================================
    // TIER 1 - MOST POPULAR SOLANA WALLETS
    // ========================================================================
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new BackpackWalletAdapter(),
    new GlowWalletAdapter(),
    
    // ========================================================================
    // TIER 2 - CROSS-CHAIN WALLETS (Solana support)
    // ========================================================================
    new TrustWalletAdapter(),      // ✅ Trust Wallet (Solana support)
    new Coin98WalletAdapter(),
    new MathWalletAdapter(),
    new ExodusWalletAdapter(),
    new BraveWalletAdapter(),
    
    // ========================================================================
    // TIER 3 - ADDITIONAL WALLETS
    // ========================================================================
    new SlopeWalletAdapter(),
    new SolletWalletAdapter({ network }),
    new TokenaryWalletAdapter(),
    new TorusWalletAdapter(),
    
    // ========================================================================
    // TIER 4 - HARDWARE WALLETS
    // ========================================================================
    new LedgerWalletAdapter(),
  ];
};

// ============================================================================
// WALLET METADATA
// ============================================================================

export const WALLET_METADATA = {
  phantom: {
    name: 'Phantom',
    icon: '👻',
    url: 'https://phantom.app/',
    description: 'The #1 Solana wallet',
    featured: true,
    mobile: true,
    desktop: true,
    type: 'hot'
  },
  solflare: {
    name: 'Solflare',
    icon: '☀️',
    url: 'https://solflare.com/',
    description: 'Secure Solana wallet',
    featured: true,
    mobile: true,
    desktop: true,
    type: 'hot'
  },
  backpack: {
    name: 'Backpack',
    icon: '🎒',
    url: 'https://backpack.app/',
    description: 'Web3 wallet & xNFT platform',
    featured: true,
    mobile: true,
    desktop: true,
    type: 'hot'
  },
  glow: {
    name: 'Glow',
    icon: '✨',
    url: 'https://glow.app/',
    description: 'Solana wallet with built-in DeFi',
    featured: false,
    mobile: true,
    desktop: false,
    type: 'hot'
  },
  trust: {
    name: 'Trust Wallet',
    icon: '🛡️',
    url: 'https://trustwallet.com/',
    description: 'Multi-chain wallet (Solana supported)',
    featured: true,
    mobile: true,
    desktop: true,
    type: 'hot'
  },
  coin98: {
    name: 'Coin98',
    icon: '🪙',
    url: 'https://coin98.com/',
    description: 'Multi-chain crypto wallet',
    featured: false,
    mobile: true,
    desktop: true,
    type: 'hot'
  },
  mathwallet: {
    name: 'Math Wallet',
    icon: '🔢',
    url: 'https://mathwallet.org/',
    description: 'Universal crypto wallet',
    featured: false,
    mobile: true,
    desktop: true,
    type: 'hot'
  },
  exodus: {
    name: 'Exodus',
    icon: '🚀',
    url: 'https://www.exodus.com/',
    description: 'Beautiful multi-asset wallet',
    featured: false,
    mobile: true,
    desktop: true,
    type: 'hot'
  },
  brave: {
    name: 'Brave Wallet',
    icon: '🦁',
    url: 'https://brave.com/wallet/',
    description: 'Built-in browser wallet',
    featured: false,
    mobile: false,
    desktop: true,
    type: 'hot'
  },
  slope: {
    name: 'Slope',
    icon: '📊',
    url: 'https://slope.finance/',
    description: 'Solana mobile wallet',
    featured: false,
    mobile: true,
    desktop: false,
    type: 'hot'
  },
  sollet: {
    name: 'Sollet',
    icon: '💼',
    url: 'https://www.sollet.io/',
    description: 'Web-based Solana wallet',
    featured: false,
    mobile: false,
    desktop: true,
    type: 'hot'
  },
  tokenary: {
    name: 'Tokenary',
    icon: '🔐',
    url: 'https://tokenary.io/',
    description: 'Safari extension wallet',
    featured: false,
    mobile: true,
    desktop: true,
    type: 'hot'
  },
  torus: {
    name: 'Torus',
    icon: '🔑',
    url: 'https://tor.us/',
    description: 'Social login wallet',
    featured: false,
    mobile: true,
    desktop: true,
    type: 'hot'
  },
  ledger: {
    name: 'Ledger',
    icon: '🔒',
    url: 'https://www.ledger.com/',
    description: 'Hardware wallet (most secure)',
    featured: false,
    mobile: false,
    desktop: true,
    type: 'cold'
  }
};

// ============================================================================
// METAMASK DETECTION & WARNING
// ============================================================================

/**
 * Detect if MetaMask is installed
 * Note: MetaMask does NOT natively support Solana
 * This function is for educational/warning purposes
 */
export const detectMetaMask = () => {
  if (typeof window === 'undefined') return null;
  
  const { ethereum } = window;
  
  if (ethereum?.isMetaMask) {
    return {
      installed: true,
      version: ethereum.version || 'unknown',
      chainId: ethereum.chainId,
      isConnected: ethereum.isConnected(),
      warning: '⚠️ MetaMask does NOT support Solana natively. Use Phantom, Solflare, or Trust Wallet instead.'
    };
  }
  
  return { installed: false, warning: null };
};

// ============================================================================
// WALLET INSTALLATION LINKS
// ============================================================================

export const WALLET_INSTALL_LINKS = {
  phantom: {
    chrome: 'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/phantom-app/',
    ios: 'https://apps.apple.com/app/phantom-solana-wallet/id1598432977',
    android: 'https://play.google.com/store/apps/details?id=app.phantom'
  },
  solflare: {
    chrome: 'https://chrome.google.com/webstore/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic',
    ios: 'https://apps.apple.com/app/solflare/id1580902717',
    android: 'https://play.google.com/store/apps/details?id=com.solflare.mobile'
  },
  backpack: {
    chrome: 'https://chrome.google.com/webstore/detail/backpack/aflkmfhebedbjioipglgcbcmnbpgliof',
    ios: 'https://apps.apple.com/app/backpack-crypto-wallet/id6448691946',
    android: 'https://play.google.com/store/apps/details?id=app.backpack.mobile'
  },
  trust: {
    ios: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
    android: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp'
  },
  glow: {
    ios: 'https://apps.apple.com/app/glow-solana-wallet/id1599584512'
  }
};

// ============================================================================
// WALLET DETECTION HELPER
// ============================================================================

/**
 * Detect which wallets are installed in the browser
 * @returns {Object} Object with wallet names as keys and boolean values
 */
export const detectInstalledWallets = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    phantom: !!window.phantom?.solana?.isPhantom,
    solflare: !!window.solflare,
    backpack: !!window.backpack,
    glow: !!window.glow,
    coin98: !!window.coin98,
    brave: !!window.braveSolana,
    trust: !!window.trustwallet,
    exodus: !!window.exodus?.solana,
    mathwallet: !!window.solana?.isMathWallet,
    slope: !!window.Slope,
    tokenary: !!window.tokenary,
    metamask: !!window.ethereum?.isMetaMask, // For warning purposes
  };
};

// ============================================================================
// WALLET CONNECTION PREFERENCES
// ============================================================================

export const WALLET_PREFERENCES = {
  autoConnect: true,
  localStorageKey: 'llty_wallet_preference',
  disconnectOnChainChange: false,
  onError: (error) => {
    console.error('Wallet error:', error);
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get wallet metadata by adapter name
 * @param {string} adapterName - Wallet adapter name
 * @returns {Object} Wallet metadata
 */
export const getWalletMetadata = (adapterName) => {
  const name = adapterName.toLowerCase().replace('walletadapter', '').replace('wallet', '');
  return WALLET_METADATA[name] || {
    name: adapterName,
    icon: '👛',
    description: 'Solana wallet',
    featured: false
  };
};

/**
 * Check if wallet supports mobile
 * @param {string} adapterName - Wallet adapter name
 * @returns {boolean} True if mobile supported
 */
export const isMobileWallet = (adapterName) => {
  const metadata = getWalletMetadata(adapterName);
  return metadata.mobile === true;
};

/**
 * Get featured wallets (to show first in UI)
 * @returns {Array} Array of featured wallet names
 */
export const getFeaturedWallets = () => {
  return Object.entries(WALLET_METADATA)
    .filter(([_, meta]) => meta.featured)
    .map(([name]) => name);
};

/**
 * Check if running on mobile device
 * @returns {boolean} True if mobile
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get recommended wallets based on device
 * @returns {Array} Array of recommended wallet names
 */
export const getRecommendedWallets = () => {
  const mobile = isMobileDevice();
  
  if (mobile) {
    return ['phantom', 'trust', 'solflare', 'backpack', 'glow'];
  }
  
  return ['phantom', 'solflare', 'backpack', 'trust', 'ledger'];
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  getWalletAdapters,
  WALLET_METADATA,
  detectMetaMask,
  WALLET_INSTALL_LINKS,
  detectInstalledWallets,
  WALLET_PREFERENCES,
  getWalletMetadata,
  isMobileWallet,
  getFeaturedWallets,
  isMobileDevice,
  getRecommendedWallets
};
