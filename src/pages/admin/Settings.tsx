import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
}

const Settings: React.FC = () => {
  const { user, changePassword } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile settings
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    timezone: 'UTC',
    language: 'en'
  });

  // Password change
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    purchaseAlerts: true,
    securityAlerts: true,
    weeklyReport: true,
    lowBalanceAlert: true,
    largeTransactionAlert: true
  });

  // System settings
  const [system, setSystem] = useState({
    maintenanceMode: false,
    debugMode: false,
    autoRefresh: true,
    refreshInterval: 30
  });

  const sections: SettingsSection[] = [
    { id: 'profile', title: 'Profile Settings', icon: '👤' },
    { id: 'password', title: 'Change Password', icon: '🔐' },
    { id: 'notifications', title: 'Notifications', icon: '🔔' },
    { id: 'system', title: 'System Settings', icon: '⚙️' },
    { id: 'api', title: 'API Keys', icon: '🔑' },
    { id: 'backup', title: 'Backup & Export', icon: '💾' }
  ];

  // Password strength calculator
  useEffect(() => {
    const pwd = passwords.new;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 15;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 20;
    if (/\d/.test(pwd)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength += 20;
    setPasswordStrength(Math.min(strength, 100));
  }, [passwords.new]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.new.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    if (passwordStrength < 60) {
      setMessage({ type: 'error', text: 'Password is too weak. Add uppercase, numbers, and special characters.' });
      return;
    }

    setLoading(true);
    
    try {
      const success = await changePassword(passwords.current, passwords.new);
      
      if (success) {
        setMessage({ type: 'success', text: 'Password changed successfully! Please use your new password on next login.' });
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setMessage({ type: 'error', text: 'Current password is incorrect' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    }
    
    setLoading(false);
  };

  const handleProfileSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.name = profile.name;
      userData.timezone = profile.timezone;
      userData.language = profile.language;
      localStorage.setItem('admin_user', JSON.stringify(userData));
    }
    
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setLoading(false);
  };

  const handleExportData = (format: 'json' | 'csv') => {
    const data = {
      exportDate: new Date().toISOString(),
      settings: { profile, notifications, system },
      auditLog: JSON.parse(localStorage.getItem('admin_audit_log') || '[]')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landloyalty-backup-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: `Data exported as ${format.toUpperCase()}` });
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-gray-400 mt-1">Manage your account and system preferences</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
            
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>👤</span> Profile Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/30 border border-gray-700 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Dubai">Dubai</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleProfileSave}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Password Change */}
            {activeSection === 'password' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🔐</span> Change Password
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                      required
                    />
                    
                    {/* Password Strength Indicator */}
                    {passwords.new && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">Password Strength</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength < 30 ? 'text-red-400' :
                            passwordStrength < 60 ? 'text-yellow-400' :
                            passwordStrength < 80 ? 'text-blue-400' : 'text-green-400'
                          }`}>{getStrengthText()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <ul className="mt-2 space-y-1 text-xs text-gray-500">
                          <li className={passwords.new.length >= 8 ? 'text-green-400' : ''}>
                            {passwords.new.length >= 8 ? '✓' : '○'} At least 8 characters
                          </li>
                          <li className={/[A-Z]/.test(passwords.new) && /[a-z]/.test(passwords.new) ? 'text-green-400' : ''}>
                            {/[A-Z]/.test(passwords.new) && /[a-z]/.test(passwords.new) ? '✓' : '○'} Upper & lowercase letters
                          </li>
                          <li className={/\d/.test(passwords.new) ? 'text-green-400' : ''}>
                            {/\d/.test(passwords.new) ? '✓' : '○'} At least one number
                          </li>
                          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(passwords.new) ? 'text-green-400' : ''}>
                            {/[!@#$%^&*(),.?":{}|<>]/.test(passwords.new) ? '✓' : '○'} Special character
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border text-white focus:outline-none ${
                        passwords.confirm && passwords.new !== passwords.confirm
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-700 focus:border-yellow-400'
                      }`}
                      required
                    />
                    {passwords.confirm && passwords.new !== passwords.confirm && (
                      <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || passwordStrength < 60 || passwords.new !== passwords.confirm}
                    className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🔔</span> Notification Preferences
                </h3>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-gray-700">
                      <div>
                        <p className="font-medium text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-400">
                          {key === 'emailAlerts' && 'Receive important updates via email'}
                          {key === 'purchaseAlerts' && 'Get notified of new token purchases'}
                          {key === 'securityAlerts' && 'Critical security notifications'}
                          {key === 'weeklyReport' && 'Weekly summary of presale activity'}
                          {key === 'lowBalanceAlert' && 'Alert when vault balances are low'}
                          {key === 'largeTransactionAlert' && 'Notify for transactions over $10,000'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                        className={`relative w-14 h-7 rounded-full transition-all ${
                          value ? 'bg-yellow-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                          value ? 'left-8' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeSection === 'system' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>⚙️</span> System Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-gray-700">
                    <div>
                      <p className="font-medium text-white">Maintenance Mode</p>
                      <p className="text-sm text-gray-400">Temporarily disable user access to the presale</p>
                    </div>
                    <button
                      onClick={() => setSystem({ ...system, maintenanceMode: !system.maintenanceMode })}
                      className={`relative w-14 h-7 rounded-full transition-all ${
                        system.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                        system.maintenanceMode ? 'left-8' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-gray-700">
                    <div>
                      <p className="font-medium text-white">Debug Mode</p>
                      <p className="text-sm text-gray-400">Enable verbose logging for troubleshooting</p>
                    </div>
                    <button
                      onClick={() => setSystem({ ...system, debugMode: !system.debugMode })}
                      className={`relative w-14 h-7 rounded-full transition-all ${
                        system.debugMode ? 'bg-yellow-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                        system.debugMode ? 'left-8' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-gray-700">
                    <div>
                      <p className="font-medium text-white">Auto Refresh</p>
                      <p className="text-sm text-gray-400">Automatically refresh dashboard data</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        value={system.refreshInterval}
                        onChange={(e) => setSystem({ ...system, refreshInterval: parseInt(e.target.value) })}
                        className="px-3 py-2 rounded-lg bg-slate-800 border border-gray-700 text-white text-sm"
                        disabled={!system.autoRefresh}
                      >
                        <option value="10">10 seconds</option>
                        <option value="30">30 seconds</option>
                        <option value="60">1 minute</option>
                        <option value="300">5 minutes</option>
                      </select>
                      <button
                        onClick={() => setSystem({ ...system, autoRefresh: !system.autoRefresh })}
                        className={`relative w-14 h-7 rounded-full transition-all ${
                          system.autoRefresh ? 'bg-yellow-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                          system.autoRefresh ? 'left-8' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys */}
            {activeSection === 'api' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🔑</span> API Keys
                </h3>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ API keys provide full access to your admin functions. Keep them secure and never share them.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/30 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-white">Production API Key</p>
                        <p className="text-sm text-gray-400">Created: Jan 15, 2026</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        value="ll_prod_xxxxxxxxxxxxxxxxxxxxxx"
                        readOnly
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-gray-700 text-gray-400 font-mono text-sm"
                      />
                      <button className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-all">
                        Copy
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>

                <button className="px-6 py-3 rounded-xl font-bold border-2 border-dashed border-gray-600 text-gray-400 hover:border-yellow-500 hover:text-yellow-400 transition-all w-full">
                  + Generate New API Key
                </button>
              </div>
            )}

            {/* Backup & Export */}
            {activeSection === 'backup' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>💾</span> Backup & Export
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleExportData('json')}
                    className="p-6 rounded-xl bg-slate-900/30 border border-gray-700 hover:border-yellow-500/50 transition-all text-left group"
                  >
                    <div className="text-4xl mb-3">📄</div>
                    <h4 className="font-bold text-white group-hover:text-yellow-400">Export as JSON</h4>
                    <p className="text-sm text-gray-400 mt-1">Full backup including settings and audit logs</p>
                  </button>

                  <button
                    onClick={() => handleExportData('csv')}
                    className="p-6 rounded-xl bg-slate-900/30 border border-gray-700 hover:border-yellow-500/50 transition-all text-left group"
                  >
                    <div className="text-4xl mb-3">📊</div>
                    <h4 className="font-bold text-white group-hover:text-yellow-400">Export as CSV</h4>
                    <p className="text-sm text-gray-400 mt-1">Spreadsheet-compatible format for analysis</p>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/30 border border-gray-700">
                  <h4 className="font-bold text-white mb-3">Automatic Backups</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Last backup: 2 hours ago</p>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      Enabled
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
