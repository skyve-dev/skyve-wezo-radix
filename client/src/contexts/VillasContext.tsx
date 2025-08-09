import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Villa, Booking } from '../types';
import { mockVillas } from '../data/data';

interface VillasContextType {
  villas: Villa[];
  getVillaById: (id: string) => Villa | undefined;
  getFeaturedVillas: () => Villa[];
  getAvailableVillas: (checkInDate: Date, checkOutDate: Date) => Villa[];
  isVillaAvailable: (villaId: string, checkInDate: Date, checkOutDate: Date, bookings: Booking[]) => boolean;
  updateVilla: (id: string, updates: Partial<Villa>) => void;
  addVilla: (villa: Villa) => void;
  deleteVilla: (id: string) => void;
}

const VillasContext = createContext<VillasContextType | null>(null);

export const useVillas = () => {
  const context = useContext(VillasContext);
  if (!context) {
    throw new Error('useVillas must be used within a VillasProvider');
  }
  return context;
};

interface VillasProviderProps {
  children: ReactNode;
}

export const VillasProvider: React.FC<VillasProviderProps> = ({ children }) => {
  const [villas, setVillas] = useState<Villa[]>(mockVillas);

  const getVillaById = (id: string): Villa | undefined => {
    return villas.find(villa => villa.id === id);
  };

  const getFeaturedVillas = (): Villa[] => {
    return villas.filter(villa => villa.isFeatured && villa.isActive);
  };

  const isVillaAvailable = (
    villaId: string, 
    checkInDate: Date, 
    checkOutDate: Date, 
    bookings: Booking[]
  ): boolean => {
    // Get all confirmed bookings for this villa
    const villaBookings = bookings.filter(
      booking => booking.villaId === villaId && 
      (booking.status === 'confirmed' || booking.status === 'pending')
    );

    // Check if the requested dates overlap with any existing booking
    for (const booking of villaBookings) {
      const existingCheckIn = new Date(booking.checkInDate);
      const existingCheckOut = new Date(booking.checkOutDate);
      
      // Check for date overlap
      // Two date ranges overlap if: start1 < end2 && start2 < end1
      if (checkInDate < existingCheckOut && existingCheckIn < checkOutDate) {
        return false; // Dates overlap, villa is not available
      }
    }

    return true; // No overlap found, villa is available
  };

  const getAvailableVillas = (_checkInDate: Date, _checkOutDate: Date): Villa[] => {
    // This function would need access to bookings context
    // For now, return all active villas
    // The availability check will be done individually when needed
    return villas.filter(villa => villa.isActive);
  };

  const updateVilla = (id: string, updates: Partial<Villa>) => {
    setVillas(prev => 
      prev.map(villa => 
        villa.id === id ? { ...villa, ...updates } : villa
      )
    );
  };

  const addVilla = (villa: Villa) => {
    setVillas(prev => [...prev, villa]);
  };

  const deleteVilla = (id: string) => {
    setVillas(prev => prev.filter(villa => villa.id !== id));
  };

  const value = {
    villas,
    getVillaById,
    getFeaturedVillas,
    getAvailableVillas,
    isVillaAvailable,
    updateVilla,
    addVilla,
    deleteVilla,
  };

  return (
    <VillasContext.Provider value={value}>
      {children}
    </VillasContext.Provider>
  );
};