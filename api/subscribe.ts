import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple file-based storage for now (will upgrade to Vercel KV later)
// Subscribers are stored in Vercel's serverless function memory per request
// For production, connect Vercel KV or Postgres from Vercel dashboard

interface Subscriber {
  email?: string;
  phone?: string;
  language: string;
  timestamp: string;
  ip?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { email, phone, language } = req.body;

      if (!email && !phone) {
        return res.status(400).json({ error: 'Email or phone required' });
      }

      // Email validation
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const subscriber: Subscriber = {
        email: email || undefined,
        phone: phone || undefined,
        language: language || 'en',
        timestamp: new Date().toISOString(),
        ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown'
      };

      // Log for now - in production use Vercel KV
      console.log('📧 New subscriber:', JSON.stringify(subscriber));

      // TODO: When you set up Vercel KV, uncomment:
      // import { kv } from '@vercel/kv';
      // await kv.lpush('subscribers', JSON.stringify(subscriber));

      return res.status(200).json({ 
        success: true, 
        message: 'Subscription successful'
      });
    } catch (error) {
      console.error('Subscription error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'GET') {
    // Admin endpoint to view subscribers (protect in production)
    return res.status(200).json({ 
      message: 'Subscriber API active',
      note: 'POST with {email, phone, language} to subscribe'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
