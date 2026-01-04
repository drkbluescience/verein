/**
 * easyFiBu Module Types
 * Types for easyFiBu financial management
 * (FiBuKonto, Kassenbuch, SpendenProtokoll, DurchlaufendePosten, KassenbuchJahresabschluss)
 */

// ============================================================================
// FIBU KONTO TYPES
// ============================================================================

export interface FiBuKontoDto {
  id: number;
  nummer: string;
  bezeichnung: string;
  bezeichnungTr?: string;
  kategorie: string;
  unterkategorie?: string;
  kontoTyp: string;
  zahlungTypId?: number;
  istEinnahme: boolean;
  istAusgabe: boolean;
  istDurchlaufend: boolean;
  beschreibung?: string;
  sortierung: number;
  aktiv: boolean;
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateFiBuKontoDto {
  nummer: string;
  bezeichnung: string;
  kategorie: string;
  unterkategorie?: string;
  kontoTyp: string;
  zahlungTypId?: number;
  istEinnahme?: boolean;
  istAusgabe?: boolean;
  istDurchlaufend?: boolean;
  beschreibung?: string;
  sortierung?: number;
}

export interface UpdateFiBuKontoDto {
  id: number;
  nummer: string;
  bezeichnung: string;
  kategorie: string;
  unterkategorie?: string;
  kontoTyp: string;
  zahlungTypId?: number;
  istEinnahme?: boolean;
  istAusgabe?: boolean;
  istDurchlaufend?: boolean;
  beschreibung?: string;
  sortierung?: number;
  aktiv?: boolean;
}

// ============================================================================
// KASSENBUCH TYPES
// ============================================================================

export interface KassenbuchDto {
  id: number;
  vereinId: number;
  jahr: number;
  belegNr: number;
  belegDatum: string;
  buchungstext: string;
  fiBuNummer: string;
  fiBuKontoBezeichnung?: string;
  einnahme?: number;
  ausgabe?: number;
  kasseEinnahme?: number;
  kasseAusgabe?: number;
  bankEinnahme?: number;
  bankAusgabe?: number;
  mitgliedId?: number;
  mitgliedName?: string;
  mitgliedZahlungId?: number;
  bankBuchungId?: number;
  notiz?: string;
  storniert: boolean;
  stornoGrund?: string;
  stornoDatum?: string;
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateKassenbuchDto {
  vereinId: number;
  jahr?: number;
  belegDatum: string;
  buchungstext: string;
  fiBuNummer: string;
  einnahme?: number;
  ausgabe?: number;
  kasseEinnahme?: number;
  kasseAusgabe?: number;
  bankEinnahme?: number;
  bankAusgabe?: number;
  mitgliedId?: number;
  mitgliedZahlungId?: number;
  bankBuchungId?: number;
  notiz?: string;
}

export interface UpdateKassenbuchDto {
  id: number;
  belegDatum: string;
  buchungstext: string;
  fiBuNummer: string;
  einnahme?: number;
  ausgabe?: number;
  kasseEinnahme?: number;
  kasseAusgabe?: number;
  bankEinnahme?: number;
  bankAusgabe?: number;
  mitgliedId?: number;
  notiz?: string;
}

export interface KassenbuchKontoSummaryDto {
  fiBuNummer: string;
  fiBuKontoBezeichnung: string;
  kategorie: string;
  totalEinnahmen: number;
  totalAusgaben: number;
  saldo: number;
  anzahlBuchungen: number;
}

export interface KassenbuchSummaryDto {
  jahr: number;
  totalEinnahmen: number;
  totalAusgaben: number;
  saldo: number;
  kasseSaldo: number;
  bankSaldo: number;
}

// ============================================================================
// KASSENBUCH JAHRESABSCHLUSS TYPES
// ============================================================================

export interface KassenbuchJahresabschlussDto {
  id: number;
  vereinId: number;
  jahr: number;
  kasseAnfangsbestand: number;
  kasseEndbestand: number;
  bankAnfangsbestand: number;
  bankEndbestand: number;
  totalEinnahmen: number;
  totalAusgaben: number;
  saldo: number;
  geprueft: boolean;
  geprueftVon?: string;
  geprueftAm?: string;
  bemerkungen?: string;
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateKassenbuchJahresabschlussDto {
  vereinId: number;
  jahr: number;
  kasseAnfangsbestand: number;
  bankAnfangsbestand: number;
  kasseEndbestand: number;
  bankEndbestand: number;
  totalEinnahmen: number;
  totalAusgaben: number;
  saldo: number;
  bemerkungen?: string;
}

export interface UpdateKassenbuchJahresabschlussDto {
  id: number;
  kasseEndbestand: number;
  bankEndbestand: number;
  totalEinnahmen: number;
  totalAusgaben: number;
  saldo: number;
  bemerkungen?: string;
}

// ============================================================================
// SPENDEN PROTOKOLL TYPES
// ============================================================================

export interface SpendenProtokollDto {
  id: number;
  vereinId: number;
  datum: string;
  betrag: number;
  zweck?: string;
  zweckKategorie?: string;
  protokollant?: string;
  zeuge1Name?: string;
  zeuge1Unterschrift: boolean;
  zeuge2Name?: string;
  zeuge2Unterschrift: boolean;
  zeuge3Name?: string;
  zeuge3Unterschrift: boolean;
  kassenbuchId?: number;
  bemerkungen?: string;
  details: SpendenProtokollDetailDto[];
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface SpendenProtokollDetailDto {
  id: number;
  spendenProtokollId: number;
  waehrung: string;
  wert: number;
  anzahl: number;
  summe: number;
}

export interface CreateSpendenProtokollDto {
  vereinId: number;
  datum: string;
  zweck?: string;
  zweckKategorie?: string;
  protokollant?: string;
  zeuge1Name?: string;
  zeuge2Name?: string;
  zeuge3Name?: string;
  bemerkungen?: string;
  details: CreateSpendenProtokollDetailDto[];
}

export interface CreateSpendenProtokollDetailDto {
  waehrung: string;
  wert: number;
  anzahl: number;
}

export interface UpdateSpendenProtokollDto {
  id: number;
  zweckKategorie?: string;
  bemerkungen?: string;
  kassenbuchId?: number;
}

export interface SpendenKategorieSummaryDto {
  kategorie: string;
  totalBetrag: number;
  anzahlProtokolle: number;
}

// ============================================================================
// DURCHLAUFENDE POSTEN TYPES
// ============================================================================

export interface DurchlaufendePostenDto {
  id: number;
  vereinId: number;
  fiBuNummer: string;
  fiBuKontoBezeichnung?: string;
  bezeichnung: string;
  empfaenger?: string;
  einnahmenDatum: string;
  einnahmenBetrag: number;
  ausgabenDatum?: string;
  ausgabenBetrag?: number;
  referenz?: string;
  status: string;
  kassenbuchEinnahmeId?: number;
  kassenbuchAusgabeId?: number;
  bemerkungen?: string;
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateDurchlaufendePostenDto {
  vereinId: number;
  fiBuNummer: string;
  bezeichnung: string;
  empfaenger?: string;
  einnahmenDatum: string;
  einnahmenBetrag: number;
  bemerkungen?: string;
}

export interface UpdateDurchlaufendePostenDto {
  id: number;
  bezeichnung?: string;
  empfaenger?: string;
  ausgabenDatum?: string;
  ausgabenBetrag?: number;
  referenz?: string;
  status?: string;
  kassenbuchAusgabeId?: number;
  bemerkungen?: string;
}

export interface DurchlaufendePostenSummaryDto {
  empfaenger: string;
  totalEinnahmen: number;
  totalAusgaben: number;
  offenerBetrag: number;
  anzahlPosten: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const FIBU_KATEGORIEN = {
  IDEELLER_BEREICH: 'Ideeller Bereich',
  VERMOEGENSVERWALTUNG: 'Vermögensverwaltung',
  ZWECKBETRIEB: 'Zweckbetrieb',
  WIRTSCHAFTLICHER_BETRIEB: 'Wirtschaftlicher Geschäftsbetrieb',
  DURCHLAUFENDE_POSTEN: 'Durchlaufende Posten',
} as const;

export const DURCHLAUFENDE_POSTEN_STATUS = {
  OFFEN: 'OFFEN',
  TEILWEISE: 'TEILWEISE',
  ABGESCHLOSSEN: 'ABGESCHLOSSEN',
} as const;

export const SPENDEN_KATEGORIEN = {
  ALLGEMEIN: 'Allgemein',
  MOSCHEE: 'Moschee',
  BILDUNG: 'Bildung',
  SOZIALES: 'Soziales',
  KURBAN: 'Kurban',
  FITRE: 'Fitre',
  ZEKAT: 'Zekat',
} as const;

