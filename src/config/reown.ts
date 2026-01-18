// src/config/reown.ts - FIXED VERSION
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
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  icons: []
}

const solanaAdapter = new SolanaAdapter({
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ]
})

createAppKit({
  adapters: [solanaAdapter],
  networks: [solanaDevnet],
  projectId,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: []
  },
  themeMode: 'dark',
})

export { solanaAdapter }
