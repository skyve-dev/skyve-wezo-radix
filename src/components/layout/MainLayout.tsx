import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import DrawerMenu from './DrawerMenu';
import BottomTabNavigation from './BottomTabNavigation';
import {colors} from "../../utils/colors.ts";
import {useScrollDirection} from '../../hooks/useScrollDirection';
import '../../styles/layout.css';
import {unused} from "../../utils/unused.ts";

const MainLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isHeaderVisible, isBottomNavVisible } = useScrollDirection();
  unused('isBottomNavVisible',isBottomNavVisible)
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
    boxSizing: 'border-box', // Include border in height calculation
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
    // Always maintain padding to prevent content from touching screen edges
    paddingTop: '60px', // Fixed space for header
    paddingBottom: '64px', // Fixed space for bottom navigation
    boxSizing: 'border-box',
    position: 'relative',
    minHeight: '100vh',
    // Add safe area insets for better mobile experience
    paddingLeft: 'env(safe-area-inset-left, 0)',
    paddingRight: 'env(safe-area-inset-right, 0)',
  };

  return (
    <div style={containerStyle} className="main-layout-container">
      <header style={headerStyle} className="main-layout-header">
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
      
      <main style={contentStyle} className="main-layout-content">
        <Outlet />
      </main>
      
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <BottomTabNavigation />
    </div>
  );
};

export default MainLayout;