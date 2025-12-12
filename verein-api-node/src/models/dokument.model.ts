/**
 * Dokument Models
 * Veranstaltung (Events) and related
 */

import { AuditableEntity } from './base.model';

// Veranstaltung - Events
export interface Veranstaltung extends AuditableEntity {
  vereinId: number;
  titel: string;
  beschreibung?: string | null;
  startdatum: string;
  enddatum?: string | null;
  preis?: number | null;
  waehrungId?: number | null;
  ort?: string | null;
  nurFuerMitglieder: boolean;
  maxTeilnehmer?: number | null;
  anmeldeErforderlich: boolean;
  istWiederholend?: boolean | null;
  wiederholungTyp?: string | null;
  wiederholungInterval?: number | null;
  wiederholungEnde?: string | null;
  wiederholungTage?: string | null;
  wiederholungMonatTag?: number | null;
  // Joined
  vereinName?: string;
  anmeldungenCount?: number;
}

export interface CreateVeranstaltungDto {
  vereinId: number;
  titel: string;
  beschreibung?: string;
  startdatum: string;
  enddatum?: string;
  preis?: number;
  waehrungId?: number;
  ort?: string;
  nurFuerMitglieder?: boolean;
  maxTeilnehmer?: number;
  anmeldeErforderlich?: boolean;
  istWiederholend?: boolean;
  wiederholungTyp?: string;
  wiederholungInterval?: number;
  wiederholungEnde?: string;
  wiederholungTage?: string;
  wiederholungMonatTag?: number;
}

export interface UpdateVeranstaltungDto extends Partial<CreateVeranstaltungDto> {}

// VeranstaltungAnmeldung - Event Registrations
export interface VeranstaltungAnmeldung extends AuditableEntity {
  veranstaltungId: number;
  mitgliedId?: number | null;
  name?: string | null;
  email?: string | null;
  telefon?: string | null;
  status?: string | null;
  bemerkung?: string | null;
  preis?: number | null;
  waehrungId?: number | null;
  zahlungStatusId?: number | null;
  // Joined
  veranstaltungTitel?: string;
  mitgliedName?: string;
}

export interface CreateVeranstaltungAnmeldungDto {
  veranstaltungId: number;
  mitgliedId?: number;
  name?: string;
  email?: string;
  telefon?: string;
  status?: string;
  bemerkung?: string;
  preis?: number;
  waehrungId?: number;
  zahlungStatusId?: number;
}

export interface UpdateVeranstaltungAnmeldungDto {
  mitgliedId?: number;
  name?: string;
  email?: string;
  telefon?: string;
  status?: string;
  bemerkung?: string;
  preis?: number;
  waehrungId?: number;
  zahlungStatusId?: number;
}

// VeranstaltungBild - Event Images
export interface VeranstaltungBild extends AuditableEntity {
  veranstaltungId: number;
  bildPfad: string;
  bildName?: string | null;
  bildTyp?: string | null;
  bildGroesse?: number | null;
  titel?: string | null;
  reihenfolge: number;
  // Joined
  veranstaltungTitel?: string;
}

export interface CreateVeranstaltungBildDto {
  veranstaltungId: number;
  bildPfad: string;
  bildName?: string;
  bildTyp?: string;
  bildGroesse?: number;
  titel?: string;
  reihenfolge?: number;
}

export interface UpdateVeranstaltungBildDto {
  titel?: string;
  reihenfolge?: number;
}

