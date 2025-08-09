import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Booking } from '../types';

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  getBookingsByTenant: (tenantId: string) => Booking[];
  getBookingsByVilla: (villaId: string) => Booking[];
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

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, ...updates } : booking
      )
    );
  };

  const getBookingsByTenant = (tenantId: string) => {
    return bookings.filter(booking => booking.tenantId === tenantId);
  };

  const getBookingsByVilla = (villaId: string) => {
    return bookings.filter(booking => booking.villaId === villaId);
  };

  const value = {
    bookings,
    addBooking,
    updateBooking,
    getBookingsByTenant,
    getBookingsByVilla,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
};