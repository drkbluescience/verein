/**
 * VeranstaltungAnmeldung Routes
 * Event Registration endpoints
 */

import { Router } from 'express';
import * as anmeldungController from '../controllers/veranstaltung-anmeldung.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/veranstaltung/:veranstaltungId/count', anmeldungController.getParticipantCount);

// Protected routes
router.use(authenticate);

router.get('/', requireRoles('Admin', 'Dernek'), anmeldungController.getAll);
router.get('/:id', anmeldungController.getById);
router.get('/veranstaltung/:veranstaltungId', requireRoles('Admin', 'Dernek'), anmeldungController.getByVeranstaltungId);
router.get('/mitglied/:mitgliedId', anmeldungController.getByMitgliedId);

router.post('/', anmeldungController.create);
router.put('/:id', requireRoles('Admin', 'Dernek'), anmeldungController.update);
router.delete('/:id', requireRoles('Admin', 'Dernek'), anmeldungController.remove);

export default router;

