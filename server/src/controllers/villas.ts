import { Request, Response } from 'express';
import prisma from '../services/database';
import { VillaAmenities, HouseRules, CustomPricing } from '../types';

export const getVillas = async (req: Request, res: Response) => {
  try {
    const { location, guests, bedrooms, isActive } = req.query;
    
    const where: any = {};
    
    if (location) where.location = location;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (guests) where.maxVisitors = { gte: parseInt(guests as string) };
    if (bedrooms) where.numberOfBedrooms = { gte: parseInt(bedrooms as string) };
    
    const villas = await prisma.villa.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    const transformedVillas = villas.map(villa => ({
      ...villa,
      images: JSON.parse(villa.images),
      amenities: JSON.parse(villa.amenities) as VillaAmenities,
      pricing: {
        weekday: villa.weekdayPrice,
        weekend: villa.weekendPrice,
        halfDay: villa.halfDayPrice,
      },
      customPricing: villa.customPricing ? JSON.parse(villa.customPricing) as CustomPricing[] : [],
      houseRules: JSON.parse(villa.houseRules) as HouseRules,
    }));
    
    return res.json(transformedVillas);
  } catch (error) {
    console.error('Error fetching villas:', error);
    return res.status(500).json({ error: 'Failed to fetch villas' });
  }
};

export const getVilla = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const villa = await prisma.villa.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        bookings: {
          select: {
            id: true,
            checkInDate: true,
            checkOutDate: true,
            status: true,
          }
        }
      }
    });
    
    if (!villa) {
      return res.status(404).json({ error: 'Villa not found' });
    }
    
    const transformedVilla = {
      ...villa,
      images: JSON.parse(villa.images),
      amenities: JSON.parse(villa.amenities) as VillaAmenities,
      pricing: {
        weekday: villa.weekdayPrice,
        weekend: villa.weekendPrice,
        halfDay: villa.halfDayPrice,
      },
      customPricing: villa.customPricing ? JSON.parse(villa.customPricing) as CustomPricing[] : [],
      houseRules: JSON.parse(villa.houseRules) as HouseRules,
    };
    
    return res.json(transformedVilla);
  } catch (error) {
    console.error('Error fetching villa:', error);
    return res.status(500).json({ error: 'Failed to fetch villa' });
  }
};

export const createVilla = async (req: Request, res: Response) => {
  try {
    const {
      name,
      ownerId,
      description,
      images,
      location,
      amenities,
      maxVisitors,
      numberOfBedrooms,
      numberOfBeds,
      numberOfBathrooms,
      pricing,
      customPricing,
      houseRules,
      isActive,
      isFeatured,
    } = req.body;
    
    const villa = await prisma.villa.create({
      data: {
        name,
        ownerId,
        description,
        images: JSON.stringify(images),
        location,
        amenities: JSON.stringify(amenities),
        maxVisitors,
        numberOfBedrooms,
        numberOfBeds,
        numberOfBathrooms,
        weekdayPrice: pricing.weekday,
        weekendPrice: pricing.weekend,
        halfDayPrice: pricing.halfDay,
        customPricing: customPricing ? JSON.stringify(customPricing) : null,
        houseRules: JSON.stringify(houseRules),
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    const transformedVilla = {
      ...villa,
      images: JSON.parse(villa.images),
      amenities: JSON.parse(villa.amenities) as VillaAmenities,
      pricing: {
        weekday: villa.weekdayPrice,
        weekend: villa.weekendPrice,
        halfDay: villa.halfDayPrice,
      },
      customPricing: villa.customPricing ? JSON.parse(villa.customPricing) as CustomPricing[] : [],
      houseRules: JSON.parse(villa.houseRules) as HouseRules,
    };
    
    return res.status(201).json(transformedVilla);
  } catch (error) {
    console.error('Error creating villa:', error);
    return res.status(500).json({ error: 'Failed to create villa' });
  }
};

export const updateVilla = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      images,
      location,
      amenities,
      maxVisitors,
      numberOfBedrooms,
      numberOfBeds,
      numberOfBathrooms,
      pricing,
      customPricing,
      houseRules,
      isActive,
      isFeatured,
    } = req.body;
    
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = JSON.stringify(images);
    if (location !== undefined) updateData.location = location;
    if (amenities !== undefined) updateData.amenities = JSON.stringify(amenities);
    if (maxVisitors !== undefined) updateData.maxVisitors = maxVisitors;
    if (numberOfBedrooms !== undefined) updateData.numberOfBedrooms = numberOfBedrooms;
    if (numberOfBeds !== undefined) updateData.numberOfBeds = numberOfBeds;
    if (numberOfBathrooms !== undefined) updateData.numberOfBathrooms = numberOfBathrooms;
    if (pricing !== undefined) {
      if (pricing.weekday !== undefined) updateData.weekdayPrice = pricing.weekday;
      if (pricing.weekend !== undefined) updateData.weekendPrice = pricing.weekend;
      if (pricing.halfDay !== undefined) updateData.halfDayPrice = pricing.halfDay;
    }
    if (customPricing !== undefined) updateData.customPricing = JSON.stringify(customPricing);
    if (houseRules !== undefined) updateData.houseRules = JSON.stringify(houseRules);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    
    const villa = await prisma.villa.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    const transformedVilla = {
      ...villa,
      images: JSON.parse(villa.images),
      amenities: JSON.parse(villa.amenities) as VillaAmenities,
      pricing: {
        weekday: villa.weekdayPrice,
        weekend: villa.weekendPrice,
        halfDay: villa.halfDayPrice,
      },
      customPricing: villa.customPricing ? JSON.parse(villa.customPricing) as CustomPricing[] : [],
      houseRules: JSON.parse(villa.houseRules) as HouseRules,
    };
    
    return res.json(transformedVilla);
  } catch (error) {
    console.error('Error updating villa:', error);
    return res.status(500).json({ error: 'Failed to update villa' });
  }
};

export const deleteVilla = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.villa.delete({
      where: { id },
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting villa:', error);
    return res.status(500).json({ error: 'Failed to delete villa' });
  }
};