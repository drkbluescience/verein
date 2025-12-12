/**
 * Verein (Association) Models
 * Maps to Verein schema tables in database
 */

import { AuditableEntity } from './base.model';
import { Bankkonto } from './bank.model';

// Adresse - Address entity
export interface Adresse extends AuditableEntity {
  vereinId?: number | null;
  adresseTypId?: number | null;
  strasse?: string | null;
  hausnummer?: string | null;
  zusatz?: string | null;
  plz?: string | null;
  ort?: string | null;
  land?: string | null;
  landId?: number | null;
  istHauptadresse?: boolean | null;
  istStandard?: boolean | null;
  beschreibung?: string | null;
}

// RechtlicheDaten - Legal data entity
export interface RechtlicheDaten extends AuditableEntity {
  vereinId: number;
  registergerichtName?: string | null;
  registergerichtNummer?: string | null;
  registergerichtOrt?: string | null;
  registergerichtEintragungsdatum?: Date | null;
  finanzamtName?: string | null;
  finanzamtNummer?: string | null;
  finanzamtOrt?: string | null;
  steuerpflichtig?: boolean | null;
  steuerbefreit?: boolean | null;
  gemeinnuetzigAnerkannt?: boolean | null;
  gemeinnuetzigkeitBis?: Date | null;
  bemerkung?: string | null;
}

// Verein - Main association entity
export interface Verein extends AuditableEntity {
  name: string;
  kurzname?: string | null;
  vereinsnummer?: string | null;
  steuernummer?: string | null;
  rechtsformId?: number | null;
  gruendungsdatum?: Date | null;
  zweck?: string | null;
  adresseId?: number | null;
  hauptBankkontoId?: number | null;
  telefon?: string | null;
  fax?: string | null;
  email?: string | null;
  webseite?: string | null;
  vorstandsvorsitzender?: string | null;
  geschaeftsfuehrer?: string | null;
  vertreterEmail?: string | null;
  kontaktperson?: string | null;
  mitgliederzahl?: number | null;
  satzungPfad?: string | null;
  logoPfad?: string | null;
  externeReferenzId?: string | null;
  ePostEmpfangAdresse?: string | null;
  sepaGlaeubigerID?: string | null;
  socialMediaLinks?: string | null;
  elektronischeSignaturKey?: string | null;
  mandantencode?: string | null;
  
  // Navigation properties (for joined queries)
  hauptAdresse?: Adresse | null;
  hauptBankkonto?: Bankkonto | null;
  rechtlicheDaten?: RechtlicheDaten | null;
}

// VereinSatzung - Association statute entity
export interface VereinSatzung extends AuditableEntity {
  vereinId: number;
  dosyaPfad: string;
  satzungVom: string;
  aktiv: boolean;
  bemerkung?: string | null;
  dosyaAdi?: string | null;
  dosyaBoyutu?: number | null;
}

export interface UpdateVereinSatzungDto {
  satzungVom?: string;
  bemerkung?: string;
  aktiv?: boolean;
}

// Create DTOs
export interface CreateVereinDto {
  name: string;
  kurzname?: string;
  vereinsnummer?: string;
  rechtsformId?: number;
  gruendungsdatum?: string;
  zweck?: string;
  telefon?: string;
  fax?: string;
  email?: string;
  webseite?: string;
  mandantencode?: string;
}

export interface UpdateVereinDto extends Partial<CreateVereinDto> {
  vorstandsvorsitzender?: string;
  geschaeftsfuehrer?: string;
  vertreterEmail?: string;
  kontaktperson?: string;
  mitgliederzahl?: number;
  satzungPfad?: string;
  logoPfad?: string;
  sepaGlaeubigerID?: string;
  socialMediaLinks?: string;
  aktiv?: boolean;
}

// Response DTO with relations
export interface VereinResponseDto extends Verein {
  rechtsformName?: string;
}

