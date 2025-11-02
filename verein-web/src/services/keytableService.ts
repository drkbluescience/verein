import api from './api';
import i18n from 'i18next';

// ============================================================================
// INTERFACES - Keytable DTOs
// ============================================================================

export interface KeytableUebersetzung {
  sprache: string;
  name: string;
}

// Helper function to get translated name
const getTranslatedName = (uebersetzungen: KeytableUebersetzung[], defaultName: string = ''): string => {
  if (!uebersetzungen || uebersetzungen.length === 0) return defaultName;

  const currentLang = i18n.language || 'de';
  const translated = uebersetzungen.find(u => u.sprache === currentLang);

  if (translated) return translated.name;

  // Fallback to German or first available
  const german = uebersetzungen.find(u => u.sprache === 'de');
  if (german) return german.name;

  return uebersetzungen[0]?.name || defaultName;
};

// Gender (Geschlecht)
export interface Geschlecht {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Member Status (MitgliedStatus)
export interface MitgliedStatus {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Member Type (MitgliedTyp)
export interface MitgliedTyp {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Family Relationship Type (FamilienbeziehungTyp)
export interface FamilienbeziehungTyp {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Payment Type (ZahlungTyp)
export interface ZahlungTyp {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Payment Status (ZahlungStatus)
export interface ZahlungStatus {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Claim Type (Forderungsart)
export interface Forderungsart {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Claim Status (Forderungsstatus)
export interface Forderungsstatus {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Currency (Waehrung)
export interface Waehrung {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Legal Form (Rechtsform)
export interface Rechtsform {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Address Type (AdresseTyp)
export interface AdresseTyp {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Account Type (Kontotyp)
export interface Kontotyp {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Family Member Status (MitgliedFamilieStatus)
export interface MitgliedFamilieStatus {
  id: number;
  code: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Nationality (Staatsangehoerigkeit)
export interface Staatsangehoerigkeit {
  id: number;
  iso2: string;
  iso3: string;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Contribution Period (BeitragPeriode)
export interface BeitragPeriode {
  code: string;
  sort: number;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// Contribution Payment Day Type (BeitragZahlungstagTyp)
export interface BeitragZahlungstagTyp {
  code: string;
  sort: number;
  name?: string;
  uebersetzungen: KeytableUebersetzung[];
}

// ============================================================================
// SERVICE - Keytable API Calls
// ============================================================================

// Helper to add name property to keytable items
const addNameProperty = <T extends { uebersetzungen: KeytableUebersetzung[]; code?: string }>(items: T[]): T[] => {
  return items.map(item => ({
    ...item,
    name: getTranslatedName(item.uebersetzungen, item.code || '')
  }));
};

const keytableService = {
  // Gender (Geschlecht)
  getGeschlechter: async (): Promise<Geschlecht[]> => {
    const data = await api.get<Geschlecht[]>('/api/Keytable/geschlechter');
    return addNameProperty(data);
  },

  // Member Status (MitgliedStatus)
  getMitgliedStatuse: async (): Promise<MitgliedStatus[]> => {
    const data = await api.get<MitgliedStatus[]>('/api/Keytable/mitgliedstatuse');
    return addNameProperty(data);
  },

  // Member Type (MitgliedTyp)
  getMitgliedTypen: async (): Promise<MitgliedTyp[]> => {
    const data = await api.get<MitgliedTyp[]>('/api/Keytable/mitgliedtypen');
    return addNameProperty(data);
  },

  // Family Relationship Type (FamilienbeziehungTyp)
  getFamilienbeziehungTypen: async (): Promise<FamilienbeziehungTyp[]> => {
    const data = await api.get<FamilienbeziehungTyp[]>('/api/Keytable/familienbeziehungtypen');
    return addNameProperty(data);
  },

  // Payment Type (ZahlungTyp)
  getZahlungTypen: async (): Promise<ZahlungTyp[]> => {
    const data = await api.get<ZahlungTyp[]>('/api/Keytable/zahlungtypen');
    return addNameProperty(data);
  },

  // Payment Status (ZahlungStatus)
  getZahlungStatuse: async (): Promise<ZahlungStatus[]> => {
    const data = await api.get<ZahlungStatus[]>('/api/Keytable/zahlungstatuse');
    return addNameProperty(data);
  },

  // Claim Type (Forderungsart)
  getForderungsarten: async (): Promise<Forderungsart[]> => {
    const data = await api.get<Forderungsart[]>('/api/Keytable/forderungsarten');
    return addNameProperty(data);
  },

  // Claim Status (Forderungsstatus)
  getForderungsstatuse: async (): Promise<Forderungsstatus[]> => {
    const data = await api.get<Forderungsstatus[]>('/api/Keytable/forderungsstatuse');
    return addNameProperty(data);
  },

  // Currency (Waehrung)
  getWaehrungen: async (): Promise<Waehrung[]> => {
    const data = await api.get<Waehrung[]>('/api/Keytable/waehrungen');
    return addNameProperty(data);
  },

  // Legal Form (Rechtsform)
  getRechtsformen: async (): Promise<Rechtsform[]> => {
    const data = await api.get<Rechtsform[]>('/api/Keytable/rechtsformen');
    return addNameProperty(data);
  },

  // Address Type (AdresseTyp)
  getAdresseTypen: async (): Promise<AdresseTyp[]> => {
    const data = await api.get<AdresseTyp[]>('/api/Keytable/adressetypen');
    return addNameProperty(data);
  },

  // Account Type (Kontotyp)
  getKontotypen: async (): Promise<Kontotyp[]> => {
    const data = await api.get<Kontotyp[]>('/api/Keytable/kontotypen');
    return addNameProperty(data);
  },

  // Family Member Status (MitgliedFamilieStatus)
  getMitgliedFamilieStatuse: async (): Promise<MitgliedFamilieStatus[]> => {
    const data = await api.get<MitgliedFamilieStatus[]>('/api/Keytable/mitgliedfamiliestatuse');
    return addNameProperty(data);
  },

  // Nationality (Staatsangehoerigkeit)
  getStaatsangehoerigkeiten: async (): Promise<Staatsangehoerigkeit[]> => {
    const data = await api.get<Staatsangehoerigkeit[]>('/api/Keytable/staatsangehoerigkeiten');
    return addNameProperty(data);
  },

  // Contribution Period (BeitragPeriode)
  getBeitragPerioden: async (): Promise<BeitragPeriode[]> => {
    const data = await api.get<BeitragPeriode[]>('/api/Keytable/beitragperioden');
    return addNameProperty(data);
  },

  // Contribution Payment Day Type (BeitragZahlungstagTyp)
  getBeitragZahlungstagTypen: async (): Promise<BeitragZahlungstagTyp[]> => {
    const data = await api.get<BeitragZahlungstagTyp[]>('/api/Keytable/beitragzahlungstagtypen');
    return addNameProperty(data);
  },
};

export default keytableService;

