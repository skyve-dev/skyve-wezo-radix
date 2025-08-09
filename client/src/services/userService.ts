import { api } from './api';
import type { User } from '../types';

export class UserService {
  /**
   * Login user with email and password
   */
  static async login(email: string, password: string): Promise<User> {
    try {
      return await api.login(email, password) as User;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Fetch all users with optional filters
   */
  static async getUsers(filters?: {
    role?: string;
    isActive?: boolean;
  }): Promise<User[]> {
    try {
      return await api.getUsers(filters) as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Fetch a single user by ID
   */
  static async getUserById(id: string): Promise<User> {
    try {
      return await api.getUser(id) as User;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: string): Promise<User[]> {
    try {
      return await api.getUsers({ role }) as User[];
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    avatar?: string;
    isActive?: boolean;
  }): Promise<User> {
    try {
      return await api.createUser(userData) as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      return await api.updateUser(id, updates) as User;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(id: string, profile: {
    name?: string;
    avatar?: string;
  }): Promise<User> {
    try {
      return await api.updateUser(id, profile) as User;
    } catch (error) {
      console.error(`Error updating profile for user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(id: string, newPassword: string): Promise<User> {
    try {
      return await api.updateUser(id, { password: newPassword }) as User;
    } catch (error) {
      console.error(`Error changing password for user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Activate or deactivate a user
   */
  static async setUserActive(id: string, isActive: boolean): Promise<User> {
    try {
      return await api.updateUser(id, { isActive }) as User;
    } catch (error) {
      console.error(`Error ${isActive ? 'activating' : 'deactivating'} user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      await api.deleteUser(id);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}