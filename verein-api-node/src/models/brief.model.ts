/**
 * Brief (Letter) Models
 * BriefVorlage (Templates) and Brief (Drafts) and Nachricht (Sent Messages)
 */

import { AuditableEntity } from './base.model';

// BriefVorlage - Letter Templates
export interface BriefVorlage extends AuditableEntity {
  vereinId: number;
  name: string;
  beschreibung?: string | null;
  betreff: string;
  inhalt: string;
  kategorie?: string | null;
  logoPosition: string;
  schriftart: string;
  schriftgroesse: number;
  istSystemvorlage: boolean;
  istAktiv: boolean;
}

// Brief - Letter Drafts
export interface Brief extends AuditableEntity {
  vereinId: number;
  vorlageId?: number | null;
  titel: string;
  betreff: string;
  inhalt: string;
  logoUrl?: string | null;
  logoPosition: string;
  schriftart: string;
  schriftgroesse: number;
  status: string;
  selectedMitgliedIds?: string | null;
  // Joined fields
  vorlageName?: string;
}

// Nachricht - Sent Messages
export interface Nachricht {
  id: number;
  briefId: number;
  vereinId: number;
  mitgliedId: number;
  betreff: string;
  inhalt: string;
  logoUrl?: string | null;
  istGelesen: boolean;
  gelesenDatum?: string | null;
  gesendetDatum: string;
  deletedFlag: boolean;
  // Joined fields
  mitgliedName?: string;
  vereinName?: string;
}

// Create DTOs
export interface CreateBriefVorlageDto {
  vereinId: number;
  name: string;
  beschreibung?: string;
  betreff: string;
  inhalt: string;
  kategorie?: string;
  logoPosition?: string;
  schriftart?: string;
  schriftgroesse?: number;
  istSystemvorlage?: boolean;
  istAktiv?: boolean;
}

export interface UpdateBriefVorlageDto extends Partial<CreateBriefVorlageDto> {}

export interface CreateBriefDto {
  vereinId: number;
  vorlageId?: number;
  titel: string;
  betreff: string;
  inhalt: string;
  logoUrl?: string;
  logoPosition?: string;
  schriftart?: string;
  schriftgroesse?: number;
  selectedMitgliedIds?: number[];
}

export interface UpdateBriefDto extends Partial<CreateBriefDto> {
  status?: string;
}

export interface SendBriefDto {
  briefId: number;
  mitgliedIds: number[];
}

export interface QuickSendBriefDto {
  vereinId: number;
  titel: string;
  betreff: string;
  inhalt: string;
  logoUrl?: string;
  logoPosition?: string;
  schriftart?: string;
  schriftgroesse?: number;
  mitgliedIds: number[];
}

export interface PreviewContentDto {
  content: string;
  mitgliedId: number;
  vereinId: number;
}

// Statistics
export interface BriefStatistics {
  totalBriefe: number;
  totalEntwuerfe: number;
  totalGesendet: number;
  totalNachrichten: number;
  totalGelesen: number;
  leseQuote: number;
}

