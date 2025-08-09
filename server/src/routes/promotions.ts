import { Router } from 'express';
import {
  getPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../controllers/promotions';

const router = Router();

router.get('/', getPromotions);
router.get('/:id', getPromotion);
router.post('/', createPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

export default router;