import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import {BookingsProvider} from './contexts/BookingsContext';
import {VillasProvider} from './contexts/VillasContext';
import {UserProvider} from './contexts/UserContext';
import {AmenitiesProvider} from './contexts/AmenitiesContext';
import LoginPage from './pages/auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/common/HomePage';
import ListingsPage from './pages/common/ListingsPage';
import VillaDetailsPage from './pages/common/VillaDetailsPage';
import TenantDashboard from './pages/tenant/TenantDashboard';
import HomeownerDashboard from './pages/homeowner/HomeownerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import NewBookingPage from './pages/tenant/NewBookingPage';
import BookingListPage from './pages/common/BookingListPage';
import BookingDetailPage from './pages/common/BookingDetailPage';
import VillaManagementPage from './pages/common/VillaManagementPage';
import VillaManagementListPage from './pages/common/VillaManagementListPage';
import UserListPage from './pages/admin/UserListPage';
import ScrollToTop from './components/common/ScrollToTop';

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
      
      {/* Main Layout - accessible to all users (anonymous and authenticated) */}
      <Route path="/" element={<MainLayout />}>
        {/* Home page - accessible to all users */}
        <Route index element={<HomePage />} />
        
        {/* Listings page - accessible to all users */}
        <Route path="listings" element={<ListingsPage />} />
        
        {/* Villa details - accessible to all users */}
        <Route path="villas/:id" element={<VillaDetailsPage />} />
        
        {/* Protected Routes - require authentication */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        } />
        
        {/* Protected Common routes */}
        <Route path="profile" element={
          <ProtectedRoute>
            <PlaceholderPage title="Profile" />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute>
            <PlaceholderPage title="Settings" />
          </ProtectedRoute>
        } />
        <Route path="notifications" element={
          <ProtectedRoute>
            <PlaceholderPage title="Notifications" />
          </ProtectedRoute>
        } />
        <Route path="help" element={
          <ProtectedRoute>
            <PlaceholderPage title="Help & Support" />
          </ProtectedRoute>
        } />
        <Route path="messages" element={
          <ProtectedRoute>
            <PlaceholderPage title="Messages" />
          </ProtectedRoute>
        } />
        <Route path="bookings" element={
          <ProtectedRoute>
            <BookingListPage />
          </ProtectedRoute>
        } />
        <Route path="bookings/:id" element={
          <ProtectedRoute>
            <BookingDetailPage />
          </ProtectedRoute>
        } />
        
        {/* Protected Tenant/Homeowner routes */}
        <Route path="payment-methods" element={
          <ProtectedRoute>
            <PlaceholderPage title="Payment Methods" />
          </ProtectedRoute>
        } />
        
        {/* Protected Homeowner routes */}
        <Route path="my-villas" element={
          <ProtectedRoute>
            <PlaceholderPage title="My Villas" />
          </ProtectedRoute>
        } />
        <Route path="villa-management" element={
          <ProtectedRoute>
            <VillaManagementListPage />
          </ProtectedRoute>
        } />
        <Route path="villas/add" element={
          <ProtectedRoute>
            <VillaManagementPage />
          </ProtectedRoute>
        } />
        <Route path="villas/:id/manage" element={
          <ProtectedRoute>
            <PlaceholderPage title="Manage Villa" />
          </ProtectedRoute>
        } />
        
        {/* Protected Admin routes */}
        <Route path="properties" element={
          <ProtectedRoute>
            <VillaManagementListPage />
          </ProtectedRoute>
        } />
        <Route path="villas" element={
          <ProtectedRoute>
            <VillaManagementListPage />
          </ProtectedRoute>
        } />
        <Route path="users" element={
          <ProtectedRoute>
            <UserListPage />
          </ProtectedRoute>
        } />
        <Route path="reports" element={
          <ProtectedRoute>
            <PlaceholderPage title="Reports" />
          </ProtectedRoute>
        } />
        <Route path="admin/management" element={
          <ProtectedRoute>
            <PlaceholderPage title="User & Property Admin" />
          </ProtectedRoute>
        } />
        <Route path="admin/config" element={
          <ProtectedRoute>
            <PlaceholderPage title="App Configuration" />
          </ProtectedRoute>
        } />
        <Route path="admin/promotions" element={
          <ProtectedRoute>
            <PlaceholderPage title="Promotions Management" />
          </ProtectedRoute>
        } />
        <Route path="admin/featured-villas" element={
          <ProtectedRoute>
            <PlaceholderPage title="Featured Villas Management" />
          </ProtectedRoute>
        } />
        
        {/* Protected Booking routes */}
        <Route path="bookings/new" element={
          <ProtectedRoute>
            <NewBookingPage />
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop excludePaths={['/listings']} />
      <AuthProvider>
        <UserProvider>
          <VillasProvider>
            <BookingsProvider>
              <AmenitiesProvider>
                <AppContent />
              </AmenitiesProvider>
            </BookingsProvider>
          </VillasProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
