// Mitglied Types - Based on backend DTOs

export interface MitgliedDto {
  id: number;
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
  austrittsdatum?: string;
  bemerkung?: string;
  beitragBetrag?: number;
  beitragWaehrungId?: number;
  beitragPeriodeCode?: string;
  beitragZahlungsTag?: number;
  beitragZahlungstagTypCode?: string;
  beitragIstPflicht?: boolean;
  aktiv?: boolean;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

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
  aktiv?: boolean;
}

export interface UpdateMitgliedDto {
  // Required fields (must match backend)
  id: number;
  vereinId: number;
  mitgliedsnummer: string;
  mitgliedStatusId: number;
  mitgliedTypId: number;
  vorname: string;
  nachname: string;

  // Optional fields
  geschlechtId?: number;
  geburtsdatum?: string;
  geburtsort?: string;
  staatsangehoerigkeitId?: number;
  email?: string;
  telefon?: string;
  mobiltelefon?: string;
  eintrittsdatum?: string;
  austrittsdatum?: string;
  bemerkung?: string;
  beitragBetrag?: number;
  beitragWaehrungId?: number;
  beitragPeriodeCode?: string;
  beitragZahlungsTag?: number;
  beitragZahlungstagTypCode?: string;
  beitragIstPflicht?: boolean;
  aktiv?: boolean;
}

// MitgliedAdresse Types
export interface MitgliedAdresseDto {
  id: number;
  mitgliedId: number;
  adresseTypId: number;
  strasse?: string;
  hausnummer?: string;
  adresszusatz?: string;
  plz?: string;
  ort?: string;
  land?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv?: boolean;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateMitgliedAdresseDto {
  mitgliedId: number;
  adresseTypId: number;
  strasse?: string;
  hausnummer?: string;
  adresszusatz?: string;
  plz?: string;
  ort?: string;
  land?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
  aktiv?: boolean;
}

// MitgliedFamilie Types
export interface MitgliedFamilieDto {
  id: number;
  vereinId: number;
  mitgliedId: number;
  parentMitgliedId: number;
  familienbeziehungTypId: number;
  mitgliedFamilieStatusId: number;
  gueltigVon?: string;
  gueltigBis?: string;
  hinweis?: string;
  aktiv?: boolean;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateMitgliedFamilieDto {
  vereinId: number;
  mitgliedId: number;
  parentMitgliedId: number;
  familienbeziehungTypId: number;
  mitgliedFamilieStatusId?: number;
  gueltigVon?: string;
  gueltigBis?: string;
  hinweis?: string;
  aktiv?: boolean;
}

// Request Models
export interface CreateMitgliedWithAddressRequest {
  mitglied: CreateMitgliedDto;
  adresse: CreateMitgliedAdresseDto;
}

export interface TransferMitgliedRequest {
  newVereinId: number;
  transferDate?: string;
}

export interface SetActiveStatusRequest {
  isActive: boolean;
}

// Response Models
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Utility Types
export interface MitgliedSearchParams {
  pageNumber?: number;
  pageSize?: number;
  vereinId?: number;
  activeOnly?: boolean;
  searchTerm?: string;
}

export interface MitgliedStats {
  totalMitglieder: number;
  activeMitglieder: number;
  inactiveMitglieder: number;
  newThisMonth: number;
  averageAge?: number;
}

// Display Types for UI
export interface MitgliedDisplayInfo {
  id: number;
  fullName: string;
  mitgliedsnummer: string;
  email?: string;
  telefon?: string;
  status: string;
  joinDate?: string;
  age?: number;
  isActive: boolean;
}
