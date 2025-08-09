import { api } from './api';
import type { Villa } from '../types';

export class VillaService {
  /**
   * Fetch all villas with optional filters
   */
  static async getVillas(filters?: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    bedrooms?: number;
    isActive?: boolean;
  }): Promise<Villa[]> {
    try {
      return await api.getVillas(filters) as Villa[];
    } catch (error) {
      console.error('Error fetching villas:', error);
      throw error;
    }
  }

  /**
   * Fetch a single villa by ID
   */
  static async getVillaById(id: string): Promise<Villa> {
    try {
      return await api.getVilla(id) as Villa;
    } catch (error) {
      console.error(`Error fetching villa ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get featured villas
   */
  static async getFeaturedVillas(): Promise<Villa[]> {
    try {
      const villas = await api.getVillas({ isActive: true }) as Villa[];
      return villas.filter(villa => villa.isFeatured);
    } catch (error) {
      console.error('Error fetching featured villas:', error);
      throw error;
    }
  }

  /**
   * Get active villas
   */
  static async getActiveVillas(): Promise<Villa[]> {
    try {
      return await api.getVillas({ isActive: true }) as Villa[];
    } catch (error) {
      console.error('Error fetching active villas:', error);
      throw error;
    }
  }

  /**
   * Create a new villa
   */
  static async createVilla(villaData: Omit<Villa, 'id'>): Promise<Villa> {
    try {
      return await api.createVilla(villaData) as Villa;
    } catch (error) {
      console.error('Error creating villa:', error);
      throw error;
    }
  }

  /**
   * Update an existing villa
   */
  static async updateVilla(id: string, updates: Partial<Villa>): Promise<Villa> {
    try {
      return await api.updateVilla(id, updates) as Villa;
    } catch (error) {
      console.error(`Error updating villa ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a villa
   */
  static async deleteVilla(id: string): Promise<void> {
    try {
      await api.deleteVilla(id);
    } catch (error) {
      console.error(`Error deleting villa ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all unique locations from villas
   */
  static async getLocations(): Promise<string[]> {
    try {
      const villas = await api.getVillas({ isActive: true }) as Villa[];
      const locations = new Set(villas.map(villa => villa.location));
      return Array.from(locations).sort();
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  /**
   * Get all amenities categories
   */
  static async getAmenitiesCategories(): Promise<{ [key: string]: string[] }> {
    try {
      const villas = await api.getVillas({ isActive: true }) as Villa[];
      const amenitiesMap: { [key: string]: Set<string> } = {
        generalComfort: new Set(),
        outdoorRecreation: new Set(),
        kitchenDining: new Set(),
        technologyEntertainment: new Set(),
        specialFeatures: new Set(),
      };

      villas.forEach(villa => {
        Object.entries(villa.amenities).forEach(([category, items]) => {
          if (amenitiesMap[category] && items) {
            items.forEach((item: string) => amenitiesMap[category].add(item));
          }
        });
      });

      const result: { [key: string]: string[] } = {};
      Object.entries(amenitiesMap).forEach(([category, items]) => {
        result[category] = Array.from(items).sort();
      });

      return result;
    } catch (error) {
      console.error('Error fetching amenities categories:', error);
      throw error;
    }
  }
}