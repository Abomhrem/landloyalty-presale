import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'developer' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  avatar?: string;
}

const Users: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);

  // New user form
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as AdminUser['role'],
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Load users (in production, this would be an API call)
    const storedUsers = localStorage.getItem('admin_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with demo users
      const demoUsers: AdminUser[] = [
        {
          id: '1',
          name: 'Super Admin',
          email: 'admin@landloyalty.com',
          role: 'super_admin',
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: '2026-01-01T00:00:00Z',
          permissions: ['all']
        },
        {
          id: '2',
          name: 'John Developer',
          email: 'john@landloyalty.com',
          role: 'developer',
          status: 'active',
          lastLogin: new Date(Date.now() - 86400000).toISOString(),
          createdAt: '2026-01-15T00:00:00Z',
          permissions: ['view_dashboard', 'view_transactions', 'view_wallets']
        },
        {
          id: '3',
          name: 'Sarah Viewer',
          email: 'sarah@landloyalty.com',
          role: 'viewer',
          status: 'active',
          lastLogin: new Date(Date.now() - 172800000).toISOString(),
          createdAt: '2026-01-20T00:00:00Z',
          permissions: ['view_dashboard']
        },
        {
          id: '4',
          name: 'Mike Admin',
          email: 'mike@landloyalty.com',
          role: 'admin',
          status: 'inactive',
          lastLogin: new Date(Date.now() - 604800000).toISOString(),
          createdAt: '2026-01-10T00:00:00Z',
          permissions: ['view_dashboard', 'view_transactions', 'view_wallets', 'manage_users']
        }
      ];
      setUsers(demoUsers);
      localStorage.setItem('admin_users', JSON.stringify(demoUsers));
    }
  }, []);

  const saveUsers = (updatedUsers: AdminUser[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('admin_users', JSON.stringify(updatedUsers));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const user: AdminUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastLogin: '',
      createdAt: new Date().toISOString(),
      permissions: getDefaultPermissions(newUser.role)
    };

    saveUsers([...users, user]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'viewer', password: '', confirmPassword: '' });
    setLoading(false);

    // Log action
    logAction('USER_CREATED', `Created user: ${user.email}`);
  };

  const handleUpdateUser = async (updatedUser: AdminUser) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsers(updatedUsers);
    setShowEditModal(false);
    setSelectedUser(null);
    setLoading(false);

    logAction('USER_UPDATED', `Updated user: ${updatedUser.email}`);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const userToDelete = users.find(u => u.id === userId);
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);

    logAction('USER_DELETED', `Deleted user: ${userToDelete?.email}`);
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: newStatus as AdminUser['status'] } : u
    );
    saveUsers(updatedUsers);

    logAction('USER_STATUS_CHANGED', `Changed ${user.email} status to ${newStatus}`);
  };

  const getDefaultPermissions = (role: AdminUser['role']): string[] => {
    switch (role) {
      case 'super_admin':
        return ['all'];
      case 'admin':
        return ['view_dashboard', 'view_transactions', 'view_wallets', 'manage_users', 'view_reports'];
      case 'developer':
        return ['view_dashboard', 'view_transactions', 'view_wallets', 'view_reports'];
      case 'viewer':
        return ['view_dashboard'];
      default:
        return [];
    }
  };

  const logAction = (action: string, details: string) => {
    const auditLog = JSON.parse(localStorage.getItem('admin_audit_log') || '[]');
    auditLog.push({
      action,
      user: currentUser?.email,
      timestamp: new Date().toISOString(),
      ip: 'localhost',
      details
    });
    localStorage.setItem('admin_audit_log', JSON.stringify(auditLog.slice(-100)));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'admin': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'developer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'viewer': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-gray-400 mt-1">Manage admin users and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center gap-2"
        >
          <span>+</span> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-yellow-500/10 p-4">
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-green-500/20 p-4">
          <p className="text-sm text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-yellow-500/20 p-4">
          <p className="text-sm text-gray-400">Inactive</p>
          <p className="text-2xl font-bold text-yellow-400">{users.filter(u => u.status === 'inactive').length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-red-500/20 p-4">
          <p className="text-sm text-gray-400">Suspended</p>
          <p className="text-2xl font-bold text-red-400">{users.filter(u => u.status === 'suspended').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-yellow-500/10 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="developer">Developer</option>
            <option value="viewer">Viewer</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/50 rounded-xl border border-yellow-500/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-slate-900/50">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Role</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Last Login</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Created</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-slate-800/50 transition-all">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedUser(user); setShowEditModal(true); }}
                        className="p-2 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition-all"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 rounded-lg hover:bg-slate-700 transition-all ${
                          user.status === 'active' ? 'text-yellow-400' : 'text-green-400'
                        }`}
                        title={user.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        {user.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No users found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-yellow-500/20 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUser['role'] })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium border border-gray-600 text-gray-300 hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-yellow-500/20 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit User</h3>
              <button
                onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(selectedUser); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/30 border border-gray-700 text-gray-500 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as AdminUser['role'] })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value as AdminUser['status'] })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                  className="flex-1 px-4 py-3 rounded-xl font-medium border border-gray-600 text-gray-300 hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
