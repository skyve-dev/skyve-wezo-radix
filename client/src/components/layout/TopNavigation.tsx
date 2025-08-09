import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChartIcon,
  CalendarIcon,
  ChatBubbleIcon,
  DashboardIcon,
  HomeIcon,
  PersonIcon,
  MagnifyingGlassIcon,
  EnterIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  ArrowLeftIcon,
  AvatarIcon,
} from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../utils/colors';

interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const TopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const anonymousTabs: TabItem[] = [
    { path: '/', label: 'Explore', icon: <HomeIcon /> },
    { path: '/listings', label: 'Listings', icon: <MagnifyingGlassIcon /> },
    { path: '/login', label: 'Login', icon: <EnterIcon /> },
  ];

  const tenantTabs: TabItem[] = [
    { path: '/', label: 'Explore', icon: <HomeIcon /> },
    { path: '/listings', label: 'Listings', icon: <MagnifyingGlassIcon /> },
    { path: '/bookings', label: 'Bookings', icon: <CalendarIcon /> },
    { path: '/messages', label: 'Messages', icon: <ChatBubbleIcon /> },
    { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
  ];

  const homeownerTabs: TabItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/listings', label: 'Listings', icon: <MagnifyingGlassIcon /> },
    { path: '/villa-management', label: 'My Villas', icon: <HomeIcon /> },
    { path: '/bookings', label: 'Bookings', icon: <CalendarIcon /> },
    { path: '/messages', label: 'Messages', icon: <ChatBubbleIcon /> },
    { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
  ];

  const adminTabs: TabItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/villas', label: 'Properties', icon: <HomeIcon /> },
    { path: '/users', label: 'Users', icon: <PersonIcon /> },
    { path: '/reports', label: 'Reports', icon: <BarChartIcon /> },
    { path: '/messages', label: 'Messages', icon: <ChatBubbleIcon /> },
    { path: '/profile', label: 'Profile', icon: <AvatarIcon /> },
  ];

  const getTabs = (): TabItem[] => {
    if (!user) return anonymousTabs;
    
    switch (user.role) {
      case 'homeowner':
        return homeownerTabs;
      case 'admin':
        return adminTabs;
      default:
        return tenantTabs;
    }
  };

  const tabs = getTabs();

  // Determine if back button should be shown
  const shouldShowBackButton = () => {
    const noBackButtonPaths = ['/', '/listings', '/dashboard'];
    return !noBackButtonPaths.includes(location.pathname);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    zIndex: 50,
    height: '70px',
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  };

  const headerContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const logoIconStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: '-0.025em',
  };

  const navListStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    color: isActive ? colors.primary : '#6b7280',
    backgroundColor: isActive ? `${colors.primary}10` : 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  });


  const backButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.2s ease-in-out',
  };

  const mobileMenuOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40,
  };

  const mobileMenuStyle: React.CSSProperties = {
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    zIndex: 50,
    maxHeight: '60vh',
    overflowY: 'auto',
  };

  const mobileNavItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderBottom: '1px solid #f3f4f6',
    backgroundColor: isActive ? `${colors.primary}10` : 'white',
    color: isActive ? colors.primary : '#374151',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  });

  return (
    <>
      <header style={containerStyle}>
        <div style={headerContentStyle}>
          <div style={leftSectionStyle}>
            {shouldShowBackButton() && (
              <motion.button
                style={backButtonStyle}
                onClick={handleBackClick}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
                <span>Back</span>
              </motion.button>
            )}
            
            <div style={logoStyle} onClick={() => navigate('/')}>
              <svg viewBox="0 0 40.917 30.807" style={logoIconStyle}>
                <path
                  fill={colors.primary}
                  d="M.427 6.768S1.805.645 7.01 1.18c5.664.765 3.368 11.097 3.368 11.097S16.882-.732 23.617.032c6.429 1.99 3.75 10.18 3.75 10.18S35.863-1.651 39.995 1.64c2.985 2.296-1.99 7.424-4.898 12.781-5.357 11.097-6.123 13.24-11.71 12.475-5.164-1.811-4.285-10.485-4.285-10.485s-4.67 14.771-10.868 14.388C-2.184 31.027.12 8.91.427 6.768z"
                />
              </svg>
              <span style={logoTextStyle}>Wezo</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex' }}>
            <ul style={navListStyle} className="desktop-nav">
              {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <li key={tab.path}>
                    <motion.button
                      style={navItemStyle(isActive)}
                      onClick={() => handleNavClick(tab.path)}
                      whileHover={!isActive ? { backgroundColor: '#f3f4f6', color: colors.primary } : undefined}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span style={{ width: '18px', height: '18px' }}>
                        {React.cloneElement(tab.icon as React.ReactElement, {
                          width: '100%',
                          height: '100%',
                        } as any)}
                      </span>
                      <span>{tab.label}</span>
                    </motion.button>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Menu Button */}
            <button
              style={mobileMenuButtonStyle}
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <Cross1Icon style={{ width: '20px', height: '20px' }} />
              ) : (
                <HamburgerMenuIcon style={{ width: '20px', height: '20px' }} />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              style={mobileMenuOverlayStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              style={mobileMenuStyle}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <div
                    key={tab.path}
                    style={mobileNavItemStyle(isActive)}
                    onClick={() => handleNavClick(tab.path)}
                  >
                    <span style={{ width: '20px', height: '20px' }}>
                      {React.cloneElement(tab.icon as React.ReactElement, {
                        width: '100%',
                        height: '100%',
                      } as any)}
                    </span>
                    <span>{tab.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CSS for responsive behavior */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-button {
            display: flex !important;
          }
        }
        
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default TopNavigation;