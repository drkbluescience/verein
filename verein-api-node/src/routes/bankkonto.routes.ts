/**
 * Bankkonto Routes
 * Bank Account endpoints
 */

import { Router } from 'express';
import * as bankkontoController from '../controllers/bankkonto.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', bankkontoController.getAll);
router.get('/:id', bankkontoController.getById);
router.get('/verein/:vereinId', bankkontoController.getByVereinId);
router.get('/iban/:iban', bankkontoController.getByIban);

router.post('/', requireRoles('Admin', 'Dernek'), bankkontoController.create);
router.post('/validate-iban', bankkontoController.validateIban);
router.put('/:id', requireRoles('Admin', 'Dernek'), bankkontoController.update);
router.patch('/:id/set-default', requireRoles('Admin', 'Dernek'), bankkontoController.setAsDefault);
router.delete('/:id', requireRoles('Admin', 'Dernek'), bankkontoController.remove);

export default router;

