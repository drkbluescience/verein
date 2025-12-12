/**
 * Verein Routes
 */

import { Router } from 'express';
import { getAll, getActive, getById, getFullDetails, create, update, remove } from '../controllers/verein.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/vereine - Get all Vereine (Admin only)
router.get('/', requireRoles('Admin'), getAll);

// GET /api/vereine/active - Get active Vereine
router.get('/active', getActive);

// GET /api/vereine/:id - Get Verein by ID
router.get('/:id', getById);

// GET /api/vereine/:id/full-details - Get Verein with full details
router.get('/:id/full-details', getFullDetails);

// POST /api/vereine - Create new Verein (Admin only)
router.post('/', requireRoles('Admin'), create);

// PUT /api/vereine/:id - Update Verein (Admin or Dernek)
router.put('/:id', requireRoles('Admin', 'Dernek'), update);

// DELETE /api/vereine/:id - Delete Verein (Admin only)
router.delete('/:id', requireRoles('Admin'), remove);

export default router;

