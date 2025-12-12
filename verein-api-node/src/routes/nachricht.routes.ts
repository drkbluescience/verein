/**
 * Nachricht Routes
 * Sent Messages endpoints (inbox for members)
 */

import { Router } from 'express';
import * as nachrichtController from '../controllers/nachricht.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/mitglied/:mitgliedId', nachrichtController.getByMitgliedId);
router.get('/mitglied/:mitgliedId/unread-count', nachrichtController.getUnreadCount);
router.get('/brief/:briefId', requireRoles('Admin', 'Dernek'), nachrichtController.getByBriefId);
router.get('/:id', nachrichtController.getById);

// POST routes
router.post('/:id/mark-read', nachrichtController.markAsRead);

// DELETE routes
router.delete('/:id', nachrichtController.remove);

export default router;

