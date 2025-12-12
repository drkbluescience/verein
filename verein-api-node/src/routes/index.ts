import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import vereinRoutes from './verein.routes';
import mitgliedRoutes from './mitglied.routes';
import keytableRoutes from './keytable.routes';
import forderungRoutes from './forderung.routes';
import zahlungRoutes from './zahlung.routes';
import finanzDashboardRoutes from './finanz-dashboard.routes';
import briefVorlageRoutes from './brief-vorlage.routes';
import briefRoutes from './brief.routes';
import nachrichtRoutes from './nachricht.routes';
import vereinSatzungRoutes from './verein-satzung.routes';
import veranstaltungRoutes from './veranstaltung.routes';
import veranstaltungAnmeldungRoutes from './veranstaltung-anmeldung.routes';
import mitgliedAdresseRoutes from './mitglied-adresse.routes';
import mitgliedFamilieRoutes from './mitglied-familie.routes';
import bankkontoRoutes from './bankkonto.routes';
import bankBuchungRoutes from './bank-buchung.routes';
import veranstaltungBildRoutes from './veranstaltung-bild.routes';
import pageNoteRoutes from './page-note.routes';
import adresseRoutes from './adresse.routes';
import veranstaltungZahlungRoutes from './veranstaltung-zahlung.routes';
import ditibZahlungRoutes from './ditib-zahlung.routes';
import rechtlicheDatenRoutes from './rechtliche-daten.routes';

const router = Router();

// Health routes
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// Core routes
router.use('/vereine', vereinRoutes);
router.use('/mitglieder', mitgliedRoutes);
router.use('/keytable', keytableRoutes);

// Finanz routes
router.use('/mitgliedforderungen', forderungRoutes);
router.use('/mitgliedzahlungen', zahlungRoutes);
router.use('/finanzdashboard', finanzDashboardRoutes);

// Brief routes
router.use('/briefvorlagen', briefVorlageRoutes);
router.use('/briefe', briefRoutes);
router.use('/nachrichten', nachrichtRoutes);

// Dokument routes
router.use('/vereinsatzung', vereinSatzungRoutes);
router.use('/veranstaltungen', veranstaltungRoutes);
router.use('/veranstaltunganmeldungen', veranstaltungAnmeldungRoutes);

// Mitglied Extra routes
router.use('/mitgliedadressen', mitgliedAdresseRoutes);
router.use('/mitgliedfamilien', mitgliedFamilieRoutes);

// Bank routes
router.use('/bankkonten', bankkontoRoutes);
router.use('/bankbuchungen', bankBuchungRoutes);

// Image & Note routes
router.use('/veranstaltungbilder', veranstaltungBildRoutes);
router.use('/pagenotes', pageNoteRoutes);

// Extra routes
router.use('/adressen', adresseRoutes);
router.use('/veranstaltungzahlungen', veranstaltungZahlungRoutes);
router.use('/vereinditibzahlungen', ditibZahlungRoutes);
router.use('/rechtlichedaten', rechtlicheDatenRoutes);

export default router;

