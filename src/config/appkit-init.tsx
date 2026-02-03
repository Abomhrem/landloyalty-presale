import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';

// Solana adapter configuration
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: []
});

// Create and export the AppKit instance
export const appkit = createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: {
    name: 'LandLoyalty',
    description: 'Revolutionary blockchain presale platform',
    url: 'https://landloyalty.com',
    icons: ['https://landloyalty.com/icon.png']
  },
  projectId: process.env.REOWN_PROJECT_ID || 'YOUR_PROJECT_ID',
  features: {
    analytics: true,
    email: false,
    socials: []
  }
});
