/**
 * Veranstaltung Routes
 * Event endpoints
 */

import { Router } from 'express';
import * as veranstaltungController from '../controllers/veranstaltung.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required for viewing events)
router.get('/', veranstaltungController.getAll);
router.get('/upcoming', veranstaltungController.getUpcoming);
router.get('/date-range', veranstaltungController.getByDateRange);
router.get('/verein/:vereinId', veranstaltungController.getByVereinId);
router.get('/:id', veranstaltungController.getById);

// Protected routes (Admin or Verein)
router.post('/', authenticate, requireRoles('Admin', 'Dernek'), veranstaltungController.create);
router.put('/:id', authenticate, requireRoles('Admin', 'Dernek'), veranstaltungController.update);
router.delete('/:id', authenticate, requireRoles('Admin', 'Dernek'), veranstaltungController.remove);

export default router;

