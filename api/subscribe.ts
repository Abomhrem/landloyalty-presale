import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Allowed origins - restrict to your domains only
const ALLOWED_ORIGINS = [
  'https://landloyalty.world',
  'https://www.landloyalty.world',
  'https://landloyalty-presale.vercel.app',
  'http://localhost:5173', // Dev only
  'http://localhost:3000'  // Dev only
];

function getCorsHeaders(origin: string | undefined) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Secret',
    'Access-Control-Max-Age': '86400',
  };
}

interface Subscriber {
  email?: string;
  phone?: string;
  language: string;
  timestamp: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Rate limiting check (basic - use Redis for production)
  const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  const rateLimitKey = `ratelimit:${clientIP}`;
  
  try {
    const requests = await redis.incr(rateLimitKey);
    if (requests === 1) {
      await redis.expire(rateLimitKey, 60); // 1 minute window
    }
    if (requests > 10) { // Max 10 requests per minute
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
  } catch (e) {
    // Continue if rate limit check fails
  }

  // POST - Subscribe
  if (req.method === 'POST') {
    try {
      const { email, phone, language } = req.body;

      // Input validation
      if (!email && !phone) {
        return res.status(400).json({ error: 'Email or phone required' });
      }

      // Strict email validation
      if (email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email) || email.length > 254) {
          return res.status(400).json({ error: 'Invalid email format' });
        }
      }

      // Phone validation (basic)
      if (phone && (!/^[\d\s\-+()]{7,20}$/.test(phone))) {
        return res.status(400).json({ error: 'Invalid phone format' });
      }

      // Sanitize language
      const safeLang = ['en', 'ar'].includes(language) ? language : 'en';

      const key = email ? `sub:${email.toLowerCase()}` : `sub:phone:${phone.replace(/\D/g, '')}`;
      const existing = await redis.get(key);
      
      if (existing) {
        return res.status(200).json({ success: true, message: 'Already subscribed' });
      }

      const subscriber: Subscriber = {
        email: email?.toLowerCase(),
        phone: phone?.replace(/\D/g, ''),
        language: safeLang,
        timestamp: new Date().toISOString()
      };

      await redis.set(key, JSON.stringify(subscriber));
      await redis.lpush('subscribers:all', JSON.stringify(subscriber));
      await redis.incr('subscribers:count');

      return res.status(200).json({ success: true, message: 'Subscribed!' });
    } catch (error) {
      console.error('Subscribe error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // GET - Public count only, admin needs secret
  if (req.method === 'GET') {
    try {
      const count = await redis.get('subscribers:count') || 0;
      
      // Admin access requires secret header
      const adminSecret = req.headers['x-admin-secret'];
      if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
        const list = await redis.lrange('subscribers:all', 0, 100);
        return res.status(200).json({ count, subscribers: list });
      }
      
      // Public only gets count
      return res.status(200).json({ count });
    } catch {
      return res.status(200).json({ count: 0 });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
