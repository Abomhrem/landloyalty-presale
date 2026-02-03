import React from 'react';

const LLTYLogo = ({ size = 100, className = "" }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/images/logo.png"
        alt="LLTY Logo"
        className="w-full h-full object-contain"
        style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))' }}
      />
    </div>
  );
};

export default LLTYLogo;
