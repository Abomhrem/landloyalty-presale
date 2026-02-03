// src/utils/walletDetection.ts
// ============================================================================
// WALLET COMPATIBILITY DETECTION FOR SOLANA
// ============================================================================

export interface WalletInfo {
  isCompatible: boolean;
  walletName: string;
  isSolanaWallet: boolean;
  isEthereumWallet: boolean;
  recommendedAction: string;
}

/**
 * Detects if the connected wallet is compatible with Solana
 */
export const detectWalletCompatibility = (
  walletProvider: any,
  address: string | undefined
): WalletInfo => {
  const defaultInfo: WalletInfo = {
    isCompatible: true,
    walletName: 'Unknown',
    isSolanaWallet: true,
    isEthereumWallet: false,
    recommendedAction: '',
  };

  // No wallet connected
  if (!walletProvider || !address) {
    return {
      ...defaultInfo,
      isCompatible: false,
      recommendedAction: 'Please connect a Solana wallet',
    };
  }

  // ✅ ENTERPRISE-GRADE DETECTION: Check for Solana capabilities, not wallet brands
  
  // 1. Check if address is Solana format (base58, 32-44 chars, not starting with 0x)
  const isSolanaAddress = address && !address.startsWith('0x') && address.length >= 32 && address.length <= 44;
  
  // 2. Check if wallet has Solana-specific methods
  const hasSolanaSignTransaction = typeof walletProvider.signTransaction === 'function';
  const hasSolanaSignMessage = typeof walletProvider.signMessage === 'function';
  const hasSolanaPublicKey = walletProvider.publicKey !== undefined && walletProvider.publicKey !== null;
  
  // 3. Check if it's NOT an Ethereum wallet
  const isEthereumAddress = address && address.startsWith('0x') && address.length === 42;
  const hasEthereumOnly = window.ethereum && !hasSolanaPublicKey && isEthereumAddress;
  
  // ✅ PASS: If it has Solana capabilities AND Solana address format
  if (isSolanaAddress && (hasSolanaPublicKey || hasSolanaSignTransaction)) {
    // Detect wallet name for display (optional, for user info only)
    let detectedName = 'Solana Wallet';
    if (walletProvider.isPhantom) detectedName = 'Phantom';
    else if (walletProvider.isSolflare) detectedName = 'Solflare';
    else if (walletProvider.isBackpack) detectedName = 'Backpack';
    else if (walletProvider.isLedger) detectedName = 'Ledger';
    else if (walletProvider.isCoinbase) detectedName = 'Coinbase Wallet';
    else if (walletProvider.isTrust) detectedName = 'Trust Wallet';
    else if (walletProvider.isExodus) detectedName = 'Exodus';
    else if (walletProvider.isBraveWallet) detectedName = 'Brave Wallet';
    else if (walletProvider.isMathWallet) detectedName = 'Math Wallet';
    else if (walletProvider.isCoin98) detectedName = 'Coin98';
    
    return {
      isCompatible: true,
      walletName: detectedName,
      isSolanaWallet: true,
      isEthereumWallet: false,
      recommendedAction: '',
    };
  }
  
  // ⛔ FAIL: If it's clearly an Ethereum-only wallet
  if (hasEthereumOnly || isEthereumAddress) {
    let walletName = 'Ethereum Wallet';
    if (window.ethereum?.isMetaMask) walletName = 'MetaMask';
    else if (window.ethereum?.isCoinbaseWallet) walletName = 'Coinbase Wallet (Ethereum)';
    else if (window.ethereum?.isTrust) walletName = 'Trust Wallet (Ethereum)';
    
    return {
      isCompatible: false,
      walletName: walletName,
      isSolanaWallet: false,
      isEthereumWallet: true,
      recommendedAction: `${walletName} is connected to Ethereum. Please switch to a Solana-compatible wallet or ensure your wallet is on Solana network.`,
    };
  }
  
  // ⚠️ UNCERTAIN: Wallet exists but can't verify Solana compatibility
  // This is a safety check - if we can't verify, we assume incompatible but with a helpful message
  return {
    isCompatible: false,
    walletName: 'Unknown Wallet',
    isSolanaWallet: false,
    isEthereumWallet: false,
    recommendedAction: 'Unable to verify wallet compatibility. Please ensure your wallet supports Solana network. Recommended: Phantom, Solflare, Ledger, or any Solana-compatible wallet.',
  };
};

/**
 * Get recommended Solana wallets with download links
 */
export const getRecommendedWallets = () => {
  return [
    {
      name: 'Phantom',
      url: 'https://phantom.app/',
      description: 'Most popular Solana wallet',
    },
    {
      name: 'Solflare',
      url: 'https://solflare.com/',
      description: 'Secure Solana wallet',
    },
    {
      name: 'Backpack',
      url: 'https://backpack.app/',
      description: 'Multi-chain wallet with Solana support',
    },
  ];
};

// Global type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}
