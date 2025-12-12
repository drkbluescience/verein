/**
 * Finanz Models
 * MitgliedForderung (Claims) and MitgliedZahlung (Payments)
 */

import { AuditableEntity } from './base.model';

// MitgliedForderung - Member Claims/Invoices
export interface MitgliedForderung extends AuditableEntity {
  vereinId: number;
  mitgliedId: number;
  zahlungTypId: number;
  forderungsnummer?: string | null;
  betrag: number;
  waehrungId: number;
  jahr?: number | null;
  quartal?: number | null;
  monat?: number | null;
  faelligkeit: string;
  beschreibung?: string | null;
  statusId: number;
  bezahltAm?: string | null;
  // Computed/joined fields
  mitgliedName?: string;
  zahlungTypName?: string;
  statusName?: string;
  bezahltBetrag?: number;
  offenerBetrag?: number;
}

// MitgliedZahlung - Member Payments
export interface MitgliedZahlung extends AuditableEntity {
  vereinId: number;
  mitgliedId: number;
  forderungId?: number | null;
  zahlungTypId: number;
  betrag: number;
  waehrungId: number;
  zahlungsdatum: string;
  zahlungsweg?: string | null;
  bankkontoId?: number | null;
  referenz?: string | null;
  bemerkung?: string | null;
  statusId: number;
  bankBuchungId?: number | null;
  // Computed/joined fields
  mitgliedName?: string;
  zahlungTypName?: string;
  statusName?: string;
}

// MitgliedForderungZahlung - Payment Allocations
export interface MitgliedForderungZahlung extends AuditableEntity {
  forderungId: number;
  zahlungId: number;
  betrag: number;
}

// Create DTOs
export interface CreateMitgliedForderungDto {
  vereinId: number;
  mitgliedId: number;
  zahlungTypId: number;
  forderungsnummer?: string;
  betrag: number;
  waehrungId: number;
  jahr?: number;
  quartal?: number;
  monat?: number;
  faelligkeit: string;
  beschreibung?: string;
  statusId: number;
}

export interface UpdateMitgliedForderungDto extends Partial<CreateMitgliedForderungDto> {
  bezahltAm?: string;
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
}

export interface UpdateMitgliedZahlungDto extends Partial<CreateMitgliedZahlungDto> {}

// Finanz Summary DTOs
export interface MitgliedFinanzSummary {
  mitgliedId: number;
  mitgliedName: string;
  totalForderungen: number;
  totalBezahlt: number;
  offenerBetrag: number;
  anzahlOffeneForderungen: number;
  anzahlUeberfaellig: number;
}

export interface FinanzDashboardStats {
  // Current month
  einnahmenAktuellerMonat: number;
  forderungenAktuellerMonat: number;
  // Previous month comparison
  einnahmenVormonat: number;
  forderungenVormonat: number;
  // Year totals
  einnahmenJahr: number;
  forderungenJahr: number;
  // Open amounts
  offeneForderungenGesamt: number;
  ueberfaelligeForderungenGesamt: number;
  // Counts
  anzahlMitgliederMitOffenenForderungen: number;
  anzahlUeberfaelligeForderungen: number;
}

// Filter params
export interface ForderungFilterParams {
  vereinId?: number;
  mitgliedId?: number;
  statusId?: number;
  jahr?: number;
  unpaidOnly?: boolean;
  overdueOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ZahlungFilterParams {
  vereinId?: number;
  mitgliedId?: number;
  fromDate?: string;
  toDate?: string;
  unallocatedOnly?: boolean;
  page?: number;
  pageSize?: number;
}

// VeranstaltungZahlung - Event Payment
export interface VeranstaltungZahlung extends AuditableEntity {
  veranstaltungId: number;
  anmeldungId?: number | null;
  mitgliedId?: number | null;
  betrag: number;
  waehrungId: number;
  zahlungsdatum: string;
  zahlungsweg?: string | null;
  referenz?: string | null;
  bemerkung?: string | null;
  statusId: number;
  veranstaltungTitel?: string;
  mitgliedName?: string;
}

export interface CreateVeranstaltungZahlungDto {
  veranstaltungId: number;
  anmeldungId?: number;
  mitgliedId?: number;
  betrag: number;
  waehrungId?: number;
  zahlungsdatum: string;
  zahlungsweg?: string;
  referenz?: string;
  bemerkung?: string;
  statusId?: number;
}

// VereinDitibZahlung - DITIB Payment
export interface VereinDitibZahlung extends AuditableEntity {
  vereinId: number;
  betrag: number;
  waehrungId: number;
  zahlungsdatum: string;
  zahlungsperiode: string;
  zahlungsweg?: string | null;
  bankkontoId?: number | null;
  referenz?: string | null;
  bemerkung?: string | null;
  statusId: number;
  bankBuchungId?: number | null;
  vereinName?: string;
}

export interface CreateVereinDitibZahlungDto {
  vereinId: number;
  betrag: number;
  waehrungId?: number;
  zahlungsdatum: string;
  zahlungsperiode: string;
  zahlungsweg?: string;
  bankkontoId?: number;
  referenz?: string;
  bemerkung?: string;
  statusId?: number;
}

// Adresse DTO (Adresse interface is in verein.model.ts)
export interface CreateAdresseDto {
  vereinId?: number;
  adressTypId?: number;
  strasse?: string;
  hausnummer?: string;
  plz?: string;
  ort?: string;
  landId?: number;
  istStandard?: boolean;
  beschreibung?: string;
}

