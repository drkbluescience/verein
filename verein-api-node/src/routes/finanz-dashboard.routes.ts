/**
 * Finanz Dashboard Routes
 * Financial statistics endpoints
 */

import { Router } from 'express';
import * as finanzDashboardController from '../controllers/finanz-dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/finanzdashboard/stats
router.get('/stats', finanzDashboardController.getDashboardStats);

export default router;

