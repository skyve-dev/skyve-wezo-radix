import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import DrawerMenu from './DrawerMenu';
import BottomTabNavigation from './BottomTabNavigation';

const MainLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    paddingBottom: '80px', // Space for bottom navigation
    backgroundColor: '#f9fafb',
  };

  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 40,
  };

  const menuButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4F46E5',
  };

  const contentStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - 80px - 60px)', // Full height minus header and bottom nav
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button
          style={menuButtonStyle}
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
        >
          <HamburgerMenuIcon style={{ width: '24px', height: '24px' }} />
        </button>
        <div style={logoStyle}>Wezo</div>
        <div style={{ width: '40px' }} /> {/* Spacer for balance */}
      </header>
      
      <main style={contentStyle}>
        <Outlet />
      </main>
      
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <BottomTabNavigation />
    </div>
  );
};

export default MainLayout;