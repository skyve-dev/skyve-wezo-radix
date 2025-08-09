import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {CheckCircledIcon, EnvelopeClosedIcon, ExitIcon, IdCardIcon, PersonIcon} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';
import {colors} from '../../utils/colors';

const ProfilePage: React.FC = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        // Add a small delay for better UX
        setTimeout(() => {
            logout();
            navigate('/');
        }, 500);
    };

    if (!user) {
        return null; // This shouldn't happen, but just in case
    }

    const containerStyle: React.CSSProperties = {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
    };

    const headerStyle: React.CSSProperties = {
        textAlign: 'center',
        marginBottom: '32px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '8px',
    };

    const subtitleStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#6b7280',
    };

    const profileCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        marginBottom: '24px',
    };

    const avatarSectionStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid #f3f4f6',
    };

    const avatarStyle: React.CSSProperties = {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '32px',
        fontWeight: 'bold',
    };

    const userInfoStyle: React.CSSProperties = {
        flex: 1,
    };

    const userNameStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px',
    };

    const userRoleStyle: React.CSSProperties = {
        fontSize: '14px',
        color: colors.primary,
        fontWeight: '500',
        textTransform: 'capitalize',
        backgroundColor: `${colors.primary}15`,
        padding: '4px 12px',
        borderRadius: '20px',
        display: 'inline-block',
    };

    const infoListStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    };

    const infoItemStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
    };

    const infoIconStyle: React.CSSProperties = {
        width: '20px',
        height: '20px',
        color: colors.primary,
    };

    const infoLabelStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '500',
        minWidth: '80px',
    };

    const infoValueStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#1a1a1a',
        fontWeight: '500',
    };

    const logoutSectionStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    };

    const logoutButtonStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
        padding: '16px 24px',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
    };

    const logoutButtonDisabledStyle: React.CSSProperties = {
        ...logoutButtonStyle,
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed',
    };

    const getRoleDisplayName = (role: string): string => {
        const roleNames: { [key: string]: string } = {
            tenant: 'Tenant',
            homeowner: 'Property Owner',
            admin: 'Administrator',
        };
        return roleNames[role] || role;
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <motion.div
            style={containerStyle}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <div style={headerStyle}>
                <h1 style={titleStyle}>My Profile</h1>
                <p style={subtitleStyle}>Manage your account information and settings</p>
            </div>

            {/* Profile Information Card */}
            <motion.div
                style={profileCardStyle}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.1, duration: 0.5}}
            >
                <div style={avatarSectionStyle}>
                    <div style={avatarStyle}>
                        {getInitials(user.name)}
                    </div>
                    <div style={userInfoStyle}>
                        <h2 style={userNameStyle}>{user.name}</h2>
                        <span style={userRoleStyle}>{getRoleDisplayName(user.role)}</span>
                    </div>
                </div>

                <div style={infoListStyle}>
                    <div style={infoItemStyle}>
                        <EnvelopeClosedIcon style={infoIconStyle}/>
                        <span style={infoLabelStyle}>Email:</span>
                        <span style={infoValueStyle}>{user.email}</span>
                    </div>

                    <div style={infoItemStyle}>
                        <IdCardIcon style={infoIconStyle}/>
                        <span style={infoLabelStyle}>User ID:</span>
                        <span style={infoValueStyle}>{user.id}</span>
                    </div>

                    <div style={infoItemStyle}>
                        <PersonIcon style={infoIconStyle}/>
                        <span style={infoLabelStyle}>Role:</span>
                        <span style={infoValueStyle}>{getRoleDisplayName(user.role)}</span>
                    </div>

                    <div style={infoItemStyle}>
                        <CheckCircledIcon style={infoIconStyle}/>
                        <span style={infoLabelStyle}>Status:</span>
                        <span style={{
                            ...infoValueStyle,
                            color: user.isActive ? '#059669' : '#dc2626'
                        }}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
                    </div>
                </div>
            </motion.div>

            {/* Logout Section */}
            <motion.div
                style={logoutSectionStyle}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2, duration: 0.5}}
            >
                <motion.button
                    style={isLoggingOut ? logoutButtonDisabledStyle : logoutButtonStyle}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    whileHover={!isLoggingOut ? {backgroundColor: '#b91c1c'} : {}}
                    whileTap={!isLoggingOut ? {scale: 0.98} : {}}
                >
                    <ExitIcon style={{width: '20px', height: '20px'}}/>
                    <span>{isLoggingOut ? 'Logging out...' : 'Sign Out'}</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default ProfilePage;