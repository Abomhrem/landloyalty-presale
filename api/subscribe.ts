import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for development (use Vercel KV or Postgres in production)
// For production, connect to Vercel Postgres or use Vercel KV

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone, language } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone required' });
    }

    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Here you would save to Vercel Postgres or KV
    // For now, we'll just log and return success
    console.log('New subscription:', { email, phone, language, timestamp: new Date().toISOString() });

    // In production, save to database:
    // await sql`INSERT INTO subscribers (email, phone, language, created_at) VALUES (${email}, ${phone}, ${language}, NOW())`;

    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successful' 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
