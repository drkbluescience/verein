/**
 * VeranstaltungZahlung Routes
 * /api/veranstaltungzahlungen
 */

import { Router } from 'express';
import * as controller from '../controllers/veranstaltung-zahlung.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/veranstaltung/:veranstaltungId', controller.getByVeranstaltungId);
router.get('/veranstaltung/:veranstaltungId/total', controller.getTotalByVeranstaltungId);
router.get('/mitglied/:mitgliedId', controller.getByMitgliedId);

// Admin/Dernek routes
router.post('/', requireRoles('admin', 'dernek'), controller.create);
router.delete('/:id', requireRoles('admin', 'dernek'), controller.remove);

export default router;

