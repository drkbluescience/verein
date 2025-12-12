import { Router } from 'express';
import { getHealth, ping } from '../controllers/health.controller';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/health
router.get('/', asyncHandler(getHealth));

// GET /api/health/ping
router.get('/ping', ping);

export default router;

