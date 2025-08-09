import { api } from './api';
import type { Booking, Villa } from '../types';

export class BookingService {
  /**
   * Fetch all bookings with optional filters
   */
  static async getBookings(filters?: {
    villaId?: string;
    tenantId?: string;
    status?: string;
    paymentStatus?: string;
  }): Promise<Booking[]> {
    try {
      return await api.getBookings(filters) as Booking[];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  /**
   * Fetch a single booking by ID
   */
  static async getBookingById(id: string): Promise<Booking> {
    try {
      return await api.getBooking(id) as Booking;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get bookings for a specific tenant
   */
  static async getBookingsByTenant(tenantId: string): Promise<Booking[]> {
    try {
      return await api.getBookings({ tenantId }) as Booking[];
    } catch (error) {
      console.error(`Error fetching bookings for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  /**
   * Get bookings for a specific villa
   */
  static async getBookingsByVilla(villaId: string): Promise<Booking[]> {
    try {
      return await api.getBookings({ villaId }) as Booking[];
    } catch (error) {
      console.error(`Error fetching bookings for villa ${villaId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new booking
   */
  static async createBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
    try {
      return await api.createBooking(bookingData) as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Update an existing booking
   */
  static async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    try {
      return await api.updateBooking(id, updates) as Booking;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(id: string): Promise<Booking> {
    try {
      return await api.updateBooking(id, { status: 'cancelled' }) as Booking;
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      throw error;
    }
  }

  /**
   * Confirm a booking
   */
  static async confirmBooking(id: string): Promise<Booking> {
    try {
      return await api.updateBooking(id, { status: 'confirmed' }) as Booking;
    } catch (error) {
      console.error(`Error confirming booking ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a booking
   */
  static async deleteBooking(id: string): Promise<void> {
    try {
      await api.deleteBooking(id);
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if a villa is available for specific dates
   */
  static async isVillaAvailable(
    villaId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<boolean> {
    try {
      const bookings = await api.getBookings({ villaId }) as Booking[];
      
      // Filter for confirmed or pending bookings
      const relevantBookings = bookings.filter(
        booking => booking.status === 'confirmed' || booking.status === 'pending'
      );

      // Check for date overlap
      for (const booking of relevantBookings) {
        const existingCheckIn = new Date(booking.checkInDate);
        const existingCheckOut = new Date(booking.checkOutDate);
        
        // Two date ranges overlap if: start1 < end2 && start2 < end1
        if (checkInDate < existingCheckOut && existingCheckIn < checkOutDate) {
          return false; // Dates overlap, villa is not available
        }
      }

      return true; // No overlap found, villa is available
    } catch (error) {
      console.error(`Error checking villa ${villaId} availability:`, error);
      throw error;
    }
  }

  /**
   * Get available villas for specific dates
   */
  static async getAvailableVillas(
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<Villa[]> {
    try {
      const villas = await api.getVillas({ isActive: true }) as Villa[];
      const availableVillas = [];
      
      for (const villa of villas) {
        const isAvailable = await this.isVillaAvailable(
          villa.id,
          checkInDate,
          checkOutDate
        );
        
        if (isAvailable) {
          availableVillas.push(villa);
        }
      }

      return availableVillas;
    } catch (error) {
      console.error('Error fetching available villas:', error);
      throw error;
    }
  }
}