export interface VillaFilters {
  // Price range filter
  priceRange: {
    min: number | null;
    max: number | null;
  };
  
  // Location text filter
  location: string;
  
  // Villa details filters
  minBedrooms: number | null;
  minBathrooms: number | null;
  minGuests: number | null;
  
  // Amenities filters - grouped by category
  amenities: {
    generalComfort: string[];
    outdoorRecreation: string[];
    kitchenDining: string[];
    technologyEntertainment: string[];
    specialFeatures: string[];
  };
  
  // General search term
  searchTerm: string;
}

export const defaultFilters: VillaFilters = {
  priceRange: {
    min: null,
    max: null,
  },
  location: '',
  minBedrooms: null,
  minBathrooms: null,
  minGuests: null,
  amenities: {
    generalComfort: [],
    outdoorRecreation: [],
    kitchenDining: [],
    technologyEntertainment: [],
    specialFeatures: [],
  },
  searchTerm: '',
};

export interface FilterSummary {
  priceRange?: string;
  location?: string;
  bedrooms?: string;
  bathrooms?: string;
  guests?: string;
  amenitiesCount?: number;
  searchTerm?: string;
}