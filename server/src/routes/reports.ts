import { Router } from 'express';
import {
  getReportStats,
  getRevenueReport,
  getPerformanceMetrics
} from '../controllers/reports';

const router = Router();

router.get('/stats', getReportStats);
router.get('/revenue', getRevenueReport);
router.get('/performance', getPerformanceMetrics);

export default router;