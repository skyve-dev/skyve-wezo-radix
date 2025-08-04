import React, {useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {ArrowLeftIcon, HamburgerMenuIcon} from '@radix-ui/react-icons';
import DrawerMenu from './DrawerMenu';
import BottomTabNavigation from './BottomTabNavigation';
import {colors} from "../../utils/colors.ts";
import {useScrollDirection} from '../../hooks/useScrollDirection';
import '../../styles/layout.css';

const MainLayout: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const {isHeaderVisible} = useScrollDirection();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if back button should be shown
    const shouldShowBackButton = () => {
        const noBackButtonPaths = ['/', '/listings', '/dashboard'];
        return !noBackButtonPaths.includes(location.pathname);
    };

    const handleBackClick = () => {
        navigate(-1);
    };
    const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
    };

    const headerStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.primary,
        borderBottom: '1px solid rgba(0,0,0,0.2)',
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
        color: colors.white,
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
                <div style={{width: '40px', display: "flex", alignItems: 'center'}}>
                    {shouldShowBackButton() ? (
                        <button
                            style={menuButtonStyle}
                            onClick={handleBackClick}
                            aria-label="Go back"
                        >
                            <ArrowLeftIcon style={{width: '24px', height: '24px', color: colors.white}}/>
                        </button>
                    ) : (
                        <svg viewBox="0 0 40.917 30.807">
                            <path fill="#fff"
                                  d="M.427 6.768S1.805.645 7.01 1.18c5.664.765 3.368 11.097 3.368 11.097S16.882-.732 23.617.032c6.429 1.99 3.75 10.18 3.75 10.18S35.863-1.651 39.995 1.64c2.985 2.296-1.99 7.424-4.898 12.781-5.357 11.097-6.123 13.24-11.71 12.475-5.164-1.811-4.285-10.485-4.285-10.485s-4.67 14.771-10.868 14.388C-2.184 31.027.12 8.91.427 6.768z"/>
                        </svg>
                    )}
                </div>
                <div style={logoStyle}></div>
                <button
                    style={menuButtonStyle}
                    onClick={() => setIsDrawerOpen(true)}
                    aria-label="Open menu"
                >
                    <HamburgerMenuIcon style={{width: '24px', height: '24px', color: colors.white}}/>
                </button>
            </header>

            <main style={contentStyle} className="main-layout-content">
                <Outlet/>
            </main>

            <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}/>
            <BottomTabNavigation/>
        </div>
    );
};

export default MainLayout;