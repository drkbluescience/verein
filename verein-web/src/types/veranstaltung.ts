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
  anmeldeschluss?: string;
  kosten?: number;
  waehrungId?: number;
  istOeffentlich?: boolean;
  istAnmeldungErforderlich?: boolean;
  veranstaltungsTypId?: number;
  veranstaltungsStatusId?: number;
  organisatorId?: number;
  hinweise?: string;
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
  anmeldeschluss?: string;
  kosten?: number;
  waehrungId?: number;
  istOeffentlich?: boolean;
  istAnmeldungErforderlich?: boolean;
  veranstaltungsTypId?: number;
  veranstaltungsStatusId?: number;
  organisatorId?: number;
  hinweise?: string;
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
  anmeldeschluss?: string;
  kosten?: number;
  waehrungId?: number;
  istOeffentlich?: boolean;
  istAnmeldungErforderlich?: boolean;
  veranstaltungsTypId?: number;
  veranstaltungsStatusId?: number;
  organisatorId?: number;
  hinweise?: string;
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
  anmeldedatum?: string;
  anmeldungsStatusId?: number;
  teilnehmerAnzahl?: number;
  bemerkung?: string;
  stornierungsdatum?: string;
  stornierungsgrund?: string;
  aktiv?: boolean;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateVeranstaltungAnmeldungDto {
  veranstaltungId: number;
  mitgliedId?: number;
  name?: string;
  email?: string;
  telefon?: string;
  anmeldedatum?: string;
  anmeldungsStatusId?: number;
  teilnehmerAnzahl?: number;
  bemerkung?: string;
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
