import { Router } from 'express';
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  approveBooking,
  rejectBooking,
} from '../controllers/bookings';

const router = Router();

router.get('/', getBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.patch('/:id/approve', approveBooking);
router.patch('/:id/reject', rejectBooking);
router.delete('/:id', deleteBooking);

export default router;