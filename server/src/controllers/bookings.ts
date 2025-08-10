import { Request, Response } from 'express';
import prisma from '../services/database';

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { 
      villaId, 
      tenantId, 
      status, 
      paymentStatus, 
      search,
      startDate,
      endDate,
      sortBy = 'checkInDate',
      sortOrder = 'desc'
    } = req.query;
    
    const where: any = {};
    
    // Basic filters - check for 'undefined' string and empty values
    if (villaId && villaId !== 'undefined') where.villaId = villaId;
    if (tenantId && tenantId !== 'undefined') where.tenantId = tenantId;
    if (status && status !== 'undefined') where.status = status;
    if (paymentStatus && paymentStatus !== 'undefined') where.paymentStatus = paymentStatus;
    
    // Date range filter
    if ((startDate && startDate !== 'undefined') || (endDate && endDate !== 'undefined')) {
      where.checkInDate = {};
      if (startDate && startDate !== 'undefined') {
        const parsedStartDate = new Date(startDate as string);
        if (!isNaN(parsedStartDate.getTime())) {
          where.checkInDate.gte = parsedStartDate;
        }
      }
      if (endDate && endDate !== 'undefined') {
        const parsedEndDate = new Date(endDate as string);
        if (!isNaN(parsedEndDate.getTime())) {
          where.checkInDate.lte = parsedEndDate;
        }
      }
      // Remove empty checkInDate object if no valid dates
      if (Object.keys(where.checkInDate).length === 0) {
        delete where.checkInDate;
      }
    }
    
    // Search filter (by booking ID or tenant email)
    if (search && search !== 'undefined' && search !== '') {
      const searchStr = search as string;
      where.OR = [
        { id: { contains: searchStr } },
        { tenant: { email: { contains: searchStr } } }
      ];
    }
    
    // Build sort object
    const orderBy: any = {};
    if (sortBy === 'checkInDate' || sortBy === 'checkOutDate' || sortBy === 'totalPrice' || sortBy === 'createdAt') {
      orderBy[sortBy as string] = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.checkInDate = 'desc'; // Default sort
    }
    
    const bookings = await prisma.booking.findMany({
      where,
      orderBy,
      include: {
        villa: {
          select: {
            id: true,
            name: true,
            location: true,
            images: true,
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    const transformedBookings = bookings.map(booking => ({
      ...booking,
      villa: {
        ...booking.villa,
        images: JSON.parse(booking.villa.images),
      }
    }));
    
    return res.json(transformedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        villa: true,
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const transformedBooking = {
      ...booking,
      villa: {
        ...booking.villa,
        images: JSON.parse(booking.villa.images),
        amenities: JSON.parse(booking.villa.amenities),
        houseRules: JSON.parse(booking.villa.houseRules),
        customPricing: booking.villa.customPricing ? JSON.parse(booking.villa.customPricing) : [],
        pricing: {
          weekday: booking.villa.weekdayPrice,
          weekend: booking.villa.weekendPrice,
          halfDay: booking.villa.halfDayPrice,
        }
      }
    };
    
    return res.json(transformedBooking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      villaId,
      tenantId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      status,
      paymentStatus,
    } = req.body;
    
    const booking = await prisma.booking.create({
      data: {
        villaId,
        tenantId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        numberOfGuests,
        totalPrice,
        status: status || 'pending',
        paymentStatus: paymentStatus || 'pending',
      },
      include: {
        villa: {
          select: {
            id: true,
            name: true,
            location: true,
            images: true,
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    const transformedBooking = {
      ...booking,
      villa: {
        ...booking.villa,
        images: JSON.parse(booking.villa.images),
      }
    };
    
    return res.status(201).json(transformedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      status,
      paymentStatus,
    } = req.body;
    
    const updateData: any = {};
    if (checkInDate !== undefined) updateData.checkInDate = new Date(checkInDate);
    if (checkOutDate !== undefined) updateData.checkOutDate = new Date(checkOutDate);
    if (numberOfGuests !== undefined) updateData.numberOfGuests = numberOfGuests;
    if (totalPrice !== undefined) updateData.totalPrice = totalPrice;
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    
    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        villa: {
          select: {
            id: true,
            name: true,
            location: true,
            images: true,
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    const transformedBooking = {
      ...booking,
      villa: {
        ...booking.villa,
        images: JSON.parse(booking.villa.images),
      }
    };
    
    return res.json(transformedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ error: 'Failed to update booking' });
  }
};

export const approveBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { id }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending bookings can be approved' });
    }
    
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'confirmed' },
      include: {
        villa: {
          select: {
            id: true,
            name: true,
            location: true,
            images: true,
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    const transformedBooking = {
      ...updatedBooking,
      villa: {
        ...updatedBooking.villa,
        images: JSON.parse(updatedBooking.villa.images),
      }
    };
    
    return res.json(transformedBooking);
  } catch (error) {
    console.error('Error approving booking:', error);
    return res.status(500).json({ error: 'Failed to approve booking' });
  }
};

export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { id }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending bookings can be rejected' });
    }
    
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' },
      include: {
        villa: {
          select: {
            id: true,
            name: true,
            location: true,
            images: true,
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    const transformedBooking = {
      ...updatedBooking,
      villa: {
        ...updatedBooking.villa,
        images: JSON.parse(updatedBooking.villa.images),
      }
    };
    
    return res.json(transformedBooking);
  } catch (error) {
    console.error('Error rejecting booking:', error);
    return res.status(500).json({ error: 'Failed to reject booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.booking.delete({
      where: { id },
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ error: 'Failed to delete booking' });
  }
};