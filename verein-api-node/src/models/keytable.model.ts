/**
 * Keytable (Lookup) Models
 * Maps to Keytable schema tables in database
 */

import { KeytableBase, KeytableUebersetzung, KeytableWithUebersetzung } from './base.model';

// Re-export for convenience
export { KeytableBase, KeytableUebersetzung, KeytableWithUebersetzung };

// AdresseTyp - Address types (HOME, WORK, BILLING, etc.)
export interface AdresseTyp extends KeytableWithUebersetzung {}

// BeitragPeriode - Contribution periods (MONTHLY, QUARTERLY, YEARLY, etc.)
export interface BeitragPeriode extends KeytableWithUebersetzung {}

// BeitragZahlungstagTyp - Payment day types
export interface BeitragZahlungstagTyp extends KeytableWithUebersetzung {}

// FamilienbeziehungTyp - Family relationship types (PARENT, CHILD, SPOUSE, etc.)
export interface FamilienbeziehungTyp extends KeytableWithUebersetzung {}

// Forderungsart - Claim types
export interface Forderungsart extends KeytableWithUebersetzung {}

// Forderungsstatus - Claim statuses (OPEN, CLOSED, PAID, etc.)
export interface Forderungsstatus extends KeytableWithUebersetzung {}

// Geschlecht - Gender types
export interface Geschlecht extends KeytableWithUebersetzung {}

// Kontotyp - Bank account types
export interface Kontotyp extends KeytableWithUebersetzung {}

// MitgliedFamilieStatus - Family membership status
export interface MitgliedFamilieStatus extends KeytableWithUebersetzung {}

// MitgliedStatus - Member status (ACTIVE, INACTIVE, PENDING, etc.)
export interface MitgliedStatus extends KeytableWithUebersetzung {}

// MitgliedTyp - Member types (INDIVIDUAL, CORPORATE, FAMILY, etc.)
export interface MitgliedTyp extends KeytableWithUebersetzung {}

// Rechtsform - Legal form types
export interface Rechtsform extends KeytableWithUebersetzung {}

// Staatsangehoerigkeit - Nationality types
export interface Staatsangehoerigkeit extends KeytableWithUebersetzung {}

// Waehrung - Currency types
export interface Waehrung extends KeytableWithUebersetzung {}

// ZahlungStatus - Payment statuses
export interface ZahlungStatus extends KeytableWithUebersetzung {}

// ZahlungTyp - Payment types (MEMBERSHIP_FEE, DONATION, EVENT_FEE, etc.)
export interface ZahlungTyp extends KeytableWithUebersetzung {}

// Generic keytable type union - useful for generic operations
export type KeytableType = 
  | 'AdresseTyp'
  | 'BeitragPeriode'
  | 'BeitragZahlungstagTyp'
  | 'FamilienbeziehungTyp'
  | 'Forderungsart'
  | 'Forderungsstatus'
  | 'Geschlecht'
  | 'Kontotyp'
  | 'MitgliedFamilieStatus'
  | 'MitgliedStatus'
  | 'MitgliedTyp'
  | 'Rechtsform'
  | 'Staatsangehoerigkeit'
  | 'Waehrung'
  | 'ZahlungStatus'
  | 'ZahlungTyp';

// All keytables response
export interface AllKeytablesResponse {
  adresseTyp: AdresseTyp[];
  beitragPeriode: BeitragPeriode[];
  beitragZahlungstagTyp: BeitragZahlungstagTyp[];
  familienbeziehungTyp: FamilienbeziehungTyp[];
  forderungsart: Forderungsart[];
  forderungsstatus: Forderungsstatus[];
  geschlecht: Geschlecht[];
  kontotyp: Kontotyp[];
  mitgliedFamilieStatus: MitgliedFamilieStatus[];
  mitgliedStatus: MitgliedStatus[];
  mitgliedTyp: MitgliedTyp[];
  rechtsform: Rechtsform[];
  staatsangehoerigkeit: Staatsangehoerigkeit[];
  waehrung: Waehrung[];
  zahlungStatus: ZahlungStatus[];
  zahlungTyp: ZahlungTyp[];
}

