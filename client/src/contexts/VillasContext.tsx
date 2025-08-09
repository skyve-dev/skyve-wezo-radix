import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Villa, Booking } from '../types';
import { api } from '../services/api';

interface VillasContextType {
  villas: Villa[];
  loading: boolean;
  error: string | null;
  getVillaById: (id: string) => Villa | undefined;
  getFeaturedVillas: () => Villa[];
  getAvailableVillas: (checkInDate: Date, checkOutDate: Date) => Villa[];
  isVillaAvailable: (villaId: string, checkInDate: Date, checkOutDate: Date, bookings: Booking[]) => boolean;
  updateVilla: (id: string, updates: Partial<Villa>) => Promise<void>;
  addVilla: (villa: Omit<Villa, 'id'>) => Promise<void>;
  deleteVilla: (id: string) => Promise<void>;
  refreshVillas: () => Promise<void>;
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
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVillas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getVillas({ isActive: true }) as Villa[];
      setVillas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch villas');
      console.error('Error fetching villas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillas();
  }, []);

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

  const updateVilla = async (id: string, updates: Partial<Villa>) => {
    try {
      const updatedVilla = await api.updateVilla(id, updates) as Villa;
      setVillas(prev => 
        prev.map(villa => 
          villa.id === id ? updatedVilla : villa
        )
      );
    } catch (err) {
      console.error('Error updating villa:', err);
      throw err;
    }
  };

  const addVilla = async (villaData: Omit<Villa, 'id'>) => {
    try {
      const newVilla = await api.createVilla(villaData) as Villa;
      setVillas(prev => [...prev, newVilla]);
    } catch (err) {
      console.error('Error adding villa:', err);
      throw err;
    }
  };

  const deleteVilla = async (id: string) => {
    try {
      await api.deleteVilla(id);
      setVillas(prev => prev.filter(villa => villa.id !== id));
    } catch (err) {
      console.error('Error deleting villa:', err);
      throw err;
    }
  };

  const value = {
    villas,
    loading,
    error,
    getVillaById,
    getFeaturedVillas,
    getAvailableVillas,
    isVillaAvailable,
    updateVilla,
    addVilla,
    deleteVilla,
    refreshVillas: fetchVillas,
  };

  return (
    <VillasContext.Provider value={value}>
      {children}
    </VillasContext.Provider>
  );
};