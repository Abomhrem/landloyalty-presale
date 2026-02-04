import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your-secret-key-change-this';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const countRaw = await redis.get('subscribers:count');
      const count = countRaw ? Number(countRaw) : 0;
      const subscribers = await redis.lrange('subscribers:all', 0, -1);
      
      const parsed = subscribers.map((s: string) => {
        try { return JSON.parse(s); } catch { return s; }
      });

      return res.status(200).json({
        count,
        subscribers: parsed,
        exportedAt: new Date().toISOString()
      });
    }

    if (req.method === 'DELETE') {
      await redis.del('subscribers:all');
      await redis.set('subscribers:count', 0);
      return res.status(200).json({ message: 'All subscribers cleared' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
