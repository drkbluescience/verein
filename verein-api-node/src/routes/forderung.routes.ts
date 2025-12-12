/**
 * Forderung Routes
 * Member Claims/Invoices endpoints
 */

import { Router } from 'express';
import * as forderungController from '../controllers/forderung.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/', forderungController.getAll);
router.get('/unpaid', forderungController.getUnpaid);
router.get('/overdue', forderungController.getOverdue);
router.get('/mitglied/:mitgliedId', forderungController.getByMitglied);
router.get('/mitglied/:mitgliedId/total-unpaid', forderungController.getTotalUnpaid);
router.get('/mitglied/:mitgliedId/summary', forderungController.getMitgliedSummary);
router.get('/verein/:vereinId', forderungController.getByVerein);
router.get('/:id', forderungController.getById);

// Protected routes (Admin or Verein)
router.post('/', requireRoles('Admin', 'Dernek'), forderungController.create);
router.put('/:id', requireRoles('Admin', 'Dernek'), forderungController.update);
router.delete('/:id', requireRoles('Admin', 'Dernek'), forderungController.remove);

export default router;

