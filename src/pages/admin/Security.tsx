import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AuditLogEntry {
  action: string;
  user: string;
  timestamp: string;
  ip: string;
  details?: string;
}

interface LoginAttempt {
  email: string;
  success: boolean;
  timestamp: string;
  ip: string;
}

const Security: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    ipWhitelist: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireStrongPassword: true,
    alertOnNewDevice: true
  });

  useEffect(() => {
    // Load audit log from localStorage (in production, this would be an API call)
    const log = JSON.parse(localStorage.getItem('admin_audit_log') || '[]');
    setAuditLog(log.reverse());

    // Simulate login attempts
    setLoginAttempts([
      { email: 'admin@landloyalty.com', success: true, timestamp: new Date().toISOString(), ip: '192.168.1.1' },
      { email: 'admin@landloyalty.com', success: true, timestamp: new Date(Date.now() - 3600000).toISOString(), ip: '192.168.1.1' },
    ]);

    // Simulate active sessions
    setSessions([
      { id: 1, device: 'Chrome on Windows', location: 'Dubai, UAE', lastActive: 'Now', current: true },
      { id: 2, device: 'Safari on iPhone', location: 'Dubai, UAE', lastActive: '2 hours ago', current: false },
    ]);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Security Overview', icon: '🛡️' },
    { id: 'audit', label: 'Audit Log', icon: '📋' },
    { id: 'sessions', label: 'Active Sessions', icon: '💻' },
    { id: 'access', label: 'Access Control', icon: '🔐' },
    { id: '2fa', label: 'Two-Factor Auth', icon: '📱' }
  ];

  const securityScore = () => {
    let score = 50;
    if (securitySettings.twoFactorEnabled) score += 20;
    if (securitySettings.requireStrongPassword) score += 10;
    if (securitySettings.alertOnNewDevice) score += 10;
    if (securitySettings.ipWhitelist) score += 10;
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-400';
    if (score < 70) return 'text-yellow-400';
    if (score < 90) return 'text-blue-400';
    return 'text-green-400';
  };

  const terminateSession = (sessionId: number) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Center</h2>
          <p className="text-gray-400 mt-1">Monitor and manage your account security</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-yellow-500/20">
          <span className="text-gray-400">Security Score:</span>
          <span className={`text-2xl font-bold ${getScoreColor(securityScore())}`}>{securityScore()}%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-slate-800/50 rounded-2xl border border-yellow-500/10 p-6">
        
        {/* Security Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Account Status</p>
                    <p className="font-bold text-white">Secure</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-400">⚠</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">2FA Status</p>
                    <p className="font-bold text-yellow-400">Not Enabled</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400">🔑</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Last Password Change</p>
                    <p className="font-bold text-white">30 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <h4 className="font-bold text-yellow-400 mb-2">🔒 Security Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-red-400">○</span>
                  Enable two-factor authentication for additional security
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Strong password requirements are enabled
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  New device alerts are enabled
                </li>
              </ul>
            </div>

            {/* Recent Security Events */}
            <div>
              <h4 className="font-bold text-white mb-4">Recent Security Events</h4>
              <div className="space-y-2">
                {auditLog.slice(0, 5).map((entry, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        entry.action.includes('LOGIN') ? 'bg-green-400' :
                        entry.action.includes('PASSWORD') ? 'bg-yellow-400' : 'bg-blue-400'
                      }`} />
                      <div>
                        <p className="text-sm text-white">{entry.action.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{entry.ip}</span>
                  </div>
                ))}
                {auditLog.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent security events</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Audit Log */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Audit Log</h3>
              <button className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-all text-sm">
                Export Log
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Timestamp</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((entry, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-white">
                          {entry.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{entry.user}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{entry.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {auditLog.length === 0 && (
                <p className="text-gray-500 text-center py-8">No audit log entries</p>
              )}
            </div>
          </div>
        )}

        {/* Active Sessions */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Active Sessions</h3>
            
            <div className="space-y-3">
              {sessions.map(session => (
                <div key={session.id} className={`p-4 rounded-xl border ${
                  session.current ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-900/30 border-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="text-2xl">💻</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{session.device}</p>
                        <p className="text-sm text-gray-400">{session.location}</p>
                        <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.current && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          Current Session
                        </span>
                      )}
                      {!session.current && (
                        <button
                          onClick={() => terminateSession(session.id)}
                          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-sm"
                        >
                          Terminate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-medium">
              Terminate All Other Sessions
            </button>
          </div>
        )}

        {/* Access Control */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Access Control Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-gray-700">
                <div>
                  <p className="font-medium text-white">IP Whitelist</p>
                  <p className="text-sm text-gray-400">Only allow access from specific IP addresses</p>
                </div>
                <button
                  onClick={() => setSecuritySettings({ ...securitySettings, ipWhitelist: !securitySettings.ipWhitelist })}
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    securitySettings.ipWhitelist ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                    securitySettings.ipWhitelist ? 'left-8' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/30 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-white">Session Timeout</p>
                    <p className="text-sm text-gray-400">Auto-logout after inactivity</p>
                  </div>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                    className="px-4 py-2 rounded-lg bg-slate-800 border border-gray-700 text-white"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/30 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-white">Max Login Attempts</p>
                    <p className="text-sm text-gray-400">Lock account after failed attempts</p>
                  </div>
                  <select
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                    className="px-4 py-2 rounded-lg bg-slate-800 border border-gray-700 text-white"
                  >
                    <option value="3">3 attempts</option>
                    <option value="5">5 attempts</option>
                    <option value="10">10 attempts</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two-Factor Authentication */}
        {activeTab === '2fa' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>

            {!securitySettings.twoFactorEnabled ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-4xl">📱</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Enhance Your Security</h4>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password.
                </p>
                <button
                  onClick={() => setSecuritySettings({ ...securitySettings, twoFactorEnabled: true })}
                  className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  Enable 2FA
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-bold text-green-400">2FA is Enabled</p>
                      <p className="text-sm text-gray-400">Your account is protected with two-factor authentication</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="p-4 rounded-xl bg-slate-900/30 border border-gray-700 hover:border-yellow-500/50 transition-all text-left">
                    <p className="font-medium text-white">Backup Codes</p>
                    <p className="text-sm text-gray-400">Generate new backup codes</p>
                  </button>
                  <button className="p-4 rounded-xl bg-slate-900/30 border border-gray-700 hover:border-red-500/50 transition-all text-left">
                    <p className="font-medium text-red-400">Disable 2FA</p>
                    <p className="text-sm text-gray-400">Remove two-factor authentication</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Security;
