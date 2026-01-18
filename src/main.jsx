// src/main.jsx
import './config/reown.ts'  // ← this initializes AppKit
import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import App from './App.tsx'; // ✅ imported as "App"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />  {/* ✅ render "App", not "LLTYPresale" */}
  </React.StrictMode>
);
