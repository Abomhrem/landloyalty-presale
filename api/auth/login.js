import crypto from 'crypto';

// In-memory rate limiting (simple implementation)
const loginAttempts = new Map();

function checkRateLimit(ip) {
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

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Too many login attempts. Try again in 15 minutes.'
    });
  }

  try {
    // Debug: Log environment variables (without revealing sensitive data)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@landloyalty.world';
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    
    console.log('Environment check:', {
      hasEmail: !!ADMIN_EMAIL,
      emailValue: ADMIN_EMAIL,
      hasHash: !!ADMIN_PASSWORD_HASH,
      hashPrefix: ADMIN_PASSWORD_HASH ? ADMIN_PASSWORD_HASH.substring(0, 10) + '...' : 'NOT SET'
    });

    if (!ADMIN_PASSWORD_HASH) {
      console.error('❌ ADMIN_PASSWORD_HASH not set in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Environment variable not configured'
      });
    }

    const { email, password } = req.body;
    
    console.log('Login attempt:', { 
      email, 
      hasPassword: !!password,
      passwordLength: password?.length 
    });
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    
    console.log('Hash comparison:', {
      providedPrefix: passwordHash.substring(0, 10) + '...',
      expectedPrefix: ADMIN_PASSWORD_HASH.substring(0, 10) + '...',
      emailMatch: email === ADMIN_EMAIL,
      hashMatch: passwordHash === ADMIN_PASSWORD_HASH
    });

    if (email !== ADMIN_EMAIL || passwordHash !== ADMIN_PASSWORD_HASH) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create simple token
    const token = Buffer.from(JSON.stringify({
      email,
      role: 'admin',
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })).toString('base64');

    console.log('✅ Login successful for:', email);

    return res.status(200).json({
      success: true,
      token,
      user: { email, role: 'admin' }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
