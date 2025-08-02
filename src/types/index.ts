export type UserRole = 'tenant' | 'homeowner' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
}

export interface CustomPricing {
  date: string; // ISO date string (YYYY-MM-DD)
  price: number;
  label?: string; // Optional label for special occasions (e.g., "New Year's Eve", "Christmas")
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

export interface Villa {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  images: string[];
  location: string;
  amenities: string[];
  maxVisitors: number;
  numberOfBedrooms: number;
  numberOfBeds: number;
  numberOfBathrooms: number;
  pricing: {
    weekday: number;
    weekend: number;
    halfDay: number;
  };
  customPricing?: CustomPricing[]; // Array of date-specific custom prices
  houseRules: HouseRules;
  isActive: boolean;
  isFeatured: boolean;
}

export interface Booking {
  id: string;
  villaId: string;
  tenantId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'message' | 'system';
  timestamp: Date;
  isRead: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
}