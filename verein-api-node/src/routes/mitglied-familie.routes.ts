/**
 * MitgliedFamilie Routes
 * Member Family Relationships endpoints
 */

import { Router } from 'express';
import * as familieController from '../controllers/mitglied-familie.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', familieController.getAll);
router.get('/:id', familieController.getById);
router.get('/mitglied/:mitgliedId', familieController.getByMitgliedId);
router.get('/mitglied/:parentMitgliedId/children', familieController.getChildren);

router.post('/', familieController.create);
router.put('/:id', familieController.update);
router.delete('/:id', familieController.remove);

export default router;

