export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (decoded.exp < Date.now()) {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(200).json({ 
      success: true,
      user: { email: decoded.email, role: decoded.role }
    });

  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
