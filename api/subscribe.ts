import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

interface Subscriber {
  email?: string;
  phone?: string;
  language: string;
  timestamp: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Secret');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // POST - Subscribe
  if (req.method === 'POST') {
    try {
      const { email, phone, language } = req.body;

      if (!email && !phone) {
        return res.status(400).json({ error: 'Email or phone required' });
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
      }

      const key = email ? `sub:${email}` : `sub:phone:${phone}`;
      const existing = await redis.get(key);
      
      if (existing) {
        return res.status(200).json({ success: true, message: 'Already subscribed' });
      }

      const subscriber: Subscriber = {
        email, phone, language: language || 'en',
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

  // GET - Count or list (admin)
  if (req.method === 'GET') {
    try {
      const count = await redis.get('subscribers:count') || 0;
      
      if (req.headers['x-admin-secret'] === process.env.ADMIN_SECRET) {
        const list = await redis.lrange('subscribers:all', 0, 100);
        return res.status(200).json({ count, subscribers: list });
      }
      
      return res.status(200).json({ count });
    } catch {
      return res.status(200).json({ count: 0 });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
