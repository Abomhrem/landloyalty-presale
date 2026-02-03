// src/main.jsx
import './config/reown.ts'  // This initializes the Solana AppKit
import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
