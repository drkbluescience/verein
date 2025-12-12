/**
 * Mitglied (Member) Models
 * Maps to Mitglied schema tables in database
 */

import { AuditableEntity } from './base.model';
import { Adresse } from './verein.model';

// MitgliedAdresse - Member Address
export interface MitgliedAdresse extends AuditableEntity {
  mitgliedId: number;
  adresseTypId: number;
  strasse?: string | null;
  hausnummer?: string | null;
  adresszusatz?: string | null;
  plz?: string | null;
  ort?: string | null;
  stadtteil?: string | null;
  bundesland?: string | null;
  land?: string | null;
  postfach?: string | null;
  telefonnummer?: string | null;
  email?: string | null;
  hinweis?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  gueltigVon?: string | null;
  gueltigBis?: string | null;
  istStandard?: boolean | null;
  // Join fields
  adresseTypName?: string;
}

export interface CreateMitgliedAdresseDto {
  mitgliedId: number;
  adresseTypId: number;
  strasse?: string;
  hausnummer?: string;
  adresszusatz?: string;
  plz?: string;
  ort?: string;
  stadtteil?: string;
  bundesland?: string;
  land?: string;
  postfach?: string;
  telefonnummer?: string;
  email?: string;
  hinweis?: string;
  latitude?: number;
  longitude?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
}

export interface UpdateMitgliedAdresseDto {
  adresseTypId?: number;
  strasse?: string;
  hausnummer?: string;
  adresszusatz?: string;
  plz?: string;
  ort?: string;
  stadtteil?: string;
  bundesland?: string;
  land?: string;
  postfach?: string;
  telefonnummer?: string;
  email?: string;
  hinweis?: string;
  latitude?: number;
  longitude?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
}

// MitgliedFamilie - Family relationship entity
export interface MitgliedFamilie extends AuditableEntity {
  vereinId: number;
  mitgliedId: number;
  parentMitgliedId: number;
  familienbeziehungTypId: number;
  mitgliedFamilieStatusId: number;
  gueltigVon?: string | null;
  gueltigBis?: string | null;
  hinweis?: string | null;
  // Join fields
  mitgliedName?: string;
  parentMitgliedName?: string;
  beziehungTypName?: string;
  statusName?: string;
}

export interface CreateMitgliedFamilieDto {
  vereinId: number;
  mitgliedId: number;
  parentMitgliedId: number;
  familienbeziehungTypId: number;
  mitgliedFamilieStatusId: number;
  gueltigVon?: string;
  gueltigBis?: string;
  hinweis?: string;
}

export interface UpdateMitgliedFamilieDto {
  familienbeziehungTypId?: number;
  mitgliedFamilieStatusId?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  hinweis?: string;
}

// Mitglied - Main member entity
export interface Mitglied extends AuditableEntity {
  vereinId: number;
  mitgliedsnummer: string;
  mitgliedStatusId: number;
  mitgliedTypId: number;
  vorname: string;
  nachname: string;
  geschlechtId?: number | null;
  geburtsdatum?: Date | null;
  geburtsort?: string | null;
  staatsangehoerigkeitId?: number | null;
  email?: string | null;
  telefon?: string | null;
  mobiltelefon?: string | null;
  eintrittsdatum?: Date | null;
  austrittsdatum?: Date | null;
  bemerkung?: string | null;
  beitragBetrag?: number | null;
  beitragWaehrungId?: number | null;
  beitragPeriodeCode?: string | null;
  beitragZahlungsTag?: number | null;
  beitragZahlungstagTypCode?: string | null;
  beitragIstPflicht?: boolean | null;
  
  // Navigation properties (for joined queries)
  mitgliedAdressen?: MitgliedAdresse[];
  mitgliedStatusName?: string;
  mitgliedTypName?: string;
  geschlechtName?: string;
}

// Create DTO
export interface CreateMitgliedDto {
  vereinId: number;
  mitgliedsnummer: string;
  mitgliedStatusId: number;
  mitgliedTypId: number;
  vorname: string;
  nachname: string;
  geschlechtId?: number;
  geburtsdatum?: string;
  geburtsort?: string;
  staatsangehoerigkeitId?: number;
  email?: string;
  telefon?: string;
  mobiltelefon?: string;
  eintrittsdatum?: string;
  bemerkung?: string;
  beitragBetrag?: number;
  beitragWaehrungId?: number;
  beitragPeriodeCode?: string;
  beitragZahlungsTag?: number;
  beitragZahlungstagTypCode?: string;
  beitragIstPflicht?: boolean;
}

// Update DTO
export interface UpdateMitgliedDto extends Partial<CreateMitgliedDto> {
  austrittsdatum?: string;
  aktiv?: boolean;
}

// List response with pagination info
export interface MitgliedListResponse {
  items: Mitglied[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// Search/Filter parameters
export interface MitgliedFilterParams {
  vereinId?: number;
  mitgliedStatusId?: number;
  mitgliedTypId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

