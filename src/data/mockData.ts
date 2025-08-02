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
    pricing: {
      weekday: 1500,
      weekend: 2000,
      halfDay: 800,
    },
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
    pricing: {
      weekday: 2500,
      weekend: 3500,
      halfDay: 1200,
    },
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