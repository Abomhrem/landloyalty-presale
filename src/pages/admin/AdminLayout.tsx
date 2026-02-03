import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/transactions', label: 'Transactions', icon: '💸' },
    { path: '/admin/wallets', label: 'Wallets', icon: '👛' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
    { path: '/admin/profit-distribution', label: 'Profit Distribution', icon: '💰' },
    { path: '/admin/security', label: 'Security', icon: '🔒' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 flex flex-col border-r border-yellow-500/10 backdrop-blur-xl`}
        style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)' }}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-yellow-500/10">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}
                >
                  <span className="text-2xl font-black text-slate-900">LL</span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-yellow-400">LANDLOYALTY</h2>
                  <p className="text-xs text-gray-400 font-semibold">Admin Panel</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 hover:bg-yellow-500/10 rounded-xl text-gray-400 hover:text-yellow-400 transition-all"
            >
              {sidebarOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-lg shadow-yellow-500/10'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-semibold text-base">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-yellow-500/10 space-y-2">
          {sidebarOpen && (
            <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-lg font-black text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-yellow-400 font-semibold">{user?.role}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all duration-200 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className="border-b border-yellow-500/10 backdrop-blur-xl"
          style={{ background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)' }}
        >
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Manage your LandLoyalty presale platform</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Wallet Connect Button */}
              <button
                onClick={() => open()}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  isConnected
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-slate-900 hover:from-yellow-600 hover:to-orange-700'
                }`}
              >
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    {address?.slice(0, 4)}...{address?.slice(-4)}
                  </div>
                ) : (
                  '🔗 Connect Wallet'
                )}
              </button>
              
              <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-400">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
