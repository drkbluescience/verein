/**
 * Central export file for all services
 * This file provides a single import point for all API services
 */

// Core API client
export { api, apiClient } from './api';

// Auth Service
export { authService } from './authService';

// Verein Services
export {
  vereinService,
  adresseService,
  bankkontoService,
  healthService
} from './vereinService';

// RechtlicheDaten Service
export { rechtlicheDatenService } from './rechtlicheDatenService';

// Mitglied Services
export { 
  mitgliedService, 
  mitgliedAdresseService, 
  mitgliedFamilieService,
  mitgliedUtils 
} from './mitgliedService';

// Veranstaltung Services
export {
  veranstaltungService,
  veranstaltungAnmeldungService,
  veranstaltungBildService,
  veranstaltungUtils
} from './veranstaltungService';

// Finanz Services
export {
  bankBuchungService,
  mitgliedForderungService,
  mitgliedZahlungService,
  mitgliedForderungZahlungService,
  mitgliedVorauszahlungService,
  veranstaltungZahlungService
} from './finanzService';

// easyFiBu Services
export {
  fiBuKontoService,
  kassenbuchService,
  kassenbuchJahresabschlussService,
  spendenProtokollService,
  durchlaufendePostenService
} from './easyFiBuService';

// Keytable Services
export { default as keytableService } from './keytableService';

// PageNote Service
export { pageNoteService } from './pageNoteService';

// Organization Service
export { organizationService } from './organizationService';

// Brief (Letter/Message) Services
export { briefVorlageService, briefService } from './briefService';
export { nachrichtService } from './nachrichtService';

// Re-export types for convenience
export type {
  // Verein Types
  VereinDto,
  CreateVereinDto,
  UpdateVereinDto,
  AdresseDto,
  CreateAdresseDto,
  BankkontoDto,
  CreateBankkontoDto
} from '../types/verein';

export type {
  // Organization Types
  OrganizationDto,
  OrganizationCreateDto,
  OrganizationUpdateDto,
  TreeNodeDto,
  PathNodeDto,
  OrganizationType,
  FederationCode
} from '../types/organization';

export type {
  // RechtlicheDaten Types
  RechtlicheDatenDto,
  CreateRechtlicheDatenDto,
  UpdateRechtlicheDatenDto
} from '../types/rechtlicheDaten';

export type {
  // Mitglied Types
  MitgliedDto,
  CreateMitgliedDto,
  UpdateMitgliedDto,
  MitgliedAdresseDto,
  CreateMitgliedAdresseDto,
  MitgliedFamilieDto,
  CreateMitgliedFamilieDto,
  PagedResult,
  MitgliedSearchParams
} from '../types/mitglied';

export type {
  // Veranstaltung Types
  VeranstaltungDto,
  CreateVeranstaltungDto,
  UpdateVeranstaltungDto,
  VeranstaltungAnmeldungDto,
  CreateVeranstaltungAnmeldungDto,
  UpdateVeranstaltungAnmeldungDto,
  VeranstaltungBildDto,
  CreateVeranstaltungBildDto,
  UpdateVeranstaltungBildDto,
  VeranstaltungSearchParams,
  EventStatus
} from '../types/veranstaltung';

export type {
  // Finanz Types
  BankBuchungDto,
  CreateBankBuchungDto,
  UpdateBankBuchungDto,
  MitgliedForderungDto,
  CreateMitgliedForderungDto,
  UpdateMitgliedForderungDto,
  MitgliedZahlungDto,
  CreateMitgliedZahlungDto,
  UpdateMitgliedZahlungDto,
  MitgliedForderungZahlungDto,
  CreateMitgliedForderungZahlungDto,
  MitgliedVorauszahlungDto,
  CreateMitgliedVorauszahlungDto,
  VeranstaltungZahlungDto,
  CreateVeranstaltungZahlungDto,
  UpdateVeranstaltungZahlungDto,
  FinanzSearchParams,
  FinanzStats,
  ZahlungStatus,
  ZahlungTyp
} from '../types/finanz.types';

export type {
  // easyFiBu Types
  FiBuKontoDto,
  CreateFiBuKontoDto,
  UpdateFiBuKontoDto,
  KassenbuchDto,
  CreateKassenbuchDto,
  UpdateKassenbuchDto,
  KassenbuchKontoSummaryDto,
  KassenbuchSummaryDto,
  KassenbuchJahresabschlussDto,
  CreateKassenbuchJahresabschlussDto,
  UpdateKassenbuchJahresabschlussDto,
  SpendenProtokollDto,
  CreateSpendenProtokollDto,
  UpdateSpendenProtokollDto,
  SpendenProtokollDetailDto,
  CreateSpendenProtokollDetailDto,
  SpendenKategorieSummaryDto,
  DurchlaufendePostenDto,
  CreateDurchlaufendePostenDto,
  UpdateDurchlaufendePostenDto,
  DurchlaufendePostenSummaryDto
} from '../types/easyFiBu.types';

export type {
  // PageNote Types
  PageNoteDto,
  CreatePageNoteDto,
  UpdatePageNoteDto,
  CompletePageNoteDto,
  PageNoteStatisticsDto,
  PageNoteStatus,
  PageNoteCategory,
  PageNotePriority,
  PageNoteFormData,
  PageNoteFilters
} from '../types/pageNote.types';

export type {
  // Brief Types
  BriefVorlageDto,
  CreateBriefVorlageDto,
  UpdateBriefVorlageDto,
  BriefDto,
  CreateBriefDto,
  UpdateBriefDto,
  SendBriefDto,
  QuickSendBriefDto,
  NachrichtDto,
  BriefStatisticsDto,
  UnreadCountDto,
  BriefStatus,
  BriefVorlageKategorie,
  BriefFormData,
  BriefFilters,
  NachrichtFilters
} from '../types/brief.types';

/**
 * Usage Examples:
 * 
 * // Import specific services
 * import { vereinService, mitgliedService } from './services';
 * 
 * // Import all services
 * import * as services from './services';
 * 
 * // Use services
 * const vereine = await vereinService.getAll();
 * const mitglieder = await mitgliedService.getAll();
 * 
 * // Use with types
 * import { vereinService, type VereinDto } from './services';
 * const verein: VereinDto = await vereinService.getById(1);
 */
