import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {BarChartIcon, CalendarIcon, ChatBubbleIcon, DashboardIcon, HomeIcon, PersonIcon, MagnifyingGlassIcon, EnterIcon} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';

interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const BottomTabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const anonymousTabs: TabItem[] = [
    { path: '/', label: 'Explore', icon: <HomeIcon /> },
    { path: '/listings', label: 'Listings', icon: <MagnifyingGlassIcon /> },
    { path: '/login', label: 'Login', icon: <EnterIcon /> },
  ];

  const tenantTabs: TabItem[] = [
    { path: '/', label: 'Explore', icon: <HomeIcon /> },
    { path: '/bookings', label: 'Bookings', icon: <CalendarIcon /> },
    { path: '/messages', label: 'Messages', icon: <ChatBubbleIcon /> },
    { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
  ];

  const homeownerTabs: TabItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/my-villas', label: 'My Villas', icon: <HomeIcon /> },
    { path: '/bookings', label: 'Bookings', icon: <CalendarIcon /> },
    { path: '/messages', label: 'Messages', icon: <ChatBubbleIcon /> },
    { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
  ];

  const adminTabs: TabItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/properties', label: 'Properties', icon: <HomeIcon /> },
    { path: '/users', label: 'Users', icon: <PersonIcon /> },
    { path: '/reports', label: 'Reports', icon: <BarChartIcon /> },
    { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
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
    color: isActive ? '#4F46E5' : '#9CA3AF',
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
    <div style={containerStyle}>
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