/**
 * VeranstaltungBild Routes
 * /api/veranstaltungbilder
 */

import { Router } from 'express';
import * as controller from '../controllers/veranstaltung-bild.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// Public routes (for registered users viewing event images)
router.get('/veranstaltung/:veranstaltungId', authenticate, controller.getByVeranstaltungId);
router.get('/:id', authenticate, controller.getById);

// Admin/Dernek routes
router.get('/', authenticate, requireRoles('admin', 'dernek'), controller.getAll);
router.post('/upload/:veranstaltungId', authenticate, requireRoles('admin', 'dernek'), controller.upload.single('file'), controller.uploadImage);
router.post('/', authenticate, requireRoles('admin', 'dernek'), controller.create);
router.put('/:id', authenticate, requireRoles('admin', 'dernek'), controller.update);
router.delete('/:id', authenticate, requireRoles('admin', 'dernek'), controller.remove);

export default router;

