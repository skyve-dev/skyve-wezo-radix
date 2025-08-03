import type {Booking, Notification, Promotion} from '../types';


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