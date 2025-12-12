/**
 * Zahlung Routes
 * Member Payments endpoints
 */

import { Router } from 'express';
import * as zahlungController from '../controllers/zahlung.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/', zahlungController.getAll);
router.get('/date-range', zahlungController.getByDateRange);
router.get('/mitglied/:mitgliedId', zahlungController.getByMitglied);
router.get('/mitglied/:mitgliedId/total', zahlungController.getTotalPayment);
router.get('/verein/:vereinId', zahlungController.getByVerein);
router.get('/:id', zahlungController.getById);

// Protected routes (Admin or Verein)
router.post('/', requireRoles('Admin', 'Dernek'), zahlungController.create);
router.put('/:id', requireRoles('Admin', 'Dernek'), zahlungController.update);
router.delete('/:id', requireRoles('Admin', 'Dernek'), zahlungController.remove);

export default router;

