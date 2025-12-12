/**
 * Adresse Routes
 * /api/adressen
 */

import { Router } from 'express';
import * as controller from '../controllers/adresse.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/verein/:vereinId', controller.getByVereinId);

// Admin/Dernek routes
router.post('/', requireRoles('admin', 'dernek'), controller.create);
router.put('/:id', requireRoles('admin', 'dernek'), controller.update);
router.patch('/:id/set-default', controller.setAsDefault);
router.delete('/:id', requireRoles('admin', 'dernek'), controller.remove);

export default router;

