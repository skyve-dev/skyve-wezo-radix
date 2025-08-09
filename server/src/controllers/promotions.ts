import { Request, Response } from 'express';
import prisma from '../services/database';

export const getPromotions = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const promotions = await prisma.promotion.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return res.status(500).json({ error: 'Failed to fetch promotions' });
  }
};

export const getPromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const promotion = await prisma.promotion.findUnique({
      where: { id }
    });
    
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    
    return res.json(promotion);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return res.status(500).json({ error: 'Failed to fetch promotion' });
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, link, isActive } = req.body;
    
    const promotion = await prisma.promotion.create({
      data: {
        title,
        description,
        imageUrl,
        link,
        isActive: isActive ?? true,
      }
    });
    
    return res.status(201).json(promotion);
  } catch (error) {
    console.error('Error creating promotion:', error);
    return res.status(500).json({ error: 'Failed to create promotion' });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, link, isActive } = req.body;
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (link !== undefined) updateData.link = link;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const promotion = await prisma.promotion.update({
      where: { id },
      data: updateData
    });
    
    return res.json(promotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    return res.status(500).json({ error: 'Failed to update promotion' });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.promotion.delete({
      where: { id },
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return res.status(500).json({ error: 'Failed to delete promotion' });
  }
};