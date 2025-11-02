/**
 * Keytable (Lookup) Types
 * Defines all TypeScript interfaces for lookup/reference tables
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface KeytableUebersetzung {
  sprache: string;
  name: string;
}

// ============================================================================
// ID-BASED LOOKUP TABLES (with Code field)
// ============================================================================

export interface Geschlecht {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface MitgliedStatus {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface MitgliedTyp {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface FamilienbeziehungTyp {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface ZahlungTyp {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface ZahlungStatus {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface Forderungsart {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface Forderungsstatus {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface Waehrung {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface Rechtsform {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface AdresseTyp {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface Kontotyp {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface MitgliedFamilieStatus {
  id: number;
  code: string;
  uebersetzungen: KeytableUebersetzung[];
}

export interface Staatsangehoerigkeit {
  id: number;
  iso2: string;
  iso3: string;
  uebersetzungen: KeytableUebersetzung[];
}

// ============================================================================
// CODE-BASED LOOKUP TABLES (Code as primary key)
// ============================================================================

export interface BeitragPeriode {
  code: string;
  sort: number;
  uebersetzungen: KeytableUebersetzung[];
}

export interface BeitragZahlungstagTyp {
  code: string;
  sort: number;
  uebersetzungen: KeytableUebersetzung[];
}

// ============================================================================
// UNION TYPES FOR GENERIC HANDLING
// ============================================================================

export type IdBasedKeytable =
  | Geschlecht
  | MitgliedStatus
  | MitgliedTyp
  | FamilienbeziehungTyp
  | ZahlungTyp
  | ZahlungStatus
  | Forderungsart
  | Forderungsstatus
  | Waehrung
  | Rechtsform
  | AdresseTyp
  | Kontotyp
  | MitgliedFamilieStatus
  | Staatsangehoerigkeit;

export type CodeBasedKeytable = BeitragPeriode | BeitragZahlungstagTyp;

export type AnyKeytable = IdBasedKeytable | CodeBasedKeytable;

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface KeytableSelectOption {
  value: string | number;
  label: string;
  code?: string;
}

export interface KeytableSelectOptions {
  [key: string]: KeytableSelectOption[];
}

