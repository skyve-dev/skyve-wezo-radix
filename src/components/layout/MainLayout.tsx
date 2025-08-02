import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import DrawerMenu from './DrawerMenu';
import BottomTabNavigation from './BottomTabNavigation';
import {colors} from "../../utils/colors.ts";
import {useScrollDirection} from '../../hooks/useScrollDirection';

const MainLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isHeaderVisible } = useScrollDirection();

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  };

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 40,
    transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
    height: '60px', // Fixed height for consistent spacing
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
    color: colors.primary,
  };

  const contentStyle: React.CSSProperties = {
    minHeight: '100vh',
    paddingTop: '60px', // Space for fixed header
    paddingBottom: '64px', // Space for bottom navigation
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ width: '40px' }} /> {/* Spacer for balance */}
        <div style={logoStyle}>Wezo</div>
        <button
            style={menuButtonStyle}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
        >
          <HamburgerMenuIcon style={{ width: '24px', height: '24px' }} />
        </button>
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