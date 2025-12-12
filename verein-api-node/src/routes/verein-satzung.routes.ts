/**
 * VereinSatzung Routes
 * Association Statutes/Bylaws endpoints
 */

import { Router } from 'express';
import multer from 'multer';
import * as vereinSatzungController from '../controllers/verein-satzung.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/verein/:vereinId', vereinSatzungController.getByVereinId);
router.get('/verein/:vereinId/active', vereinSatzungController.getActiveByVereinId);
router.get('/:id', vereinSatzungController.getById);
router.get('/:id/download', vereinSatzungController.download);

// Protected routes (Admin or Verein)
router.post('/upload/:vereinId', requireRoles('Admin', 'Dernek'), upload.single('file'), vereinSatzungController.upload);
router.put('/:id', requireRoles('Admin', 'Dernek'), vereinSatzungController.update);
router.post('/:id/set-active', requireRoles('Admin', 'Dernek'), vereinSatzungController.setActive);
router.delete('/:id', requireRoles('Admin', 'Dernek'), vereinSatzungController.remove);

export default router;

