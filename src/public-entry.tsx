import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

export const initializePublic = () => {
  // Dynamic import App only when needed
  import('./App').then(({ default: App }) => {
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
};
