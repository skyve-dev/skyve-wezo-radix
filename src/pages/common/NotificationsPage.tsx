import React, { useState } from 'react';
import { colors } from '../../utils/colors';
import { shadows, borderRadius } from '../../utils/design';
import { BellIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';

interface Notification {
    id: string;
    type: 'booking' | 'payment' | 'system' | 'promotional';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
}

const NotificationsPage: React.FC = () => {
    
    // Mock notifications data based on user role
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'booking',
            title: 'Booking Confirmed',
            message: 'Your booking for Villa Paradise has been confirmed for Dec 25-30, 2024.',
            timestamp: new Date('2024-12-20T10:00:00'),
            isRead: false,
            priority: 'high'
        },
        {
            id: '2',
            type: 'payment',
            title: 'Payment Received',
            message: 'Payment of AED 3,500 has been processed successfully.',
            timestamp: new Date('2024-12-19T14:30:00'),
            isRead: true,
            priority: 'medium'
        },
        {
            id: '3',
            type: 'system',
            title: 'Profile Updated',
            message: 'Your profile information has been successfully updated.',
            timestamp: new Date('2024-12-18T09:15:00'),
            isRead: true,
            priority: 'low'
        },
        {
            id: '4',
            type: 'promotional',
            title: 'Special Offer Available',
            message: '20% off on weekend bookings! Valid until Dec 31, 2024.',
            timestamp: new Date('2024-12-17T16:45:00'),
            isRead: false,
            priority: 'medium'
        },
        {
            id: '5',
            type: 'booking',
            title: 'Check-in Reminder',
            message: 'Your check-in is tomorrow at Villa Sunset. Don\'t forget to bring your ID.',
            timestamp: new Date('2024-12-16T18:00:00'),
            isRead: false,
            priority: 'high'
        }
    ]);
    
    const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'payment' | 'system'>('all');
    
    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'booking':
                return '🏠';
            case 'payment':
                return '💳';
            case 'system':
                return '⚙️';
            case 'promotional':
                return '🎉';
            default:
                return '📢';
        }
    };
    
    const getPriorityColor = (priority: Notification['priority']) => {
        switch (priority) {
            case 'high':
                return '#EF4444';
            case 'medium':
                return '#F59E0B';
            case 'low':
                return '#10B981';
            default:
                return '#6B7280';
        }
    };
    
    const markAsRead = (id: string) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === id 
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };
    
    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, isRead: true }))
        );
    };
    
    const deleteNotification = (id: string) => {
        setNotifications(prev => 
            prev.filter(notification => notification.id !== id)
        );
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
    
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    const containerStyle: React.CSSProperties = {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
    };
    
    const headerStyle: React.CSSProperties = {
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
    };
    
    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    };
    
    const filterStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    };
    
    const filterButtonStyle: React.CSSProperties = {
        padding: '8px 16px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    };
    
    const activeFilterStyle: React.CSSProperties = {
        ...filterButtonStyle,
        backgroundColor: colors.primary,
        color: 'white',
    };
    
    const notificationStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: '20px',
        marginBottom: '16px',
        boxShadow: shadows.sm,
        transition: 'box-shadow 0.2s',
        position: 'relative',
        border: '1px solid #f3f4f6',
    };
    
    const unreadNotificationStyle: React.CSSProperties = {
        ...notificationStyle,
        border: `1px solid ${colors.primary}`,
        backgroundColor: '#fef7f0',
    };
    
    const notificationHeaderStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
    };
    
    const notificationTitleStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px',
    };
    
    const notificationMessageStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#4b5563',
        lineHeight: '1.5',
        marginBottom: '12px',
    };
    
    const notificationFooterStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#9ca3af',
    };
    
    const actionButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    };
    
    const markAsReadButtonStyle: React.CSSProperties = {
        padding: '12px 24px',
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    };
    
    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>
                        <BellIcon style={{ width: '28px', height: '28px' }} />
                        Notifications
                        {unreadCount > 0 && (
                            <span style={{
                                backgroundColor: '#EF4444',
                                color: 'white',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}>
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        Stay updated with your latest activities
                    </p>
                </div>
                
                {unreadCount > 0 && (
                    <button
                        style={markAsReadButtonStyle}
                        onClick={markAllAsRead}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                    >
                        Mark All as Read
                    </button>
                )}
            </div>
            
            <div style={filterStyle}>
                <button
                    style={filter === 'all' ? activeFilterStyle : filterButtonStyle}
                    onClick={() => setFilter('all')}
                >
                    All ({notifications.length})
                </button>
                <button
                    style={filter === 'unread' ? activeFilterStyle : filterButtonStyle}
                    onClick={() => setFilter('unread')}
                >
                    Unread ({unreadCount})
                </button>
                <button
                    style={filter === 'booking' ? activeFilterStyle : filterButtonStyle}
                    onClick={() => setFilter('booking')}
                >
                    Bookings
                </button>
                <button
                    style={filter === 'payment' ? activeFilterStyle : filterButtonStyle}
                    onClick={() => setFilter('payment')}
                >
                    Payments
                </button>
                <button
                    style={filter === 'system' ? activeFilterStyle : filterButtonStyle}
                    onClick={() => setFilter('system')}
                >
                    System
                </button>
            </div>
            
            <div style={{ marginTop: '24px' }}>
                {filteredNotifications.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#6b7280',
                        backgroundColor: 'white',
                        borderRadius: borderRadius.lg,
                        boxShadow: shadows.sm,
                    }}>
                        <BellIcon style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No notifications found</h3>
                        <p style={{ fontSize: '14px', margin: 0 }}>
                            {filter === 'all' 
                                ? 'You\'re all caught up!' 
                                : `No ${filter} notifications at the moment.`
                            }
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            style={notification.isRead ? notificationStyle : unreadNotificationStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = shadows.md;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = shadows.sm;
                            }}
                        >
                            <div style={notificationHeaderStyle}>
                                <div style={{ flex: 1 }}>
                                    <div style={notificationTitleStyle}>
                                        <span style={{ fontSize: '18px' }}>
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        {notification.title}
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: getPriorityColor(notification.priority),
                                        }} />
                                    </div>
                                    <div style={notificationMessageStyle}>
                                        {notification.message}
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {!notification.isRead && (
                                        <button
                                            style={actionButtonStyle}
                                            onClick={() => markAsRead(notification.id)}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            title="Mark as read"
                                        >
                                            <CheckIcon style={{ width: '16px', height: '16px', color: colors.primary }} />
                                        </button>
                                    )}
                                    <button
                                        style={actionButtonStyle}
                                        onClick={() => deleteNotification(notification.id)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        title="Delete notification"
                                    >
                                        <Cross2Icon style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                                    </button>
                                </div>
                            </div>
                            
                            <div style={notificationFooterStyle}>
                                <span>
                                    {notification.timestamp.toLocaleDateString()} at {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span style={{
                                    padding: '2px 8px',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    fontWeight: '500',
                                }}>
                                    {notification.type}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;