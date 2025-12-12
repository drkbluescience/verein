/**
 * PageNote Routes
 * /api/pagenotes
 */

import { Router } from 'express';
import * as controller from '../controllers/page-note.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/my-notes', controller.getMyNotes);
router.get('/page', controller.getByPageUrl);
router.get('/entity/:entityType/:entityId', controller.getByEntity);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

// Admin only routes
router.get('/', requireRoles('admin'), controller.getAll);
router.get('/status/:status', requireRoles('admin'), controller.getByStatus);
router.get('/statistics', requireRoles('admin'), controller.getStatistics);

// By ID (checks ownership in controller)
router.get('/:id', controller.getById);

export default router;

