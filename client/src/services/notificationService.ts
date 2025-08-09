import { api } from './api';
import type { Notification } from '../types';

export class NotificationService {
  /**
   * Fetch all notifications with optional filters
   */
  static async getNotifications(filters?: {
    userId?: string;
    type?: string;
    isRead?: boolean;
  }): Promise<Notification[]> {
    try {
      return await api.getNotifications(filters) as Notification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get notifications for a specific user
   */
  static async getUserNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    try {
      const filters: any = { userId };
      if (unreadOnly) {
        filters.isRead = false;
      }
      return await api.getNotifications(filters) as Notification[];
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get unread notifications count for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await api.getNotifications({ 
        userId, 
        isRead: false 
      }) as Notification[];
      return notifications.length;
    } catch (error) {
      console.error(`Error fetching unread count for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new notification
   */
  static async createNotification(notificationData: {
    userId: string;
    title: string;
    message: string;
    type: 'booking' | 'payment' | 'message' | 'system';
  }): Promise<Notification> {
    try {
      return await api.createNotification(notificationData) as Notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(id: string): Promise<Notification> {
    try {
      return await api.markNotificationAsRead(id) as Notification;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const unreadNotifications = await api.getNotifications({ 
        userId, 
        isRead: false 
      }) as Notification[];
      
      await Promise.all(
        unreadNotifications.map(notification => 
          api.markNotificationAsRead(notification.id)
        )
      );
    } catch (error) {
      console.error(`Error marking all notifications as read for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(id: string): Promise<void> {
    try {
      await api.deleteNotification(id);
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete all read notifications for a user
   */
  static async clearReadNotifications(userId: string): Promise<void> {
    try {
      const readNotifications = await api.getNotifications({ 
        userId, 
        isRead: true 
      }) as Notification[];
      
      await Promise.all(
        readNotifications.map(notification => 
          api.deleteNotification(notification.id)
        )
      );
    } catch (error) {
      console.error(`Error clearing read notifications for user ${userId}:`, error);
      throw error;
    }
  }
}