/**
 * Finanz Module Types
 * Types for financial management (payments, claims, bank transactions)
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum ZahlungStatus {
  BEZAHLT = 1,
  OFFEN = 2,
}

export enum ZahlungTyp {
  MITGLIEDSBEITRAG = 1,
}

// ============================================================================
// BANKKONTO (Bank Account)
// ============================================================================

export interface BankkontoDto {
  id: number;
  vereinId: number;
  kontotypId?: number;
  iban: string;
  bic?: string;
  kontoinhaber?: string;
  bankname?: string;
  kontoNr?: string;
  blz?: string;
  beschreibung?: string;
  gueltigVon?: string; // ISO date string
  gueltigBis?: string; // ISO date string
  istStandard?: boolean;
  aktiv?: boolean;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
  deletedFlag?: boolean;
}

export interface CreateBankkontoDto {
  vereinId: number;
  kontotypId?: number;
  iban: string;
  bic?: string;
  kontoinhaber?: string;
  bankname?: string;
  kontoNr?: string;
  blz?: string;
  beschreibung?: string;
  gueltigVon?: Date;
  gueltigBis?: Date;
  istStandard?: boolean;
  aktiv?: boolean;
}

export interface UpdateBankkontoDto {
  vereinId: number;
  kontotypId?: number;
  iban: string;
  bic?: string;
  kontoinhaber?: string;
  bankname?: string;
  kontoNr?: string;
  blz?: string;
  beschreibung?: string;
  gueltigVon?: Date;
  gueltigBis?: Date;
  istStandard?: boolean;
  aktiv?: boolean;
}

// ============================================================================
// BANK BUCHUNG (Bank Transaction)
// ============================================================================

export interface BankBuchungDto {
  id: number;
  vereinId: number;
  bankKontoId: number;
  buchungsdatum: string; // ISO date string
  betrag: number;
  waehrungId: number;
  empfaenger?: string;
  verwendungszweck?: string;
  referenz?: string;
  statusId: number;
  angelegtAm?: string;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
}

export interface CreateBankBuchungDto {
  vereinId: number;
  bankKontoId: number;
  buchungsdatum: string;
  betrag: number;
  waehrungId: number;
  empfaenger?: string;
  verwendungszweck?: string;
  referenz?: string;
  statusId: number;
  angelegtAm?: string;
}

export interface UpdateBankBuchungDto {
  buchungsdatum?: string;
  betrag?: number;
  empfaenger?: string;
  verwendungszweck?: string;
  referenz?: string;
  statusId?: number;
}

// ============================================================================
// MITGLIED FORDERUNG (Member Claim/Invoice)
// ============================================================================

export interface MitgliedForderungDto {
  id: number;
  vereinId: number;
  mitgliedId: number;
  zahlungTypId: number;
  forderungsnummer?: string;
  betrag: number;
  waehrungId: number;
  jahr?: number;
  quartal?: number;
  monat?: number;
  faelligkeit: string; // ISO date string
  beschreibung?: string;
  statusId: number;
  bezahltAm?: string;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
}

export interface CreateMitgliedForderungDto {
  vereinId: number;
  mitgliedId: number;
  zahlungTypId: number;
  forderungsartId?: number;
  forderungsnummer?: string;
  betrag: number;
  waehrungId: number;
  jahr?: number;
  quartal?: number;
  monat?: number;
  faelligkeit: string;
  beschreibung?: string;
  statusId: number;
  forderungsstatusId?: number;
  bezahltAm?: string;
}

export interface UpdateMitgliedForderungDto {
  betrag?: number;
  faelligkeit?: string;
  beschreibung?: string;
  statusId?: number;
  forderungsstatusId?: number;
  bezahltAm?: string;
}

// ============================================================================
// MITGLIED ZAHLUNG (Member Payment)
// ============================================================================

export interface MitgliedZahlungDto {
  id: number;
  vereinId: number;
  mitgliedId: number;
  forderungId?: number;
  zahlungTypId: number;
  betrag: number;
  waehrungId: number;
  zahlungsdatum: string; // ISO date string
  zahlungsweg?: string;
  bankkontoId?: number;
  referenz?: string;
  bemerkung?: string;
  statusId: number;
  bankBuchungId?: number;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
}

export interface CreateMitgliedZahlungDto {
  vereinId: number;
  mitgliedId: number;
  forderungId?: number;
  zahlungTypId: number;
  betrag: number;
  waehrungId: number;
  zahlungsdatum: string;
  zahlungsweg?: string;
  bankkontoId?: number;
  referenz?: string;
  bemerkung?: string;
  statusId: number;
  bankBuchungId?: number;
}

export interface UpdateMitgliedZahlungDto {
  betrag?: number;
  zahlungsdatum?: string;
  zahlungsweg?: string;
  bankkontoId?: number;
  referenz?: string;
  bemerkung?: string;
  statusId?: number;
}

// ============================================================================
// MITGLIED FORDERUNG ZAHLUNG (Payment-to-Claim Allocation)
// ============================================================================

export interface MitgliedForderungZahlungDto {
  id: number;
  forderungId: number;
  zahlungId: number;
  betrag: number;
  created?: string;
  createdBy?: number;
}

export interface CreateMitgliedForderungZahlungDto {
  forderungId: number;
  zahlungId: number;
  betrag: number;
}

// ============================================================================
// MITGLIED VORAUSZAHLUNG (Advance Payment)
// ============================================================================

export interface MitgliedVorauszahlungDto {
  id: number;
  vereinId: number;
  mitgliedId: number;
  zahlungId: number;
  betrag: number;
  waehrungId?: number;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
}

export interface CreateMitgliedVorauszahlungDto {
  vereinId: number;
  mitgliedId: number;
  zahlungId: number;
  betrag: number;
  waehrungId?: number;
}

// ============================================================================
// VERANSTALTUNG ZAHLUNG (Event Payment)
// ============================================================================

export interface VeranstaltungZahlungDto {
  id: number;
  veranstaltungId: number;
  anmeldungId: number;
  name?: string;
  email?: string;
  betrag: number;
  waehrungId: number;
  zahlungsdatum: string; // ISO date string
  zahlungsweg?: string;
  referenz?: string;
  statusId: number;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
}

export interface CreateVeranstaltungZahlungDto {
  veranstaltungId: number;
  anmeldungId: number;
  name?: string;
  email?: string;
  betrag: number;
  waehrungId: number;
  zahlungsdatum: string;
  zahlungsweg?: string;
  referenz?: string;
  statusId: number;
}

export interface UpdateVeranstaltungZahlungDto {
  betrag?: number;
  zahlungsdatum?: string;
  zahlungsweg?: string;
  referenz?: string;
  statusId?: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface FinanzSearchParams {
  pageNumber?: number;
  pageSize?: number;
  vereinId?: number;
  mitgliedId?: number;
  statusId?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface FinanzStats {
  totalForderungen: number;
  totalZahlungen: number;
  openForderungen: number;
  overdueForderungen: number;
  totalBetrag: number;
  bezahltBetrag: number;
}

