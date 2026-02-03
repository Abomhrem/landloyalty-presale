import React, { useEffect, useState } from 'react';
import { initializeAppKit } from './config/reown';

const AppWithAppKit: React.FC = () => {
  const [AppComponent, setAppComponent] = useState<React.ComponentType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🚀 Starting initialization...');
        
        // Initialize AppKit FIRST
        const appkit = initializeAppKit();
        
        if (!appkit) {
          console.warn('⚠️ AppKit initialization returned null, continuing anyway...');
        }
        
        // Small delay to ensure AppKit is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Then dynamically import App
        console.log('📦 Loading App component...');
        const { default: App } = await import('./App');
        
        setAppComponent(() => App);
        setIsInitialized(true);
        console.log('✅ App loaded successfully');
      } catch (err: any) {
        console.error('❌ Initialization error:', err);
        setError(err.message || 'Failed to initialize');
        
        // Try to load App anyway
        try {
          const { default: App } = await import('./App');
          setAppComponent(() => App);
          setIsInitialized(true);
        } catch (appErr) {
          console.error('❌ Failed to load App:', appErr);
        }
      }
    };

    initialize();
  }, []);

  if (error && !isInitialized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
        color: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Initialization Error</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#fbbf24',
              color: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized || !AppComponent) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
        color: '#fbbf24',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #fbbf24',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Loading LandLoyalty...</p>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>
            Initializing Web3 wallet connection
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <AppComponent />;
};

export default AppWithAppKit;
