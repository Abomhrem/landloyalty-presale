import React, { useEffect, useState } from 'react';
import { initializeAppKit } from './config/reown';

const AdminAppWithAppKit: React.FC = () => {
  const [AdminAppComponent, setAdminAppComponent] = useState<React.ComponentType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🔐 Starting admin panel initialization...');

        // Initialize AppKit FIRST
        const appkit = initializeAppKit();

        if (!appkit) {
          console.warn('⚠️ AppKit initialization returned null, continuing anyway...');
        }

        // Small delay to ensure AppKit is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Then dynamically import AdminApp
        console.log('📦 Loading AdminApp component...');
        const { default: AdminApp } = await import('./AdminApp');

        setAdminAppComponent(() => AdminApp);
        setIsInitialized(true);
        console.log('✅ AdminApp loaded successfully with wallet support');
      } catch (err: any) {
        console.error('❌ Admin initialization error:', err);
        setError(err.message || 'Failed to initialize admin panel');

        // Try to load AdminApp anyway
        try {
          const { default: AdminApp } = await import('./AdminApp');
          setAdminAppComponent(() => AdminApp);
          setIsInitialized(true);
        } catch (appErr) {
          console.error('❌ Failed to load AdminApp:', appErr);
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
        background: '#0f172a',
        color: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Admin Initialization Error</h1>
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

  if (!isInitialized || !AdminAppComponent) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0f172a',
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
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Loading Admin Panel...</p>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>
            Initializing wallet connection
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

  return <AdminAppComponent />;
};

export default AdminAppWithAppKit;
