import { Request, Response } from 'express';
import prisma from '../services/database';

export const getReportStats = async (req: Request, res: Response) => {
  try {
    const { period = '30d', userId, role } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    // Build where clauses based on user role
    let villaWhere: any = {};
    let bookingWhere: any = {
      createdAt: {
        gte: startDate
      }
    };
    
    if (role === 'homeowner' && userId) {
      villaWhere.ownerId = userId;
      const userVillas = await prisma.villa.findMany({
        where: villaWhere,
        select: { id: true }
      });
      const villaIds = userVillas.map(v => v.id);
      bookingWhere.villaId = { in: villaIds };
    }
    
    // Fetch aggregate data
    const [
      totalVillas,
      activeVillas,
      totalBookings,
      bookingsByStatus,
      totalUsers,
      activeUsers,
      villasByLocation,
      monthlyBookings,
      totalRevenue,
      propertyViews
    ] = await Promise.all([
      // Total properties
      prisma.villa.count({ where: villaWhere }),
      
      // Active properties
      prisma.villa.count({ 
        where: { 
          ...villaWhere, 
          isActive: true 
        } 
      }),
      
      // Total bookings
      prisma.booking.count({ where: bookingWhere }),
      
      // Bookings by status
      prisma.booking.groupBy({
        by: ['status'],
        where: bookingWhere,
        _count: true
      }),
      
      // Total users (admin only)
      role === 'admin' ? prisma.user.count() : Promise.resolve(0),
      
      // Active users in period (admin only) - using createdAt as proxy for activity
      role === 'admin' ? prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }) : Promise.resolve(0),
      
      // Villas by location
      prisma.villa.groupBy({
        by: ['location'],
        where: villaWhere,
        _count: true
      }),
      
      // Monthly booking trends
      prisma.booking.findMany({
        where: bookingWhere,
        select: {
          checkInDate: true
        }
      }),
      
      // Calculate total revenue
      prisma.booking.aggregate({
        where: {
          ...bookingWhere,
          status: 'confirmed'
        },
        _sum: {
          totalPrice: true
        }
      }),
      
      // Property views (using a mock calculation based on bookings for now)
      prisma.booking.count({
        where: bookingWhere
      })
    ]);
    
    // Process monthly bookings data
    const monthlyData: Record<string, number> = {};
    monthlyBookings.forEach(booking => {
      const month = new Date(booking.checkInDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    
    // Process location data
    const locationData = villasByLocation.map(item => ({
      location: item.location.split(',')[0].trim(),
      count: item._count
    })).slice(0, 5);
    
    // Calculate occupancy rate
    const confirmedBookings = bookingsByStatus.find(b => b.status === 'confirmed')?._count || 0;
    const totalDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const possibleBookings = totalVillas * totalDays;
    const occupancyRate = possibleBookings > 0 
      ? Math.round((confirmedBookings / possibleBookings) * 100) 
      : 0;
    
    // Build response based on role
    let stats: any = {
      period,
      dateRange: {
        start: startDate,
        end: now
      },
      properties: {
        total: totalVillas,
        active: activeVillas,
        inactive: totalVillas - activeVillas
      },
      bookings: {
        total: totalBookings,
        byStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
        monthlyTrend: monthlyData
      },
      revenue: {
        total: totalRevenue._sum.totalPrice || 0,
        average: totalBookings > 0 ? (totalRevenue._sum.totalPrice || 0) / totalBookings : 0
      },
      occupancy: {
        rate: occupancyRate,
        totalBookingDays: confirmedBookings,
        availableDays: possibleBookings
      },
      locations: locationData,
      propertyViews: propertyViews * 15 // Mock multiplier for views
    };
    
    if (role === 'admin') {
      stats.users = {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers
      };
    }
    
    return res.json(stats);
  } catch (error) {
    console.error('Error fetching report stats:', error);
    return res.status(500).json({ error: 'Failed to fetch report statistics' });
  }
};

export const getRevenueReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, userId, role } = req.query;
    
    let bookingWhere: any = {};
    
    if (startDate && endDate) {
      bookingWhere.checkInDate = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }
    
    if (role === 'homeowner' && userId) {
      const userVillas = await prisma.villa.findMany({
        where: { ownerId: userId as string },
        select: { id: true }
      });
      const villaIds = userVillas.map(v => v.id);
      bookingWhere.villaId = { in: villaIds };
    }
    
    bookingWhere.status = 'confirmed';
    
    const bookings = await prisma.booking.findMany({
      where: bookingWhere,
      include: {
        villa: {
          select: {
            name: true,
            location: true
          }
        }
      },
      orderBy: {
        checkInDate: 'desc'
      }
    });
    
    const revenue = bookings.map(booking => ({
      date: booking.checkInDate,
      amount: booking.totalPrice,
      villaName: booking.villa.name,
      location: booking.villa.location
    }));
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    return res.json({
      revenue,
      total: totalRevenue,
      count: bookings.length,
      average: bookings.length > 0 ? totalRevenue / bookings.length : 0
    });
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    return res.status(500).json({ error: 'Failed to fetch revenue report' });
  }
};

export const getPerformanceMetrics = async (req: Request, res: Response) => {
  try {
    const { villaId, userId, role } = req.query;
    
    let where: any = {};
    
    if (villaId) {
      where.id = villaId as string;
    } else if (role === 'homeowner' && userId) {
      where.ownerId = userId as string;
    }
    
    const villas = await prisma.villa.findMany({
      where,
      include: {
        bookings: {
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          },
          select: {
            status: true,
            totalPrice: true,
            checkInDate: true,
            checkOutDate: true
          }
        }
      }
    });
    
    const metrics = villas.map(villa => {
      const totalBookings = villa.bookings.length;
      const confirmedBookings = villa.bookings.filter(b => b.status === 'confirmed').length;
      const revenue = villa.bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      const bookingDays = villa.bookings
        .filter(b => b.status === 'confirmed')
        .reduce((days, booking) => {
          const checkIn = new Date(booking.checkInDate);
          const checkOut = new Date(booking.checkOutDate);
          return days + Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        }, 0);
      
      const occupancyRate = (bookingDays / 30) * 100;
      
      return {
        villaId: villa.id,
        villaName: villa.name,
        location: villa.location,
        totalBookings,
        confirmedBookings,
        revenue,
        occupancyRate: Math.min(100, Math.round(occupancyRate)),
        averageBookingValue: confirmedBookings > 0 ? revenue / confirmedBookings : 0
      };
    });
    
    return res.json(metrics);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
};