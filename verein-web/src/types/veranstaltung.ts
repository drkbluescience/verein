// Veranstaltung Types - Based on backend DTOs

// Utility Types from mitglied.ts
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface VeranstaltungDto {
  id: number;
  vereinId: number;
  titel: string;
  beschreibung?: string;
  startdatum: string;
  enddatum?: string;
  ort?: string;
  maxTeilnehmer?: number;
  preis?: number;
  waehrungId?: number;
  nurFuerMitglieder?: boolean;  // true = Sadece üyeler, false = Herkese açık
  anmeldeErforderlich?: boolean;  // Kayıt gerekli mi?
  aktiv?: boolean;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateVeranstaltungDto {
  vereinId: number;
  titel: string;
  beschreibung?: string;
  startdatum: string;
  enddatum?: string;
  ort?: string;
  maxTeilnehmer?: number;
  preis?: number;
  waehrungId?: number;
  nurFuerMitglieder?: boolean;  // true = Sadece üyeler, false = Herkese açık
  anmeldeErforderlich?: boolean;  // Kayıt gerekli mi?
  aktiv?: boolean;
}

export interface UpdateVeranstaltungDto {
  vereinId?: number;
  titel?: string;
  beschreibung?: string;
  startdatum?: string;
  enddatum?: string;
  ort?: string;
  maxTeilnehmer?: number;
  preis?: number;
  waehrungId?: number;
  nurFuerMitglieder?: boolean;  // true = Sadece üyeler, false = Herkese açık
  anmeldeErforderlich?: boolean;  // Kayıt gerekli mi?
  aktiv?: boolean;
}

// VeranstaltungAnmeldung Types
export interface VeranstaltungAnmeldungDto {
  id: number;
  veranstaltungId: number;
  mitgliedId?: number;
  name?: string;
  email?: string;
  telefon?: string;
  status?: string;
  bemerkung?: string;
  preis?: number;
  waehrungId?: number;
  zahlungStatusId?: number;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
  deletedFlag?: boolean;
}

export interface CreateVeranstaltungAnmeldungDto {
  veranstaltungId: number;
  mitgliedId?: number;
  name?: string;
  email?: string;
  telefon?: string;
  bemerkung?: string;
  preis?: number;
  waehrungId?: number;
  zahlungStatusId?: number;
  status?: string;
}

export interface UpdateVeranstaltungAnmeldungDto {
  mitgliedId?: number;
  name?: string;
  email?: string;
  telefon?: string;
  status?: string;
  bemerkung?: string;
  preis?: number;
  waehrungId?: number;
  zahlungStatusId?: number;
}

// VeranstaltungBild Types
export interface VeranstaltungBildDto {
  id: number;
  veranstaltungId: number;
  bildPfad: string;
  titel?: string;
  beschreibung?: string;
  reihenfolge?: number;
  istHauptbild?: boolean;
  aktiv?: boolean;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateVeranstaltungBildDto {
  veranstaltungId: number;
  bildPfad: string;
  titel?: string;
  beschreibung?: string;
  reihenfolge?: number;
  istHauptbild?: boolean;
  aktiv?: boolean;
}

export interface UpdateVeranstaltungBildDto {
  bildPfad?: string;
  titel?: string;
  beschreibung?: string;
  reihenfolge?: number;
  istHauptbild?: boolean;
  aktiv?: boolean;
}

// Utility Types
export interface VeranstaltungSearchParams {
  pageNumber?: number;
  pageSize?: number;
  vereinId?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface VeranstaltungStats {
  totalVeranstaltungen: number;
  upcomingVeranstaltungen: number;
  pastVeranstaltungen: number;
  totalAnmeldungen: number;
  thisMonthEvents: number;
  averageParticipants?: number;
}

// Display Types for UI
export interface VeranstaltungDisplayInfo {
  id: number;
  titel: string;
  startdatum: string;
  enddatum?: string;
  ort?: string;
  teilnehmerAnzahl?: number;
  maxTeilnehmer?: number;
  isUpcoming: boolean;
  isPast: boolean;
  isToday: boolean;
  daysUntilEvent?: number;
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
}

// Event Status Types
export type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'cancelled';

export interface EventDateInfo {
  isUpcoming: boolean;
  isPast: boolean;
  isToday: boolean;
  isOngoing: boolean;
  daysUntilEvent?: number;
  daysFromEvent?: number;
  duration?: string;
}
