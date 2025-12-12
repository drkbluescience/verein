/**
 * Keytable Routes
 */

import { Router } from 'express';
import {
  getGeschlechter,
  getMitgliedStatuse,
  getMitgliedTypen,
  getFamilienbeziehungTypen,
  getZahlungTypen,
  getZahlungStatuse,
  getForderungsarten,
  getForderungsstatuse,
  getWaehrungen,
  getRechtsformen,
  getAdresseTypen,
  getKontotypen,
  getMitgliedFamilieStatuse,
  getStaatsangehoerigkeiten,
  getBeitragPerioden,
  getBeitragZahlungstagTypen,
  getAllKeytables,
} from '../controllers/keytable.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/keytable/all - Get all keytables at once
router.get('/all', getAllKeytables);

// Individual keytable endpoints
router.get('/geschlechter', getGeschlechter);
router.get('/mitgliedstatuse', getMitgliedStatuse);
router.get('/mitgliedtypen', getMitgliedTypen);
router.get('/familienbeziehungtypen', getFamilienbeziehungTypen);
router.get('/zahlungtypen', getZahlungTypen);
router.get('/zahlungstatuse', getZahlungStatuse);
router.get('/forderungsarten', getForderungsarten);
router.get('/forderungsstatuse', getForderungsstatuse);
router.get('/waehrungen', getWaehrungen);
router.get('/rechtsformen', getRechtsformen);
router.get('/adressetypen', getAdresseTypen);
router.get('/kontotypen', getKontotypen);
router.get('/mitgliedfamiliestatuse', getMitgliedFamilieStatuse);
router.get('/staatsangehoerigkeiten', getStaatsangehoerigkeiten);
router.get('/beitragperioden', getBeitragPerioden);
router.get('/beitragzahlungstagtypen', getBeitragZahlungstagTypen);

export default router;

