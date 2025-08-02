import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {AnimatePresence, motion} from 'framer-motion';
import {
    BellIcon,
    Cross2Icon,
    ExitIcon,
    GearIcon,
    HomeIcon,
    IdCardIcon,
    MixerHorizontalIcon,
    PersonIcon,
    QuestionMarkCircledIcon,
    MagnifyingGlassIcon,
    EnterIcon,
} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import {colors} from '../../utils/colors';

interface DrawerMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({isOpen, onClose}) => {
    const {user, logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        onClose();
    };

    const handleLogin = () => {
        navigate('/login');
        onClose();
    };

    const getMenuItems = (): MenuItem[] => {
        if (!isAuthenticated) {
            // Anonymous user menu items
            return [
                {
                    label: 'Explore Villas',
                    icon: <HomeIcon/>,
                    onClick: () => {
                        navigate('/');
                        onClose();
                    },
                },
                {
                    label: 'Villa Listings',
                    icon: <MagnifyingGlassIcon/>,
                    onClick: () => {
                        navigate('/listings');
                        onClose();
                    },
                },
                {
                    label: 'Help & Support',
                    icon: <QuestionMarkCircledIcon/>,
                    onClick: () => {
                        navigate('/help');
                        onClose();
                    },
                },
            ];
        }

        // Authenticated user menu items
        const commonMenuItems: MenuItem[] = [
            {
                label: 'Villa Listings',
                icon: <MagnifyingGlassIcon/>,
                onClick: () => {
                    navigate('/listings');
                    onClose();
                },
            },
            {
                label: 'User Profile',
                icon: <PersonIcon/>,
                onClick: () => {
                    navigate('/profile');
                    onClose();
                },
            },
            {
                label: 'Settings',
                icon: <GearIcon/>,
                onClick: () => {
                    navigate('/settings');
                    onClose();
                },
            },
            {
                label: 'Notifications',
                icon: <BellIcon/>,
                onClick: () => {
                    navigate('/notifications');
                    onClose();
                },
            },
            {
                label: 'Help & Support',
                icon: <QuestionMarkCircledIcon/>,
                onClick: () => {
                    navigate('/help');
                    onClose();
                },
            },
        ];

        const roleSpecificItems: MenuItem[] = [];

        if (user?.role === 'tenant' || user?.role === 'homeowner') {
            roleSpecificItems.push({
                label: 'Payment Methods',
                icon: <IdCardIcon/>,
                onClick: () => {
                    navigate('/payment-methods');
                    onClose();
                },
            });
        }

        if (user?.role === 'homeowner') {
            roleSpecificItems.push({
                label: 'Villa Management',
                icon: <HomeIcon/>,
                onClick: () => {
                    navigate('/villa-management');
                    onClose();
                },
            });
        }

        if (user?.role === 'admin') {
            roleSpecificItems.push(
                {
                    label: 'User & Property Admin',
                    icon: <PersonIcon/>,
                    onClick: () => {
                        navigate('/admin/management');
                        onClose();
                    },
                },
                {
                    label: 'App Configuration',
                    icon: <MixerHorizontalIcon/>,
                    onClick: () => {
                        navigate('/admin/config');
                        onClose();
                    },
                }
            );
        }

        return [...commonMenuItems, ...roleSpecificItems];
    };

    const allMenuItems = getMenuItems();

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    };

    const contentStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: 'white',
        padding: '24px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        zIndex: 101,
        overflowY: 'auto',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1a1a1a',
    };

    const closeButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const userInfoStyle: React.CSSProperties = {
        marginBottom: '24px',
        paddingBottom: '24px',
        borderBottom: '1px solid #e5e7eb',
    };

    const userNameStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px',
    };

    const userEmailStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6b7280',
    };

    const menuItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 8px',
        marginBottom: '8px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        background: 'none',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        fontSize: '16px',
        color: '#374151',
    };

    const iconStyle: React.CSSProperties = {
        width: '20px',
        height: '20px',
        color: '#6b7280',
    };

    const logoutButtonStyle: React.CSSProperties = {
        ...menuItemStyle,
        marginTop: '24px',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '24px',
        color: '#EF4444',
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                style={overlayStyle}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.2}}
                                onClick={onClose}
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                            <motion.div
                                style={contentStyle}
                                initial={{x: '100%'}}
                                animate={{x: 0}}
                                exit={{x: '100%'}}
                                transition={{type: 'tween',ease:'easeInOut',duration:0.3}}
                            >
                                <div style={headerStyle}>
                                    <h2 style={titleStyle}>Menu</h2>
                                    <button style={closeButtonStyle} onClick={onClose}>
                                        <Cross2Icon style={{width: '24px', height: '24px'}}/>
                                    </button>
                                </div>

                                {user && (
                                    <div style={userInfoStyle}>
                                        <div style={userNameStyle}>{user.name}</div>
                                        <div style={userEmailStyle}>{user.email}</div>
                                    </div>
                                )}

                                {allMenuItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        style={menuItemStyle}
                                        onClick={item.onClick}
                                        whileHover={{backgroundColor: '#F3F4F6'}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <span style={iconStyle}>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </motion.button>
                                ))}

                                {isAuthenticated ? (
                                    <motion.button
                                        style={logoutButtonStyle}
                                        onClick={handleLogout}
                                        whileHover={{backgroundColor: '#FEF2F2'}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <ExitIcon style={{...iconStyle, color: '#EF4444'}}/>
                                        <span>Logout</span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        style={{...logoutButtonStyle, color: colors.primary}}
                                        onClick={handleLogin}
                                        whileHover={{backgroundColor: colors.primaryLight}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <EnterIcon style={{...iconStyle, color: colors.primary}}/>
                                        <span>Sign In</span>
                                    </motion.button>
                                )}
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
};

export default DrawerMenu;