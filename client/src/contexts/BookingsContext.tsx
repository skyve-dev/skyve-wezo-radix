import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface BookingsContextType {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  getBookingsByTenant: (tenantId: string) => Booking[];
  getBookingsByVilla: (villaId: string) => Booking[];
  refreshBookings: () => Promise<void>;
}

const BookingsContext = createContext<BookingsContextType | null>(null);

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
};

interface BookingsProviderProps {
  children: ReactNode;
}

export const BookingsProvider: React.FC<BookingsProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (user?.role === 'tenant') {
        params.tenantId = user.id;
      }
      const data = await api.getBookings(params) as Booking[];
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const addBooking = async (bookingData: Omit<Booking, 'id'>) => {
    try {
      const newBooking = await api.createBooking(bookingData) as Booking;
      setBookings(prev => [...prev, newBooking]);
    } catch (err) {
      console.error('Error adding booking:', err);
      throw err;
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const updatedBooking = await api.updateBooking(id, updates) as Booking;
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id ? updatedBooking : booking
        )
      );
    } catch (err) {
      console.error('Error updating booking:', err);
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await api.deleteBooking(id);
      setBookings(prev => prev.filter(booking => booking.id !== id));
    } catch (err) {
      console.error('Error deleting booking:', err);
      throw err;
    }
  };

  const getBookingsByTenant = (tenantId: string) => {
    return bookings.filter(booking => booking.tenantId === tenantId);
  };

  const getBookingsByVilla = (villaId: string) => {
    return bookings.filter(booking => booking.villaId === villaId);
  };

  const value = {
    bookings,
    loading,
    error,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingsByTenant,
    getBookingsByVilla,
    refreshBookings: fetchBookings,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
};