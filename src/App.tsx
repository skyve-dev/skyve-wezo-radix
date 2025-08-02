import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/common/HomePage';
import TenantDashboard from './pages/tenant/TenantDashboard';
import HomeownerDashboard from './pages/homeowner/HomeownerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Dashboard Route Component - redirects to role-specific dashboard
const DashboardRoute: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'homeowner':
      return <HomeownerDashboard />;
    case 'tenant':
    default:
      return <TenantDashboard />;
  }
};

// Placeholder components for routes that aren't implemented yet
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  const pageStyle: React.CSSProperties = {
    padding: '40px 20px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '16px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '32px',
  };

  const comingSoonStyle: React.CSSProperties = {
    fontSize: '14px',
    padding: '12px 24px',
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    borderRadius: '8px',
    display: 'inline-block',
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>{title}</h1>
      <p style={descriptionStyle}>
        This page is part of the Wezo prototype and will contain {title.toLowerCase()} functionality.
      </p>
      <span style={comingSoonStyle}>Coming Soon</span>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
      />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Home page - accessible to all authenticated users */}
        <Route index element={<HomePage />} />
        
        {/* Role-specific dashboard */}
        <Route path="dashboard" element={<DashboardRoute />} />
        
        {/* Common routes */}
        <Route path="profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
        <Route path="help" element={<PlaceholderPage title="Help & Support" />} />
        <Route path="messages" element={<PlaceholderPage title="Messages" />} />
        <Route path="bookings" element={<PlaceholderPage title="Bookings" />} />
        
        {/* Tenant/Homeowner routes */}
        <Route path="payment-methods" element={<PlaceholderPage title="Payment Methods" />} />
        
        {/* Homeowner routes */}
        <Route path="my-villas" element={<PlaceholderPage title="My Villas" />} />
        <Route path="villa-management" element={<PlaceholderPage title="Villa Management" />} />
        <Route path="villas/add" element={<PlaceholderPage title="Add Villa" />} />
        <Route path="villas/:id/manage" element={<PlaceholderPage title="Manage Villa" />} />
        
        {/* Admin routes */}
        <Route path="properties" element={<PlaceholderPage title="Properties Management" />} />
        <Route path="users" element={<PlaceholderPage title="Users Management" />} />
        <Route path="reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="admin/management" element={<PlaceholderPage title="User & Property Admin" />} />
        <Route path="admin/config" element={<PlaceholderPage title="App Configuration" />} />
        <Route path="admin/promotions" element={<PlaceholderPage title="Promotions Management" />} />
        <Route path="admin/featured-villas" element={<PlaceholderPage title="Featured Villas Management" />} />
        
        {/* Villa details and booking */}
        <Route path="villas" element={<PlaceholderPage title="Villa Listings" />} />
        <Route path="villas/:id" element={<PlaceholderPage title="Villa Details" />} />
        <Route path="bookings/new" element={<PlaceholderPage title="New Booking" />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
