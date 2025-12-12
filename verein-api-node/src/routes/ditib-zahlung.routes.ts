/**
 * VereinDitibZahlung Routes
 * /api/vereinditibzahlungen
 */

import { Router } from 'express';
import * as controller from '../controllers/ditib-zahlung.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/', controller.getAll);
router.get('/pending', controller.getPending);
router.get('/periode/:zahlungsperiode', controller.getByPeriode);
router.get('/verein/:vereinId', controller.getByVereinId);
router.get('/:id', controller.getById);

// Admin/Dernek routes
router.post('/', requireRoles('admin', 'dernek'), controller.create);
router.delete('/:id', requireRoles('admin', 'dernek'), controller.remove);

export default router;

