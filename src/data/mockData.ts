import type {Booking, Notification, Promotion, Villa} from '../types';

export const mockVillas: Villa[] = [
  {
    id: '1',
    name: 'Sunset Beach Villa',
    ownerId: '2',
    description: 'Luxurious beachfront villa with stunning sunset views',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
    location: 'Al Hamra, Ras Al Khaimah',
    amenities: ['Swimming Pool', 'Beach Access', 'BBQ Area', 'WiFi', 'Parking'],
    maxVisitors: 10,
    numberOfBedrooms: 4,
    numberOfBeds: 6,
    numberOfBathrooms: 3,
    pricing: {
      weekday: 1500,
      weekend: 2000,
      halfDay: 800,
    },
    customPricing: [
      {
        date: '2025-02-14', // Valentine's Day
        price: 3500,
        label: "Valentine's Day Special"
      },
      {
        date: '2025-03-31', // UAE National Day
        price: 4000,
        label: 'UAE National Day'
      },
      {
        date: '2025-08-20', // New Year's Day
        price: 5000,
        label: "New Year's Day"
      }
    ],
    isActive: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Mountain View Retreat',
    ownerId: '2',
    description: 'Peaceful mountain villa with panoramic views',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
    ],
    location: 'Jebel Jais, Ras Al Khaimah',
    amenities: ['Mountain View', 'Garden', 'BBQ Area', 'WiFi', 'Parking'],
    maxVisitors: 8,
    numberOfBedrooms: 3,
    numberOfBeds: 5,
    numberOfBathrooms: 2,
    pricing: {
      weekday: 1200,
      weekend: 1600,
      halfDay: 600,
    },
    isActive: true,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Desert Oasis Villa',
    ownerId: '2',
    description: 'Traditional Arabic villa in the heart of the desert',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    ],
    location: 'Al Wadi, Ras Al Khaimah',
    amenities: ['Desert View', 'Traditional Design', 'Pool', 'WiFi', 'Parking'],
    maxVisitors: 12,
    numberOfBedrooms: 5,
    numberOfBeds: 8,
    numberOfBathrooms: 4,
    pricing: {
      weekday: 1800,
      weekend: 2400,
      halfDay: 900,
    },
    isActive: true,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Marina Pearl Villa',
    ownerId: '2',
    description: 'Modern villa with marina views and yacht access',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
    ],
    location: 'Al Marjan Island, Ras Al Khaimah',
    amenities: ['Marina View', 'Yacht Access', 'Pool', 'Gym', 'WiFi'],
    maxVisitors: 15,
    numberOfBedrooms: 6,
    numberOfBeds: 10,
    numberOfBathrooms: 5,
    pricing: {
      weekday: 2500,
      weekend: 3500,
      halfDay: 1200,
    },
    customPricing: [
      {
        date: '2025-02-10', // Early February discount
        price: 2000,
        label: 'Early February Discount'
      },
      {
        date: '2025-02-11',
        price: 2000,
        label: 'Early February Discount'
      },
      {
        date: '2025-02-12',
        price: 2000,
        label: 'Early February Discount'
      },
      {
        date: '2025-04-15', // Spring Premium
        price: 4500,
        label: 'Spring Premium'
      }
    ],
    isActive: true,
    isFeatured: true,
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    villaId: '1',
    tenantId: '1',
    checkInDate: new Date('2024-02-15'),
    checkOutDate: new Date('2024-02-17'),
    numberOfGuests: 6,
    totalPrice: 4000,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: '2',
    villaId: '2',
    tenantId: '1',
    checkInDate: new Date('2024-03-01'),
    checkOutDate: new Date('2024-03-03'),
    numberOfGuests: 4,
    totalPrice: 3200,
    status: 'pending',
    paymentStatus: 'pending',
  },
];

export const mockPromotion: Promotion = {
  id: '1',
  title: 'Summer Special - 20% Off',
  description: 'Book your dream villa this summer and save 20% on weekend rates!',
  imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200',
  link: '/villas',
  isActive: true,
};

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Booking Confirmed',
    message: 'Your booking for Sunset Beach Villa has been confirmed',
    type: 'booking',
    timestamp: new Date('2024-02-10'),
    isRead: false,
  },
  {
    id: '2',
    userId: '1',
    title: 'Payment Received',
    message: 'Payment of AED 4000 has been received',
    type: 'payment',
    timestamp: new Date('2024-02-10'),
    isRead: true,
  },
];