/**
 * BankBuchung Routes
 * Bank Transaction endpoints
 */

import { Router } from 'express';
import * as bankBuchungController from '../controllers/bank-buchung.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', bankBuchungController.getAll);
router.get('/date-range', bankBuchungController.getByDateRange);
router.get('/:id', bankBuchungController.getById);
router.get('/verein/:vereinId', bankBuchungController.getByVereinId);
router.get('/bankkonto/:bankKontoId', bankBuchungController.getByBankKontoId);
router.get('/bankkonto/:bankKontoId/total', bankBuchungController.getTotalAmount);

router.post('/', requireRoles('Admin', 'Dernek'), bankBuchungController.create);
router.delete('/:id', requireRoles('Admin', 'Dernek'), bankBuchungController.remove);

export default router;

