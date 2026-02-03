import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

export const initializeAdmin = () => {
  // Dynamic import AdminApp only when needed
  import('./AdminApp').then(({ default: AdminApp }) => {
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(
      <React.StrictMode>
        <AdminApp />
      </React.StrictMode>
    );
  });
};
