import { Router } from 'express';
import {
  getVillas,
  getVilla,
  createVilla,
  updateVilla,
  deleteVilla,
} from '../controllers/villas';

const router = Router();

router.get('/', getVillas);
router.get('/:id', getVilla);
router.post('/', createVilla);
router.put('/:id', updateVilla);
router.delete('/:id', deleteVilla);

export default router;