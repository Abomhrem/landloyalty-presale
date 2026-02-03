import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import App from './App';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Transactions from './pages/admin/Transactions';
import Wallets from './pages/admin/Wallets';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const Users = () => <div className="text-white p-6">Users Page - Coming Soon</div>;
const Reports = () => <div className="text-white p-6">Reports Page - Coming Soon</div>;
const Security = () => <div className="text-white p-6">Security Page - Coming Soon</div>;
const Settings = () => <div className="text-white p-6">Settings Page - Coming Soon</div>;

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin routes FIRST - more specific routes come first */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="wallets" element={<Wallets />} />
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
            <Route path="security" element={<Security />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Public route LAST */}
          <Route path="/" element={<App />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
