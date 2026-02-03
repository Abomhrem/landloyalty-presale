import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy load admin components for better performance
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Transactions = React.lazy(() => import('./pages/admin/Transactions'));
const Wallets = React.lazy(() => import('./pages/admin/Wallets'));
const Users = React.lazy(() => import('./pages/admin/Users'));
const Reports = React.lazy(() => import('./pages/admin/Reports'));
const Security = React.lazy(() => import('./pages/admin/Security'));
const Settings = React.lazy(() => import('./pages/admin/Settings'));
const ProfitDistribution = React.lazy(() => import('./pages/admin/ProfitDistribution'));

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminApp: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <React.Suspense fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-yellow-400 font-semibold">Loading Admin Panel...</p>
            </div>
          </div>
        }>
          <Routes>
            {/* Public Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="wallets" element={<Wallets />} />
              <Route path="users" element={<Users />} />
              <Route path="reports" element={<Reports />} />
              <Route path="security" element={<Security />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profit-distribution" element={<ProfitDistribution />} />
            </Route>
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </React.Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AdminApp;
