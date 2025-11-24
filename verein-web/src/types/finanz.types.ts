/**
 * Finanz Module Types
 * Types for financial management (payments, claims, bank transactions)
 */

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

export interface FinanzDashboardStatsDto {
  gelir: GelirStatsDto;
  gider: GiderStatsDto;
  vereinComparison?: VereinComparisonDto[];
}

export interface GelirStatsDto {
  totalForderungen: number;
  bezahlteForderungen: number;
  offeneForderungen: number;
  ueberfaelligeForderungen: number;
  totalAmount: number;
  bezahltAmount: number;
  offenAmount: number;
  ueberfaelligAmount: number;
  collectionRate: number;
  expectedRevenue: number;
  arpu: number;
  avgPaymentDays: number;
  activeMitglieder: number;
  totalZahlungen: number;
  totalZahlungenAmount: number;
  monthlyTrend: MonthlyTrendDto[];
  paymentMethods: PaymentMethodDto[];
}

export interface GiderStatsDto {
  totalDitibZahlungen: number;
  bezahlteDitibZahlungen: number;
  offeneDitibZahlungen: number;
  totalAmount: number;
  bezahltAmount: number;
  offenAmount: number;
  currentMonthAmount: number;
  monthlyTrend: MonthlyTrendDto[];
}

export interface MonthlyTrendDto {
  month: number;
  year: number;
  monthName: string;
  amount: number;
  count: number;
}

export interface PaymentMethodDto {
  method: string;
  count: number;
  amount: number;
}

export interface VereinComparisonDto {
  vereinId: number;
  vereinName: string;
  revenue: number;
  expenses: number;
  collectionRate: number;
  memberCount: number;
}

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
// BANK UPLOAD (Excel Upload)
// ============================================================================

export interface BankUploadRequestDto {
  vereinId: number;
  bankKontoId: number;
  file: File;
}

export interface BankUploadResponseDto {
  success: boolean;
  message: string;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  unmatchedCount: number;
  details: BankUploadDetailDto[];
  unmatchedTransactions: BankUploadDetailDto[];
  errors: string[];
}

export interface BankUploadDetailDto {
  rowNumber: number;
  buchungsdatum?: string;
  betrag?: number;
  empfaenger?: string;
  verwendungszweck?: string;
  referenz?: string;
  status: 'Success' | 'Failed' | 'Skipped' | 'Unmatched';
  message: string;
  mitgliedId?: number;
  mitgliedName?: string;
  bankBuchungId?: number;
  mitgliedZahlungId?: number;
}

// ============================================================================
// DITIB UPLOAD
// ============================================================================

export interface DitibUploadResponseDto {
  success: boolean;
  message: string;
  totalRows: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  details: DitibUploadDetailDto[];
  errors: string[];
}

export interface DitibUploadDetailDto {
  rowNumber: number;
  zahlungsdatum?: string;
  betrag?: number;
  zahlungsperiode?: string;
  referenz?: string;
  status: 'Success' | 'Failed' | 'Skipped';
  message: string;
  bankBuchungId?: number;
  vereinDitibZahlungId?: number;
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

export interface MitgliedFinanzSummaryDto {
  currentBalance: number;
  totalPaid: number;
  totalOverdue: number;
  overdueCount: number;
  nextPayment: MitgliedForderungDto | null;
  daysUntilNextPayment: number;
  last12MonthsTrend: MonthlyTrendDto[];
  unpaidClaims: MitgliedForderungDto[];
  paidClaims: MitgliedForderungDto[];
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

// ============================================================================
// VEREIN DITIB ZAHLUNG (Association DITIB Payment)
// ============================================================================

export interface VereinDitibZahlungDto {
  id: number;
  vereinId: number;
  betrag: number;
  waehrungId: number;
  zahlungsdatum: string; // ISO date string
  zahlungsperiode: string; // e.g., "2024-11"
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
  deletedFlag?: boolean;
  aktiv?: boolean;
}

export interface CreateVereinDitibZahlungDto {
  vereinId: number;
  betrag: number;
  waehrungId: number;
  zahlungsdatum: string; // ISO date string
  zahlungsperiode: string; // e.g., "2024-11"
  zahlungsweg?: string;
  bankkontoId?: number;
  referenz?: string;
  bemerkung?: string;
  statusId: number;
  bankBuchungId?: number;
}

export interface UpdateVereinDitibZahlungDto {
  betrag?: number;
  waehrungId?: number;
  zahlungsdatum?: string;
  zahlungsperiode?: string;
  zahlungsweg?: string;
  bankkontoId?: number;
  referenz?: string;
  bemerkung?: string;
  statusId?: number;
  bankBuchungId?: number;
}

