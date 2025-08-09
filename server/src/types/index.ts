export interface VillaAmenities {
  generalComfort?: string[];
  outdoorRecreation?: string[];
  kitchenDining?: string[];
  technologyEntertainment?: string[];
  specialFeatures?: string[];
}

export interface HouseRules {
  checkInTime: string;
  checkOutTime: string;
  petsAllowed: boolean;
  partiesAllowed: boolean;
  commercialPhotographyAllowed: boolean;
  smokingAllowed: boolean;
  quietHours?: string;
  poolRules?: string;
  cleaningFee?: string;
}

export interface CustomPricing {
  date: string;
  price: number;
  label?: string;
}

export interface VillaPricing {
  weekday: number;
  weekend: number;
  halfDay: number;
}

export interface Villa {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: string;
  amenities: VillaAmenities;
  maxVisitors: number;
  numberOfBedrooms: number;
  numberOfBeds: number;
  numberOfBathrooms: number;
  pricing: VillaPricing;
  customPricing?: CustomPricing[];
  houseRules: HouseRules;
  isActive: boolean;
  isFeatured: boolean;
  ownerId: string;
}

export interface Booking {
  id: string;
  villaId: string;
  tenantId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
}