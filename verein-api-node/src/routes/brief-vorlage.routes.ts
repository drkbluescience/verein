/**
 * BriefVorlage Routes
 * Letter Templates endpoints
 */

import { Router } from 'express';
import * as briefVorlageController from '../controllers/brief-vorlage.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/verein/:vereinId', briefVorlageController.getByVereinId);
router.get('/verein/:vereinId/active', briefVorlageController.getActiveByVereinId);
router.get('/verein/:vereinId/categories', briefVorlageController.getCategories);
router.get('/verein/:vereinId/category/:kategorie', briefVorlageController.getByCategory);
router.get('/:id', briefVorlageController.getById);

// Protected routes (Admin or Verein)
router.post('/', requireRoles('Admin', 'Dernek'), briefVorlageController.create);
router.put('/:id', requireRoles('Admin', 'Dernek'), briefVorlageController.update);
router.delete('/:id', requireRoles('Admin', 'Dernek'), briefVorlageController.remove);

export default router;

