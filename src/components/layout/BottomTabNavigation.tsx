import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {BarChartIcon, CalendarIcon, ChatBubbleIcon, DashboardIcon, HomeIcon, PersonIcon, MagnifyingGlassIcon, EnterIcon} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';
import {colors} from '../../utils/colors';
import {useScrollDirection} from '../../hooks/useScrollDirection';
import '../../styles/layout.css';

interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const BottomTabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isBottomNavVisible } = useScrollDirection();

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
  ];

  const adminTabs: TabItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/villas', label: 'Properties', icon: <HomeIcon /> },
    { path: '/users', label: 'Users', icon: <PersonIcon /> },
    { path: '/reports', label: 'Reports', icon: <BarChartIcon /> },
    { path: '/messages', label: 'Messages', icon: <ChatBubbleIcon /> },
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

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '8px 0',
    zIndex: 50,
    transform: isBottomNavVisible ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
    height: '64px', // Fixed height for consistent spacing
    boxSizing: 'border-box', // Include border in height calculation
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: isActive ? colors.primary : colors.gray400,
  });

  const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    marginBottom: '4px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle} className="main-layout-bottom-nav">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        
        return (
          <motion.button
            key={tab.path}
            style={tabStyle(isActive)}
            onClick={() => navigate(tab.path)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              style={iconStyle}
              animate={{ scale: isActive ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {React.cloneElement(tab.icon as React.ReactElement, {
                style: { width: '100%', height: '100%' },
              } as Partial<unknown>)}
            </motion.div>
            <span style={labelStyle}>{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default BottomTabNavigation;