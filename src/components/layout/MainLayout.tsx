import React, {useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {ArrowLeftIcon, HamburgerMenuIcon} from '@radix-ui/react-icons';
import DrawerMenu from './DrawerMenu';
import BottomTabNavigation from './BottomTabNavigation';
import TopNavigation from './TopNavigation';
import {colors} from "../../utils/colors.ts";
import {useScrollDirection} from '../../hooks/useScrollDirection';
import {useIsMobile} from '../../utils/responsive';
import '../../styles/layout.css';
import wezoLogo from "./wezo-logo-40.png";
const MainLayout: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const {isHeaderVisible} = useScrollDirection();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();

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
        paddingTop: isMobile ? '60px' : '70px', // Different heights for mobile vs desktop nav
        paddingBottom: isMobile ? '64px' : '0px', // Bottom padding only on mobile
        boxSizing: 'border-box',
        position: 'relative',
        minHeight: '100vh',
        // Add safe area insets for better mobile experience
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)',
    };

    return (
        <div style={containerStyle} className="main-layout-container">
            {/* Render different navigation based on screen size */}
            {isMobile ? (
                <>
                    {/* Mobile header - keep existing design */}
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
                                <img src={wezoLogo} alt="Wezo Logo" style={{width: '40px',height:'40px'}}/>

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
                    <BottomTabNavigation/>
                </>
            ) : (
                <>
                    {/* Desktop navigation */}
                    <TopNavigation/>
                </>
            )}

            <main style={contentStyle} className="main-layout-content">
                <Outlet/>
            </main>

            <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}/>
        </div>
    );
};

export default MainLayout;