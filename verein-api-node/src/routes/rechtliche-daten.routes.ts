/**
 * RechtlicheDaten Routes
 * /api/rechtlichedaten
 */

import { Router } from 'express';
import * as controller from '../controllers/rechtliche-daten.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes (Admin/Dernek)
router.get('/:id', requireRoles('admin', 'dernek'), controller.getById);
router.get('/verein/:vereinId', requireRoles('admin', 'dernek'), controller.getByVereinId);

// Admin/Dernek routes
router.post('/', requireRoles('admin', 'dernek'), controller.create);
router.put('/:id', requireRoles('admin', 'dernek'), controller.update);

// Admin only
router.delete('/:id', requireRoles('admin'), controller.remove);

export default router;

