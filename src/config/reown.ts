// src/config/reown.ts - FIXED VERSION WITH ERROR HANDLING
import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import type { AppKitNetwork } from '@reown/appkit/networks'

export const projectId = '800ce2be85c4436651fded26209e9e00'

// CUSTOM NETWORK with EXPLICIT RPC URL
const solanaDevnet: AppKitNetwork = {
  id: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
  name: 'Solana Devnet',
  chainNamespace: 'solana',
  caipNetworkId: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
  nativeCurrency: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/solana_devnet']
    }
  },
  blockExplorers: {
    default: {
      name: 'Solana Explorer',
      url: 'https://explorer.solana.com/?cluster=devnet'
    }
  }
}

const metadata = {
  name: 'LandLoyalty Presale',
  description: 'Solana Real Estate Investment Presale',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const solanaAdapter = new SolanaAdapter({
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ]
})

let appkitInstance: any = null

export const initializeAppKit = () => {
  if (appkitInstance) {
    console.log('✅ AppKit already initialized');
    return appkitInstance;
  }

  try {
    console.log('🔄 Initializing AppKit...');
    appkitInstance = createAppKit({
      adapters: [solanaAdapter],
      networks: [solanaDevnet],
      projectId,
      metadata,
      features: {
        analytics: false,
        email: false,
        socials: [],
        swaps: false,
        onramp: false
      },
      themeMode: 'dark',
      themeVariables: {
        '--w3m-accent': '#fbbf24',
        '--w3m-border-radius-master': '8px'
      },
      // Disable problematic features that might cause 403
      enableWalletConnect: true,
      enableInjected: true,
      enableCoinbase: false
    });
    console.log('✅ AppKit initialized successfully');
    return appkitInstance;
  } catch (error: any) {
    // Gracefully handle initialization errors
    console.warn('⚠️ AppKit initialization warning:', error.message || error);
    // Return a mock object so the app can still function
    return {
      open: () => console.log('AppKit not fully initialized'),
      close: () => {},
      getState: () => ({ open: false })
    };
  }
}

export const getAppKit = () => appkitInstance
