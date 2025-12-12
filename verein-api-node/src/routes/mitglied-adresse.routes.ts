/**
 * MitgliedAdresse Routes
 * Member Address endpoints
 */

import { Router } from 'express';
import * as adresseController from '../controllers/mitglied-adresse.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', adresseController.getAll);
router.get('/:id', adresseController.getById);
router.get('/mitglied/:mitgliedId', adresseController.getByMitgliedId);
router.get('/mitglied/:mitgliedId/standard', adresseController.getStandardAddress);

router.post('/', adresseController.create);
router.put('/:id', adresseController.update);
router.post('/:mitgliedId/address/:addressId/set-standard', adresseController.setAsStandard);
router.delete('/:id', adresseController.remove);

export default router;

