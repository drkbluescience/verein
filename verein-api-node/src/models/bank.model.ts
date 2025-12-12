/**
 * Bank Models
 * Bankkonto (Bank Account) and BankBuchung (Bank Transaction)
 */

import { AuditableEntity } from './base.model';

// Bankkonto - Bank Account
export interface Bankkonto extends AuditableEntity {
  vereinId: number;
  kontotypId?: number | null;
  iban: string;
  bic?: string | null;
  kontoinhaber?: string | null;
  bankname?: string | null;
  kontoNr?: string | null;
  blz?: string | null;
  beschreibung?: string | null;
  gueltigVon?: string | null;
  gueltigBis?: string | null;
  istStandard?: boolean | null;
  // Joined fields
  vereinName?: string;
  kontotypName?: string;
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
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
}

export interface UpdateBankkontoDto {
  kontotypId?: number;
  iban?: string;
  bic?: string;
  kontoinhaber?: string;
  bankname?: string;
  kontoNr?: string;
  blz?: string;
  beschreibung?: string;
  gueltigVon?: string;
  gueltigBis?: string;
  istStandard?: boolean;
}

// BankBuchung - Bank Transaction
export interface BankBuchung extends AuditableEntity {
  vereinId: number;
  bankKontoId: number;
  buchungsdatum: string;
  betrag: number;
  waehrungId: number;
  empfaenger?: string | null;
  verwendungszweck?: string | null;
  referenz?: string | null;
  statusId: number;
  angelegtAm?: string | null;
  // Joined fields
  vereinName?: string;
  bankkontoIban?: string;
  waehrungCode?: string;
  statusName?: string;
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
}

export interface UpdateBankBuchungDto {
  buchungsdatum?: string;
  betrag?: number;
  waehrungId?: number;
  empfaenger?: string;
  verwendungszweck?: string;
  referenz?: string;
  statusId?: number;
}

// Bank Upload response
export interface BankUploadResponse {
  success: boolean;
  message: string;
  totalRows?: number;
  processedRows?: number;
  matchedRows?: number;
  errors?: string[];
}

// Unmatched transaction
export interface UnmatchedBankBuchung extends BankBuchung {
  possibleMatches?: Array<{
    mitgliedId: number;
    mitgliedName: string;
    matchScore: number;
  }>;
}

