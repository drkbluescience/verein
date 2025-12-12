/**
 * Brief Routes
 * Letter Drafts endpoints
 */

import { Router } from 'express';
import * as briefController from '../controllers/brief.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/verein/:vereinId', briefController.getByVereinId);
router.get('/verein/:vereinId/drafts', briefController.getDraftsByVereinId);
router.get('/verein/:vereinId/sent', briefController.getSentByVereinId);
router.get('/verein/:vereinId/statistics', briefController.getStatistics);
router.get('/:id', briefController.getById);

// Protected routes (Admin or Verein)
router.post('/', requireRoles('Admin', 'Dernek'), briefController.create);
router.post('/quick-send', requireRoles('Admin', 'Dernek'), briefController.quickSend);
router.post('/:id/send', requireRoles('Admin', 'Dernek'), briefController.send);
router.put('/:id', requireRoles('Admin', 'Dernek'), briefController.update);
router.delete('/:id', requireRoles('Admin', 'Dernek'), briefController.remove);

export default router;

