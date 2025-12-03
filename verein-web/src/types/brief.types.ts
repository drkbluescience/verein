// Brief (Letter/Message) Types
// Matches backend DTOs and Enums

// ==================== Enums ====================

export enum BriefStatus {
  Entwurf = 'Entwurf',       // Draft
  Gesendet = 'Gesendet'      // Sent
}

export enum BriefVorlageKategorie {
  Allgemein = 'Allgemein',           // General
  Willkommen = 'Willkommen',         // Welcome
  Mitgliedschaft = 'Mitgliedschaft', // Membership
  Veranstaltung = 'Veranstaltung',   // Event
  Finanzen = 'Finanzen',             // Finance
  Mahnung = 'Mahnung',               // Reminder
  Sonstiges = 'Sonstiges'            // Other
}

// ==================== Template DTOs ====================

export interface BriefVorlageDto {
  id: number;
  vereinId: number;
  name: string;
  beschreibung?: string;
  betreff: string;
  inhalt: string;
  kategorie: BriefVorlageKategorie;
  istSystemvorlage: boolean;
  aktiv: boolean;
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateBriefVorlageDto {
  name: string;
  beschreibung?: string;
  betreff: string;
  inhalt: string;
  kategorie?: BriefVorlageKategorie;
}

export interface UpdateBriefVorlageDto {
  name?: string;
  beschreibung?: string;
  betreff?: string;
  inhalt?: string;
  kategorie?: BriefVorlageKategorie;
  aktiv?: boolean;
}

// ==================== Letter Draft DTOs ====================

export interface BriefDto {
  id: number;
  vereinId: number;
  vorlageId?: number;
  titel: string;
  betreff: string;
  inhalt: string;
  logoUrl?: string;
  logoPosition: string;
  schriftart: string;
  schriftgroesse: number;
  status: BriefStatus;
  vorlageName?: string;
  nachrichtenCount: number;
  selectedMitgliedIds?: number[];
  selectedMitgliedCount?: number;
  created?: string;
  createdBy?: number;
  modified?: string;
  modifiedBy?: number;
}

export interface CreateBriefDto {
  vereinId: number;
  vorlageId?: number;
  titel: string;
  betreff: string;
  inhalt: string;
  selectedMitgliedIds?: number[];
}

export interface UpdateBriefDto {
  vorlageId?: number;
  titel?: string;
  betreff?: string;
  inhalt?: string;
  selectedMitgliedIds?: number[];
}

export interface SendBriefDto {
  briefId: number;
  mitgliedIds: number[];
}

export interface QuickSendBriefDto {
  vorlageId?: number;
  name: string;
  betreff: string;
  inhalt: string;
  mitgliedIds: number[];
}

// ==================== Message DTOs ====================

export interface NachrichtDto {
  id: number;
  briefId: number;
  vereinId: number;
  mitgliedId: number;
  betreff: string;
  inhalt: string;
  gesendetDatum: string;
  istGelesen: boolean;
  gelesenDatum?: string;
  deletedFlag: boolean;
  // Navigation
  vereinName?: string;
  absenderName?: string;
  vereinKurzname?: string;
  mitgliedVorname?: string;
  mitgliedNachname?: string;
  mitgliedEmail?: string;
}

// ==================== Statistics DTOs ====================

export interface BriefStatisticsDto {
  totalBriefe: number;
  entwurfBriefe: number;
  gesendetBriefe: number;
  totalNachrichten: number;
  gelesenNachrichten: number;
  ungelesenNachrichten: number;
}

export interface UnreadCountDto {
  count: number;
}

// ==================== UI Helper Types ====================

export interface BriefFormData {
  vorlageId?: number;
  name: string;
  betreff: string;
  inhalt: string;
  mitgliedIds: number[];
}

export interface BriefFilters {
  status?: BriefStatus;
  vorlageId?: number;
  searchTerm?: string;
}

export interface NachrichtFilters {
  istGelesen?: boolean;
  vereinId?: number;
  searchTerm?: string;
}

// ==================== Labels for UI ====================

export const KategorieLabels: Record<BriefVorlageKategorie, { de: string; tr: string }> = {
  [BriefVorlageKategorie.Allgemein]: { de: 'Allgemein', tr: 'Genel' },
  [BriefVorlageKategorie.Willkommen]: { de: 'Willkommen', tr: 'Hoş Geldiniz' },
  [BriefVorlageKategorie.Mitgliedschaft]: { de: 'Mitgliedschaft', tr: 'Üyelik' },
  [BriefVorlageKategorie.Veranstaltung]: { de: 'Veranstaltung', tr: 'Etkinlik' },
  [BriefVorlageKategorie.Finanzen]: { de: 'Finanzen', tr: 'Finans' },
  [BriefVorlageKategorie.Mahnung]: { de: 'Mahnung', tr: 'Hatırlatma' },
  [BriefVorlageKategorie.Sonstiges]: { de: 'Sonstiges', tr: 'Diğer' },
};

export const StatusLabels: Record<BriefStatus, { de: string; tr: string }> = {
  [BriefStatus.Entwurf]: { de: 'Entwurf', tr: 'Taslak' },
  [BriefStatus.Gesendet]: { de: 'Gesendet', tr: 'Gönderildi' },
};

export const KategorieIcons: Record<BriefVorlageKategorie, string> = {
  [BriefVorlageKategorie.Allgemein]: '📝',
  [BriefVorlageKategorie.Willkommen]: '👋',
  [BriefVorlageKategorie.Mitgliedschaft]: '🎫',
  [BriefVorlageKategorie.Veranstaltung]: '📅',
  [BriefVorlageKategorie.Finanzen]: '💰',
  [BriefVorlageKategorie.Mahnung]: '⚠️',
  [BriefVorlageKategorie.Sonstiges]: '📌',
};

// ==================== Placeholder Types ====================

export interface PlaceholderInfo {
  key: string;
  label: { de: string; tr: string };
  description: { de: string; tr: string };
}

export const AvailablePlaceholders: PlaceholderInfo[] = [
  { key: '{{vorname}}', label: { de: 'Vorname', tr: 'Ad' }, description: { de: 'Vorname des Mitglieds', tr: 'Üyenin adı' } },
  { key: '{{nachname}}', label: { de: 'Nachname', tr: 'Soyad' }, description: { de: 'Nachname des Mitglieds', tr: 'Üyenin soyadı' } },
  { key: '{{vollname}}', label: { de: 'Vollständiger Name', tr: 'Tam Ad' }, description: { de: 'Vollständiger Name des Mitglieds', tr: 'Üyenin tam adı' } },
  { key: '{{email}}', label: { de: 'E-Mail', tr: 'E-posta' }, description: { de: 'E-Mail-Adresse des Mitglieds', tr: 'Üyenin e-posta adresi' } },
  { key: '{{mitgliedsnummer}}', label: { de: 'Mitgliedsnummer', tr: 'Üye Numarası' }, description: { de: 'Mitgliedsnummer', tr: 'Üye numarası' } },
  { key: '{{vereinName}}', label: { de: 'Vereinsname', tr: 'Dernek Adı' }, description: { de: 'Name des Vereins', tr: 'Derneğin adı' } },
  { key: '{{vereinKurzname}}', label: { de: 'Vereinskurzname', tr: 'Dernek Kısa Adı' }, description: { de: 'Kurzname des Vereins', tr: 'Derneğin kısa adı' } },
  { key: '{{beitragBetrag}}', label: { de: 'Beitragsbetrag', tr: 'Aidat Tutarı' }, description: { de: 'Monatlicher Beitragsbetrag', tr: 'Aylık aidat tutarı' } },
  { key: '{{datum}}', label: { de: 'Datum', tr: 'Tarih' }, description: { de: 'Aktuelles Datum', tr: 'Güncel tarih' } },
];

