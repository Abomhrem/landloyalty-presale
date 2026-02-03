import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'landloyalty-admin-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// Data file path
const DATA_FILE = path.join(__dirname, 'admin-data.json');

// Initialize data file
const initDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultPassword = bcrypt.hashSync('admin123', SALT_ROUNDS);
    const initialData = {
      users: [
        {
          id: '1',
          email: 'admin@landloyalty.com',
          passwordHash: defaultPassword,
          name: 'Super Admin',
          role: 'super_admin',
          permissions: ['all'],
          createdAt: new Date().toISOString(),
          lastLogin: null,
          status: 'active'
        }
      ],
      auditLog: [],
      sessions: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('✅ Admin data file initialized');
  }
};

// Load data
const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    initDataFile();
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
};

// Save data
const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Add audit log entry
const addAuditLog = (action, userId, details = {}) => {
  const data = loadData();
  data.auditLog.push({
    id: Date.now().toString(),
    action,
    userId,
    details,
    timestamp: new Date().toISOString(),
    ip: 'localhost'
  });
  // Keep last 1000 entries
  data.auditLog = data.auditLog.slice(-1000);
  saveData(data);
};

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Initialize
initDataFile();

// ==================== ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const data = loadData();
    const user = data.users.find(u => u.email === email);

    if (!user) {
      addAuditLog('LOGIN_FAILED', null, { email, reason: 'User not found' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      addAuditLog('LOGIN_FAILED', user.id, { reason: 'Account not active' });
      return res.status(401).json({ error: 'Account is not active' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      addAuditLog('LOGIN_FAILED', user.id, { reason: 'Wrong password' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveData(data);

    addAuditLog('LOGIN_SUCCESS', user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  const data = loadData();
  const user = data.users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions
    }
  });
});

// Change password
app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const data = loadData();
    const user = data.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!isValid) {
      addAuditLog('PASSWORD_CHANGE_FAILED', user.id, { reason: 'Wrong current password' });
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordChangedAt = new Date().toISOString();
    saveData(data);

    addAuditLog('PASSWORD_CHANGED', user.id);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
app.get('/api/users', authMiddleware, (req, res) => {
  const data = loadData();
  const user = data.users.find(u => u.id === req.user.id);
  
  if (!user || !['super_admin', 'admin'].includes(user.role)) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const users = data.users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    permissions: u.permissions,
    status: u.status,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin
  }));

  res.json({ users });
});

// Create user (super_admin only)
app.post('/api/users', authMiddleware, async (req, res) => {
  try {
    const data = loadData();
    const currentUser = data.users.find(u => u.id === req.user.id);
    
    if (!currentUser || currentUser.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (data.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
      name,
      role: role || 'viewer',
      permissions: role === 'super_admin' ? ['all'] : ['view_dashboard'],
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    data.users.push(newUser);
    saveData(data);

    addAuditLog('USER_CREATED', req.user.id, { newUserId: newUser.id, email });

    res.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        permissions: newUser.permissions,
        status: newUser.status
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user
app.put('/api/users/:id', authMiddleware, async (req, res) => {
  try {
    const data = loadData();
    const currentUser = data.users.find(u => u.id === req.user.id);
    
    if (!currentUser || !['super_admin', 'admin'].includes(currentUser.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const user = data.users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, role, status } = req.body;

    if (name) user.name = name;
    if (role && currentUser.role === 'super_admin') user.role = role;
    if (status) user.status = status;

    saveData(data);
    addAuditLog('USER_UPDATED', req.user.id, { targetUserId: user.id });

    res.json({ message: 'User updated' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
app.delete('/api/users/:id', authMiddleware, (req, res) => {
  const data = loadData();
  const currentUser = data.users.find(u => u.id === req.user.id);
  
  if (!currentUser || currentUser.role !== 'super_admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }

  const index = data.users.findIndex(u => u.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  data.users.splice(index, 1);
  saveData(data);

  addAuditLog('USER_DELETED', req.user.id, { deletedUserId: req.params.id });

  res.json({ message: 'User deleted' });
});

// Get audit log
app.get('/api/audit-log', authMiddleware, (req, res) => {
  const data = loadData();
  const user = data.users.find(u => u.id === req.user.id);
  
  if (!user || !['super_admin', 'admin'].includes(user.role)) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  res.json({ auditLog: data.auditLog.slice(-100).reverse() });
});

// Logout (just for audit logging)
app.post('/api/auth/logout', authMiddleware, (req, res) => {
  addAuditLog('LOGOUT', req.user.id);
  res.json({ message: 'Logged out' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║     LandLoyalty Admin API Server                          ║
║     Running on http://localhost:${PORT}                       ║
║                                                           ║
║     Default login:                                        ║
║     Email: admin@landloyalty.com                          ║
║     Password: admin123                                    ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
