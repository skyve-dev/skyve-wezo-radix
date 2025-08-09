import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Notification } from '../types';
import { NotificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationsContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearReadNotifications: () => Promise<void>;
  createNotification: (data: {
    userId: string;
    title: string;
    message: string;
    type: 'booking' | 'payment' | 'message' | 'system';
  }) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  getUnreadNotifications: () => Notification[];
  getReadNotifications: () => Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await NotificationService.getUserNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const markAsRead = async (id: string): Promise<void> => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
      throw err;
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    if (!user?.id) return;
    
    try {
      await NotificationService.markAllAsRead(user.id);
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
      throw err;
    }
  };

  const deleteNotification = async (id: string): Promise<void> => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
      throw err;
    }
  };

  const clearReadNotifications = async (): Promise<void> => {
    if (!user?.id) return;
    
    try {
      await NotificationService.clearReadNotifications(user.id);
      setNotifications(prev => prev.filter(notification => !notification.isRead));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear read notifications');
      throw err;
    }
  };

  const createNotification = async (data: {
    userId: string;
    title: string;
    message: string;
    type: 'booking' | 'payment' | 'message' | 'system';
  }): Promise<void> => {
    try {
      const newNotification = await NotificationService.createNotification(data);
      setNotifications(prev => [newNotification, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notification');
      throw err;
    }
  };

  const refreshNotifications = async (): Promise<void> => {
    await fetchNotifications();
  };

  const getUnreadNotifications = (): Notification[] => {
    return notifications.filter(notification => !notification.isRead);
  };

  const getReadNotifications = (): Notification[] => {
    return notifications.filter(notification => notification.isRead);
  };

  const unreadCount = getUnreadNotifications().length;

  const value: NotificationsContextType = {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    createNotification,
    refreshNotifications,
    getUnreadNotifications,
    getReadNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};