// Security Configuration
// Set to true when deploying to production
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const ALLOWED_ORIGINS = IS_PRODUCTION
  ? [
      'https://landloyalty.world',
      'https://www.landloyalty.world',
      'https://landloyalty-presale.vercel.app'
    ]
  : [
      'https://landloyalty.world',
      'https://www.landloyalty.world',
      'https://landloyalty-presale.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ];

export const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: IS_PRODUCTION ? 10 : 100 // Stricter in production
};

export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: IS_PRODUCTION
};
