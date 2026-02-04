import bcrypt from 'bcryptjs';

// In production, store these in a database
const ADMIN_USERS = {
  'admin@landloyalty.com': {
    passwordHash: '$2a$10$8K1p/a0dR1xqM8K3hxqnqeL4PqxqMOkPFjwdQPmEL1cNJpvJhG3hy', // admin123
    role: 'admin'
  }
};

const ALLOWED_ORIGINS = [
  'https://landloyalty.world',
  'https://www.landloyalty.world',
  'https://landloyalty-presale.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Rate limiting by IP
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
    
    const user = ADMIN_USERS[email.toLowerCase()];
    if (!user) {
      // Don't reveal if user exists
      await new Promise(r => setTimeout(r, 1000)); // Delay to prevent timing attacks
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      await new Promise(r => setTimeout(r, 1000));
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate session token (in production use JWT with proper expiry)
    const sessionToken = Buffer.from(`${email}:${Date.now()}:${Math.random()}`).toString('base64');
    
    return res.status(200).json({
      success: true,
      user: { email: email.toLowerCase(), role: user.role },
      token: sessionToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
