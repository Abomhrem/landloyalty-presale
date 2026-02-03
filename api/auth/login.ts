import { createHash } from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@landloyalty.world';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// In-memory rate limiting
const loginAttempts = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  
  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
  }
  
  if (attempt.count >= 5) return false;
  
  attempt.count++;
  return true;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ 
      error: 'Too many login attempts. Try again in 15 minutes.' 
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const passwordHash = createHash('sha256').update(password).digest('hex');
    
    if (email !== ADMIN_EMAIL || passwordHash !== ADMIN_PASSWORD_HASH) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({
      email,
      role: 'admin',
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })).toString('base64');

    return res.status(200).json({
      success: true,
      token,
      user: { email, role: 'admin' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
