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

