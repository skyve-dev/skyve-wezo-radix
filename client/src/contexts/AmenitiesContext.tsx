import React, { createContext, useContext, useState, useEffect } from 'react';
import { VillaService } from '../services';

interface AmenityCategory {
  generalComfort: string[];
  outdoorRecreation: string[];
  kitchenDining: string[];
  technologyEntertainment: string[];
  specialFeatures: string[];
}

interface AmenitiesContextType {
  amenities: AmenityCategory;
  getAllAmenities: () => string[];
  getAmenitiesByCategory: (category: keyof AmenityCategory) => string[];
  searchAmenities: (searchTerm: string) => string[];
  getCategoryForAmenity: (amenity: string) => keyof AmenityCategory | null;
  addAmenity: (category: keyof AmenityCategory, amenity: string) => void;
  removeAmenity: (category: keyof AmenityCategory, amenity: string) => void;
  updateAmenity: (category: keyof AmenityCategory, oldAmenity: string, newAmenity: string) => void;
}

const AmenitiesContext = createContext<AmenitiesContextType | undefined>(undefined);

export const useAmenities = () => {
  const context = useContext(AmenitiesContext);
  if (!context) {
    throw new Error('useAmenities must be used within an AmenitiesProvider');
  }
  return context;
};

interface AmenitiesProviderProps {
  children: React.ReactNode;
}

export const AmenitiesProvider: React.FC<AmenitiesProviderProps> = ({ children }) => {
  const [amenities, setAmenities] = useState<AmenityCategory>({
    generalComfort: [],
    outdoorRecreation: [],
    kitchenDining: [],
    technologyEntertainment: [],
    specialFeatures: [],
  });

  // Load amenities from API on mount
  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const amenitiesData = await VillaService.getAmenitiesCategories();
        setAmenities(amenitiesData as unknown as AmenityCategory);
        // Cache in localStorage
        localStorage.setItem('amenities', JSON.stringify(amenitiesData));
      } catch (error) {
        console.error('Error loading amenities from API:', error);
        // Fallback to localStorage if API fails
        const storedAmenities = localStorage.getItem('amenities');
        if (storedAmenities) {
          try {
            setAmenities(JSON.parse(storedAmenities));
          } catch (parseError) {
            console.error('Error parsing stored amenities:', parseError);
          }
        }
      }
    };
    
    loadAmenities();
  }, []);

  // Save amenities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('amenities', JSON.stringify(amenities));
  }, [amenities]);

  // Get all amenities as a flat array
  const getAllAmenities = (): string[] => {
    const allAmenities: string[] = [];
    Object.values(amenities).forEach(categoryAmenities => {
      allAmenities.push(...categoryAmenities);
    });
    return [...new Set(allAmenities)].sort();
  };

  // Get amenities by category
  const getAmenitiesByCategory = (category: keyof AmenityCategory): string[] => {
    return amenities[category] || [];
  };

  // Search amenities across all categories
  const searchAmenities = (searchTerm: string): string[] => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const results: string[] = [];
    
    Object.values(amenities).forEach(categoryAmenities => {
      categoryAmenities.forEach((amenity: string) => {
        if (amenity.toLowerCase().includes(lowerSearchTerm)) {
          results.push(amenity);
        }
      });
    });
    
    return [...new Set(results)].sort();
  };

  // Find which category an amenity belongs to
  const getCategoryForAmenity = (amenity: string): keyof AmenityCategory | null => {
    for (const [category, categoryAmenities] of Object.entries(amenities)) {
      if (categoryAmenities.includes(amenity)) {
        return category as keyof AmenityCategory;
      }
    }
    return null;
  };

  // Add a new amenity to a category
  const addAmenity = (category: keyof AmenityCategory, amenity: string) => {
    if (!amenity.trim()) return;
    
    setAmenities(prev => ({
      ...prev,
      [category]: [...new Set([...prev[category], amenity.trim()])].sort()
    }));
  };

  // Remove an amenity from a category
  const removeAmenity = (category: keyof AmenityCategory, amenity: string) => {
    setAmenities(prev => ({
      ...prev,
      [category]: prev[category].filter(a => a !== amenity)
    }));
  };

  // Update an amenity in a category
  const updateAmenity = (category: keyof AmenityCategory, oldAmenity: string, newAmenity: string) => {
    if (!newAmenity.trim()) return;
    
    setAmenities(prev => ({
      ...prev,
      [category]: prev[category].map(a => 
        a === oldAmenity ? newAmenity.trim() : a
      ).sort()
    }));
  };

  const value: AmenitiesContextType = {
    amenities,
    getAllAmenities,
    getAmenitiesByCategory,
    searchAmenities,
    getCategoryForAmenity,
    addAmenity,
    removeAmenity,
    updateAmenity,
  };

  return (
    <AmenitiesContext.Provider value={value}>
      {children}
    </AmenitiesContext.Provider>
  );
};