import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { mainnet, polygon, arbitrum, base, optimism } from 'wagmi/chains'

// Your WalletConnect Project ID
const projectId = '800ce2be85c4436651fded26209e9e00'

// Define chains
const chains = [mainnet, polygon, arbitrum, base, optimism]

// Wagmi config
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: 'Loyalty (LLTY) Presale',
    description: 'The First Arab Real Estate Investment Token',
    url: 'https://landloyalty.com',
    icons: ['https://landloyalty.com/logo.png']
  }
})

// Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#fbbf24',
    '--w3m-border-radius-master': '12px'
  }
})

export { wagmiConfig, projectId }
