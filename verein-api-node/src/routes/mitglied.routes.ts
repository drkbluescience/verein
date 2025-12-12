/**
 * Mitglied Routes
 */

import { Router } from 'express';
import {
  getAll,
  getById,
  getByVerein,
  search,
  getStatistics,
  create,
  update,
  remove,
  setActiveStatus,
} from '../controllers/mitglied.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/mitglieder - Get all Mitglieder with pagination
router.get('/', getAll);

// GET /api/mitglieder/search - Search Mitglieder by name
router.get('/search', search);

// GET /api/mitglieder/verein/:vereinId - Get Mitglieder by Verein
router.get('/verein/:vereinId', getByVerein);

// GET /api/mitglieder/statistics/verein/:vereinId - Get membership statistics
router.get('/statistics/verein/:vereinId', getStatistics);

// GET /api/mitglieder/:id - Get Mitglied by ID
router.get('/:id', getById);

// POST /api/mitglieder - Create new Mitglied (Admin or Dernek only)
router.post('/', requireRoles('Admin', 'Dernek'), create);

// PUT /api/mitglieder/:id - Update Mitglied (Admin or Dernek only)
router.put('/:id', requireRoles('Admin', 'Dernek'), update);

// DELETE /api/mitglieder/:id - Delete Mitglied (Admin or Dernek only)
router.delete('/:id', requireRoles('Admin', 'Dernek'), remove);

// POST /api/mitglieder/:id/set-active - Set active status (Admin or Dernek only)
router.post('/:id/set-active', requireRoles('Admin', 'Dernek'), setActiveStatus);

export default router;

