import { api } from './api';
import type { Promotion } from '../types';

export class PromotionService {
  /**
   * Fetch all promotions with optional filter
   */
  static async getPromotions(activeOnly?: boolean): Promise<Promotion[]> {
    try {
      const filters = activeOnly !== undefined ? { isActive: activeOnly } : undefined;
      return await api.getPromotions(filters) as Promotion[];
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
  }

  /**
   * Get active promotions
   */
  static async getActivePromotions(): Promise<Promotion[]> {
    try {
      return await api.getPromotions({ isActive: true }) as Promotion[];
    } catch (error) {
      console.error('Error fetching active promotions:', error);
      throw error;
    }
  }

  /**
   * Fetch a single promotion by ID
   */
  static async getPromotionById(id: string): Promise<Promotion> {
    try {
      return await api.getPromotion(id) as Promotion;
    } catch (error) {
      console.error(`Error fetching promotion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new promotion
   */
  static async createPromotion(promotionData: Omit<Promotion, 'id'>): Promise<Promotion> {
    try {
      return await api.createPromotion(promotionData) as Promotion;
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  }

  /**
   * Update an existing promotion
   */
  static async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion> {
    try {
      return await api.updatePromotion(id, updates) as Promotion;
    } catch (error) {
      console.error(`Error updating promotion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Activate or deactivate a promotion
   */
  static async togglePromotion(id: string, isActive: boolean): Promise<Promotion> {
    try {
      return await api.updatePromotion(id, { isActive }) as Promotion;
    } catch (error) {
      console.error(`Error ${isActive ? 'activating' : 'deactivating'} promotion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a promotion
   */
  static async deletePromotion(id: string): Promise<void> {
    try {
      await api.deletePromotion(id);
    } catch (error) {
      console.error(`Error deleting promotion ${id}:`, error);
      throw error;
    }
  }
}