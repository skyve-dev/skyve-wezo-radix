import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../utils/colors';
import { shadows, borderRadius } from '../../utils/design';
import { BellIcon, CheckIcon, Cross2Icon, ReloadIcon } from '@radix-ui/react-icons';
import { useNotifications } from '../../contexts/NotificationsContext';

const NotificationsPage: React.FC = () => {
    const { 
        notifications, 
        loading, 
        error, 
        unreadCount,
        markAsRead, 
        deleteNotification, 
        markAllAsRead,
        refreshNotifications
    } = useNotifications();
    
    const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'payment' | 'system'>('all');
    
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'booking':
                return '🏠';
            case 'payment':
                return '💳';
            case 'system':
                return '⚙️';
            case 'message':
                return '💬';
            default:
                return '📢';
        }
    };
    
    
    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };
    
    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id);
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleRefresh = async () => {
        try {
            await refreshNotifications();
        } catch (error) {
            console.error('Failed to refresh notifications:', error);
        }
    };
    
    const formatDate = (date: Date | string): string => {
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    const filteredNotifications = notifications.filter(notification => {
        switch (filter) {
            case 'unread':
                return !notification.isRead;
            case 'booking':
            case 'payment':
            case 'system':
                return notification.type === filter;
            default:
                return true;
        }
    });

    // Styles
    const containerStyle: React.CSSProperties = {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fafafa',
        minHeight: '100vh',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1f2937',
        margin: '0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    };

    const badgeStyle: React.CSSProperties = {
        backgroundColor: colors.primary,
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '600',
    };

    const actionsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    };

    const refreshButtonStyle: React.CSSProperties = {
        padding: '8px 16px',
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: borderRadius.md,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '14px',
        fontWeight: '500',
    };

    const markAllButtonStyle: React.CSSProperties = {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        color: colors.primary,
        border: `1px solid ${colors.primary}`,
        borderRadius: borderRadius.md,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    };

    const filterContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap',
    };

    const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '8px 16px',
        border: `1px solid ${isActive ? colors.primary : '#e5e7eb'}`,
        backgroundColor: isActive ? colors.primary : 'white',
        color: isActive ? 'white' : '#6b7280',
        borderRadius: borderRadius.md,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s',
    });

    const notificationItemStyle = (isRead: boolean): React.CSSProperties => ({
        backgroundColor: isRead ? '#f9fafb' : 'white',
        borderRadius: borderRadius.lg,
        padding: '16px',
        marginBottom: '12px',
        boxShadow: shadows.sm,
        border: `1px solid ${isRead ? '#e5e7eb' : colors.primary}`,
        position: 'relative',
        transition: 'all 0.2s',
    });

    const notificationHeaderStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px',
    };

    const iconAndTitleStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flex: 1,
    };

    const titleNotificationStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1f2937',
        margin: '0',
    };

    const timestampStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#9ca3af',
        whiteSpace: 'nowrap',
    };

    const messageStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#4b5563',
        lineHeight: '1.4',
        marginBottom: '12px',
    };

    const notificationActionsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
    };

    const actionButtonStyle: React.CSSProperties = {
        padding: '6px 12px',
        border: '1px solid #e5e7eb',
        backgroundColor: 'white',
        color: '#6b7280',
        borderRadius: borderRadius.sm,
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.2s',
    };

    const loadingStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '16px',
        color: '#6b7280',
    };

    const errorStyle: React.CSSProperties = {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        padding: '16px',
        borderRadius: borderRadius.md,
        marginBottom: '20px',
        textAlign: 'center',
    };

    const emptyStateStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#9ca3af',
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={loadingStyle}>
                    <ReloadIcon className="animate-spin" style={{ marginRight: '8px' }} />
                    Loading notifications...
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}
            
            <div style={headerStyle}>
                <h1 style={titleStyle}>
                    <BellIcon width={24} height={24} />
                    Notifications
                    {unreadCount > 0 && (
                        <span style={badgeStyle}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </h1>
                
                <div style={actionsStyle}>
                    <button 
                        style={refreshButtonStyle}
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <ReloadIcon width={14} height={14} />
                        Refresh
                    </button>
                    {unreadCount > 0 && (
                        <button 
                            style={markAllButtonStyle}
                            onClick={handleMarkAllAsRead}
                        >
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            <div style={filterContainerStyle}>
                {['all', 'unread', 'booking', 'payment', 'system'].map(filterOption => (
                    <button
                        key={filterOption}
                        style={filterButtonStyle(filter === filterOption)}
                        onClick={() => setFilter(filterOption as any)}
                    >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                        {filterOption === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
                    </button>
                ))}
            </div>

            {filteredNotifications.length === 0 ? (
                <div style={emptyStateStyle}>
                    <BellIcon width={48} height={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <h3>No notifications found</h3>
                    <p>
                        {filter === 'all' 
                            ? 'You have no notifications at the moment.'
                            : `No ${filter} notifications found.`
                        }
                    </p>
                </div>
            ) : (
                filteredNotifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        style={notificationItemStyle(notification.isRead)}
                        whileHover={{ scale: 1.01 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                    >
                        <div style={notificationHeaderStyle}>
                            <div style={iconAndTitleStyle}>
                                <span style={{ fontSize: '20px' }}>
                                    {getNotificationIcon(notification.type)}
                                </span>
                                <h3 style={titleNotificationStyle}>
                                    {notification.title}
                                </h3>
                            </div>
                            <span style={timestampStyle}>
                                {formatDate(notification.timestamp)}
                            </span>
                        </div>

                        <p style={messageStyle}>
                            {notification.message}
                        </p>

                        <div style={notificationActionsStyle}>
                            {!notification.isRead && (
                                <button
                                    style={actionButtonStyle}
                                    onClick={() => handleMarkAsRead(notification.id)}
                                >
                                    <CheckIcon width={12} height={12} />
                                    Mark as Read
                                </button>
                            )}
                            <button
                                style={actionButtonStyle}
                                onClick={() => handleDelete(notification.id)}
                            >
                                <Cross2Icon width={12} height={12} />
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
};

export default NotificationsPage;