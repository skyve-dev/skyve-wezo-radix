import prisma from '../services/database';
// Import mock data from the copied data file
import * as fs from 'fs';
import * as path from 'path';

// Read the data file directly since TypeScript imports aren't working
const dataPath = path.join(__dirname, 'data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract mock data with regex (simple approach)
const villasMatch = dataContent.match(/export const mockVillas[^=]*=\s*(\[[^;]+);/s);
const promotionMatch = dataContent.match(/export const mockPromotion[^=]*=\s*(\{[^;]+);/s);

let mockVillas: any[] = [];
let mockPromotion: any = {};

if (villasMatch) {
    try {
        mockVillas = eval(villasMatch[1]);
    } catch (e) {
        console.log('Using fallback villa data');
        mockVillas = [];
    }
}

if (promotionMatch) {
    try {
        mockPromotion = eval(promotionMatch[1]);
    } catch (e) {
        console.log('Using fallback promotion data');
        mockPromotion = {
            title: 'Summer Special - 20% Off',
            description: 'Book your dream villa this summer and save 20% on weekend rates!',
            imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200',
            isActive: true
        };
    }
}

async function seed() {
    console.log('🌱 Starting database seed...');

    try {
        // Clear existing data
        await prisma.booking.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.promotion.deleteMany();
        await prisma.villa.deleteMany();
        await prisma.user.deleteMany();

        console.log('✅ Cleared existing data');

        // Create users
        const adminUser = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: 'password',
                name: 'Admin User',
                role: 'admin',
                isActive: true,
            }
        });
        
        // Use adminUser if needed (currently not used)
        console.log('Admin user created:', adminUser.email);

        const homeownerUser = await prisma.user.create({
            data: {
                email: 'homeowner@example.com',
                password: 'password',
                name: 'John Homeowner',
                role: 'homeowner',
                isActive: true,
            }
        });

        const tenantUser = await prisma.user.create({
            data: {
                email: 'tenant@example.com',
                password: 'password',
                name: 'Jane Tenant',
                role: 'tenant',
                isActive: true,
            }
        });

        console.log('✅ Created users');

        // Create villas
        const villaPromises = mockVillas.map(villa =>
            prisma.villa.create({
                data: {
                    name: villa.name,
                    ownerId: homeownerUser.id,
                    description: villa.description,
                    images: JSON.stringify(villa.images),
                    location: villa.location,
                    amenities: JSON.stringify(villa.amenities),
                    maxVisitors: villa.maxVisitors,
                    numberOfBedrooms: villa.numberOfBedrooms,
                    numberOfBeds: villa.numberOfBeds,
                    numberOfBathrooms: villa.numberOfBathrooms,
                    weekdayPrice: villa.pricing.weekday,
                    weekendPrice: villa.pricing.weekend,
                    halfDayPrice: villa.pricing.halfDay,
                    customPricing: villa.customPricing ? JSON.stringify(villa.customPricing) : null,
                    houseRules: JSON.stringify(villa.houseRules),
                    isActive: villa.isActive,
                    isFeatured: villa.isFeatured,
                }
            })
        );

        const createdVillas = await Promise.all(villaPromises);
        console.log(`✅ Created ${createdVillas.length} villas`);

        // Create bookings
        if (createdVillas.length > 0) {
            await prisma.booking.create({
                data: {
                    villaId: createdVillas[0].id,
                    tenantId: tenantUser.id,
                    checkInDate: new Date('2024-02-15'),
                    checkOutDate: new Date('2024-02-17'),
                    numberOfGuests: 6,
                    totalPrice: 4000,
                    status: 'confirmed',
                    paymentStatus: 'paid',
                }
            });

            if (createdVillas.length > 1) {
                await prisma.booking.create({
                    data: {
                        villaId: createdVillas[1].id,
                        tenantId: tenantUser.id,
                        checkInDate: new Date('2024-03-01'),
                        checkOutDate: new Date('2024-03-03'),
                        numberOfGuests: 4,
                        totalPrice: 3200,
                        status: 'pending',
                        paymentStatus: 'pending',
                    }
                });
            }

            console.log('✅ Created bookings');
        }

        // Create notifications
        await prisma.notification.createMany({
            data: [
                {
                    userId: tenantUser.id,
                    title: 'Booking Confirmed',
                    message: 'Your booking for ' + createdVillas[0]?.name + ' has been confirmed',
                    type: 'booking',
                    timestamp: new Date('2024-02-10'),
                    isRead: false,
                },
                {
                    userId: tenantUser.id,
                    title: 'Payment Received',
                    message: 'Payment of AED 4000 has been received',
                    type: 'payment',
                    timestamp: new Date('2024-02-10'),
                    isRead: true,
                }
            ]
        });

        console.log('✅ Created notifications');

        // Create promotion
        await prisma.promotion.create({
            data: {
                title: mockPromotion.title,
                description: mockPromotion.description,
                imageUrl: mockPromotion.imageUrl,
                link: mockPromotion.link || '',
                isActive: mockPromotion.isActive,
            }
        });

        console.log('✅ Created promotion');

        console.log('🎉 Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed();