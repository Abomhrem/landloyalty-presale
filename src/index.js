import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Connection } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';
import './index.css';

const network = WalletAdapterNetwork.Devnet;
const endpoint = 'https://api.devnet.solana.com';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new LedgerWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new TorusWalletAdapter(),
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>
);
