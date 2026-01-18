export default function LLTYLogo({ size = 64 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 hover:scale-110 hover:brightness-110"
      style={{
        filter: "drop-shadow(0 8px 32px rgba(251, 191, 36, 0.35))"
      }}
    >
      {/* Outer metallic gold ring */}
      <circle
        cx="256"
        cy="256"
        r="246"
        fill="none"
        stroke="url(#goldRing)"
        strokeWidth="20"
      />

      {/* Inner dark background circle */}
      <circle cx="256" cy="256" r="220" fill="#0f172a" />

      {/* Gradients */}
      <defs>
        <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        <linearGradient id="blueAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        <radialGradient id="glow" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Main emblem – stylized LL with skyscraper feel + blue accent */}
      <g transform="translate(160, 140) scale(0.9)">
        {/* Left tall building (L) */}
        <rect x="0" y="0" width="45" height="180" rx="8" fill="url(#goldRing)" />
        {/* Right building (L) */}
        <rect x="55" y="0" width="45" height="180" rx="8" fill="url(#goldRing)" />
        {/* Horizontal connector */}
        <rect x="0" y="140" width="100" height="40" rx="8" fill="url(#goldRing)" />
        {/* Blue glowing accent inside */}
        <rect x="10" y="10" width="80" height="160" rx="6" fill="url(#blueAccent)" opacity="0.85" />
        {/* Inner glow effect */}
        <rect x="15" y="15" width="70" height="150" rx="4" fill="url(#glow)" />
      </g>

      {/* Bottom text: LLTY */}
      <text
        x="256"
        y="440"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="72"
        fontWeight="900"
        fill="#fbbf24"
        letterSpacing="4"
        stroke="#d97706"
        strokeWidth="1.5"
      >
        LLTY
      </text>
    </svg>
  );
}
