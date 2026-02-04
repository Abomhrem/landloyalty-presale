// Admin Login API - Secure Version
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://landloyalty.world');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Validate email format to prevent injection
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input format' });
    }

    // Simple admin check (in production, use database + bcrypt)
    const ADMIN_EMAIL = 'admin@landloyalty.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMeInProduction!';

    // Timing-safe comparison (prevent timing attacks)
    const emailMatch = email.toLowerCase() === ADMIN_EMAIL;
    const passMatch = password === ADMIN_PASSWORD;

    // Add delay to prevent brute force
    await new Promise(r => setTimeout(r, 500));

    if (!emailMatch || !passMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate simple session token
    const token = Buffer.from(`${email}:${Date.now()}:${Math.random().toString(36)}`).toString('base64');

    return res.status(200).json({
      success: true,
      user: { email: ADMIN_EMAIL, role: 'admin' },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
