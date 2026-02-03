import './index.css';

const path = window.location.pathname;

async function loadApp() {
  const React = await import('react');
  const ReactDOM = await import('react-dom/client');

  if (path.startsWith('/admin')) {
    // Load admin panel WITH AppKit for wallet connection
    console.log('🔐 Loading admin panel with wallet support...');
    const { default: AdminAppWithAppKit } = await import('./AdminAppWithAppKit.tsx');
    ReactDOM.createRoot(document.getElementById('root')!).render(
      React.createElement(React.StrictMode, null,
        React.createElement(AdminAppWithAppKit)
      )
    );
  } else {
    // Load public website with AppKit initialization
    console.log('🌐 Loading public website...');
    const { default: AppWithAppKit } = await import('./AppWithAppKit.tsx');
    ReactDOM.createRoot(document.getElementById('root')!).render(
      React.createElement(React.StrictMode, null,
        React.createElement(AppWithAppKit)
      )
    );
  }
}

loadApp();
