import type { Villa } from '../types';
import type { VillaFilters } from '../types/filters';

export const applyFilters = (villas: Villa[], filters: VillaFilters): Villa[] => {
  return villas.filter(villa => {
    // Search term filter
    if (filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        villa.name.toLowerCase().includes(searchTerm) ||
        villa.description.toLowerCase().includes(searchTerm) ||
        villa.location.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Price range filter
    if (filters.priceRange.min !== null) {
      if (villa.pricing.weekday < filters.priceRange.min) return false;
    }
    
    if (filters.priceRange.max !== null) {
      if (villa.pricing.weekday > filters.priceRange.max) return false;
    }

    // Location filter
    if (filters.location.trim()) {
      const locationMatch = villa.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());
      
      if (!locationMatch) return false;
    }

    // Villa details filters
    if (filters.minBedrooms !== null) {
      if (villa.numberOfBedrooms < filters.minBedrooms) return false;
    }

    if (filters.minBathrooms !== null) {
      if (villa.numberOfBathrooms < filters.minBathrooms) return false;
    }

    if (filters.minGuests !== null) {
      if (villa.maxVisitors < filters.minGuests) return false;
    }

    // Amenities filter
    const hasSelectedAmenities = Object.values(filters.amenities).some(
      categoryAmenities => categoryAmenities.length > 0
    );

    if (hasSelectedAmenities) {
      // Check if villa has all selected amenities
      const villaAmenities = getAllVillaAmenities(villa);
      
      for (const selectedAmenities of Object.values(filters.amenities)) {
        for (const amenity of selectedAmenities) {
          if (!villaAmenities.includes(amenity)) {
            return false;
          }
        }
      }
    }

    return true;
  });
};

// Helper function to get all amenities from a villa as a flat array
export const getAllVillaAmenities = (villa: Villa): string[] => {
  const allAmenities: string[] = [];
  
  Object.values(villa.amenities).forEach(categoryItems => {
    if (categoryItems) {
      allAmenities.push(...categoryItems);
    }
  });
  
  return allAmenities;
};

// Helper function to count active filters
export const getActiveFilterCount = (filters: VillaFilters): number => {
  let count = 0;
  
  if (filters.searchTerm.trim()) count++;
  if (filters.priceRange.min !== null || filters.priceRange.max !== null) count++;
  if (filters.location.trim()) count++;
  if (filters.minBedrooms !== null) count++;
  if (filters.minBathrooms !== null) count++;
  if (filters.minGuests !== null) count++;
  
  const amenityCount = Object.values(filters.amenities).flat().length;
  if (amenityCount > 0) count++;
  
  return count;
};

// Helper function to check if any filters are active
export const hasActiveFilters = (filters: VillaFilters): boolean => {
  return getActiveFilterCount(filters) > 0;
};