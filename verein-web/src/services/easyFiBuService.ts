/**
 * easyFiBu Services
 * API services for easyFiBu financial management
 * (FiBuKonto, Kassenbuch, SpendenProtokoll, DurchlaufendePosten, KassenbuchJahresabschluss)
 */

import api from './api';
import {
  FiBuKontoDto,
  CreateFiBuKontoDto,
  UpdateFiBuKontoDto,
  KassenbuchDto,
  CreateKassenbuchDto,
  UpdateKassenbuchDto,
  KassenbuchKontoSummaryDto,
  KassenbuchJahresabschlussDto,
  CreateKassenbuchJahresabschlussDto,
  UpdateKassenbuchJahresabschlussDto,
  SpendenProtokollDto,
  CreateSpendenProtokollDto,
  UpdateSpendenProtokollDto,
  SpendenKategorieSummaryDto,
  DurchlaufendePostenDto,
  CreateDurchlaufendePostenDto,
  UpdateDurchlaufendePostenDto,
  DurchlaufendePostenSummaryDto,
} from '../types/easyFiBu.types';

// ============================================================================
// FIBU KONTO SERVICE
// ============================================================================

export const fiBuKontoService = {
  // Get all FiBu accounts
  getAll: async (includeDeleted = false): Promise<FiBuKontoDto[]> => {
    return api.get<FiBuKontoDto[]>(`/api/FiBuKonten?includeDeleted=${includeDeleted}`);
  },

  // Get FiBu account by ID
  getById: async (id: number): Promise<FiBuKontoDto> => {
    return api.get<FiBuKontoDto>(`/api/FiBuKonten/${id}`);
  },

  // Get FiBu account by number
  getByNummer: async (nummer: string): Promise<FiBuKontoDto> => {
    return api.get<FiBuKontoDto>(`/api/FiBuKonten/nummer/${nummer}`);
  },

  // Get FiBu accounts by category
  getByKategorie: async (kategorie: string): Promise<FiBuKontoDto[]> => {
    return api.get<FiBuKontoDto[]>(`/api/FiBuKonten/kategorie/${kategorie}`);
  },

  // Get income accounts
  getEinnahmen: async (): Promise<FiBuKontoDto[]> => {
    return api.get<FiBuKontoDto[]>('/api/FiBuKonten/einnahmen');
  },

  // Get expense accounts
  getAusgaben: async (): Promise<FiBuKontoDto[]> => {
    return api.get<FiBuKontoDto[]>('/api/FiBuKonten/ausgaben');
  },

  // Get transit accounts
  getDurchlaufend: async (): Promise<FiBuKontoDto[]> => {
    return api.get<FiBuKontoDto[]>('/api/FiBuKonten/durchlaufend');
  },

  // Get active accounts
  getActive: async (): Promise<FiBuKontoDto[]> => {
    return api.get<FiBuKontoDto[]>('/api/FiBuKonten/active');
  },

  // Get accounts grouped by category
  getGrouped: async (): Promise<Record<string, FiBuKontoDto[]>> => {
    return api.get<Record<string, FiBuKontoDto[]>>('/api/FiBuKonten/grouped');
  },

  // Create new FiBu account
  create: async (data: CreateFiBuKontoDto): Promise<FiBuKontoDto> => {
    return api.post<FiBuKontoDto>('/api/FiBuKonten', data);
  },

  // Update FiBu account
  update: async (id: number, data: UpdateFiBuKontoDto): Promise<FiBuKontoDto> => {
    return api.put<FiBuKontoDto>(`/api/FiBuKonten/${id}`, data);
  },

  // Delete FiBu account
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/FiBuKonten/${id}`);
  },

  // Set active status
  setActiveStatus: async (id: number, isActive: boolean): Promise<void> => {
    return api.patch(`/api/FiBuKonten/${id}/active`, isActive);
  },
};

// ============================================================================
// KASSENBUCH SERVICE
// ============================================================================

export const kassenbuchService = {
  // Get all entries
  getAll: async (includeDeleted = false): Promise<KassenbuchDto[]> => {
    return api.get<KassenbuchDto[]>(`/api/Kassenbuch?includeDeleted=${includeDeleted}`);
  },

  // Get entry by ID
  getById: async (id: number): Promise<KassenbuchDto> => {
    return api.get<KassenbuchDto>(`/api/Kassenbuch/${id}`);
  },

  // Get entries by Verein
  getByVerein: async (vereinId: number, includeDeleted = false): Promise<KassenbuchDto[]> => {
    return api.get<KassenbuchDto[]>(`/api/Kassenbuch/verein/${vereinId}?includeDeleted=${includeDeleted}`);
  },

  // Get entries by Verein and year
  getByVereinAndJahr: async (vereinId: number, jahr: number): Promise<KassenbuchDto[]> => {
    return api.get<KassenbuchDto[]>(`/api/Kassenbuch/verein/${vereinId}/jahr/${jahr}`);
  },

  // Get entries by date range
  getByDateRange: async (vereinId: number, fromDate: string, toDate: string): Promise<KassenbuchDto[]> => {
    return api.get<KassenbuchDto[]>(`/api/Kassenbuch/verein/${vereinId}/daterange?fromDate=${fromDate}&toDate=${toDate}`);
  },

  // Get entry by BelegNr
  getByBelegNr: async (vereinId: number, jahr: number, belegNr: number): Promise<KassenbuchDto> => {
    return api.get<KassenbuchDto>(`/api/Kassenbuch/verein/${vereinId}/jahr/${jahr}/beleg/${belegNr}`);
  },

  // Get entries by FiBuKonto
  getByFiBuKonto: async (vereinId: number, fiBuNummer: string, jahr?: number): Promise<KassenbuchDto[]> => {
    const params = jahr ? `?jahr=${jahr}` : '';
    return api.get<KassenbuchDto[]>(`/api/Kassenbuch/verein/${vereinId}/konto/${fiBuNummer}${params}`);
  },

  // Get next BelegNr
  getNextBelegNr: async (vereinId: number, jahr: number): Promise<number> => {
    return api.get<number>(`/api/Kassenbuch/verein/${vereinId}/jahr/${jahr}/next-belegnr`);
  },

  // Get financial summary
  getSummary: async (vereinId: number, jahr: number): Promise<{
    jahr: number;
    totalEinnahmen: number;
    totalAusgaben: number;
    saldo: number;
    kasseSaldo: number;
    bankSaldo: number;
  }> => {
    return api.get(`/api/Kassenbuch/verein/${vereinId}/jahr/${jahr}/summary`);
  },

  // Get account summary
  getKontoSummary: async (vereinId: number, jahr: number): Promise<KassenbuchKontoSummaryDto[]> => {
    return api.get<KassenbuchKontoSummaryDto[]>(`/api/Kassenbuch/verein/${vereinId}/jahr/${jahr}/konto-summary`);
  },

  // Create new entry
  create: async (data: CreateKassenbuchDto): Promise<KassenbuchDto> => {
    return api.post<KassenbuchDto>('/api/Kassenbuch', data);
  },

  // Update entry
  update: async (id: number, data: UpdateKassenbuchDto): Promise<KassenbuchDto> => {
    return api.put<KassenbuchDto>(`/api/Kassenbuch/${id}`, data);
  },

  // Delete entry
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/Kassenbuch/${id}`);
  },

  // Storno (cancel) entry
  storno: async (id: number, stornoGrund: string): Promise<KassenbuchDto> => {
    return api.post<KassenbuchDto>(`/api/Kassenbuch/${id}/storno`, stornoGrund);
  },
};

// ============================================================================
// KASSENBUCH JAHRESABSCHLUSS SERVICE
// ============================================================================

export const kassenbuchJahresabschlussService = {
  // Get all year-end closings
  getAll: async (includeDeleted = false): Promise<KassenbuchJahresabschlussDto[]> => {
    return api.get<KassenbuchJahresabschlussDto[]>(`/api/KassenbuchJahresabschluss?includeDeleted=${includeDeleted}`);
  },

  // Get by ID
  getById: async (id: number): Promise<KassenbuchJahresabschlussDto> => {
    return api.get<KassenbuchJahresabschlussDto>(`/api/KassenbuchJahresabschluss/${id}`);
  },

  // Get by Verein
  getByVerein: async (vereinId: number): Promise<KassenbuchJahresabschlussDto[]> => {
    return api.get<KassenbuchJahresabschlussDto[]>(`/api/KassenbuchJahresabschluss/verein/${vereinId}`);
  },

  // Get by Verein and year
  getByVereinAndJahr: async (vereinId: number, jahr: number): Promise<KassenbuchJahresabschlussDto> => {
    return api.get<KassenbuchJahresabschlussDto>(`/api/KassenbuchJahresabschluss/verein/${vereinId}/jahr/${jahr}`);
  },

  // Get latest
  getLatest: async (vereinId: number): Promise<KassenbuchJahresabschlussDto> => {
    return api.get<KassenbuchJahresabschlussDto>(`/api/KassenbuchJahresabschluss/verein/${vereinId}/latest`);
  },

  // Create
  create: async (data: CreateKassenbuchJahresabschlussDto): Promise<KassenbuchJahresabschlussDto> => {
    return api.post<KassenbuchJahresabschlussDto>('/api/KassenbuchJahresabschluss', data);
  },

  // Calculate and create automatically
  calculateAndCreate: async (vereinId: number, jahr: number): Promise<KassenbuchJahresabschlussDto> => {
    return api.post<KassenbuchJahresabschlussDto>(`/api/KassenbuchJahresabschluss/verein/${vereinId}/calculate/${jahr}`, {});
  },

  // Update
  update: async (id: number, data: UpdateKassenbuchJahresabschlussDto): Promise<KassenbuchJahresabschlussDto> => {
    return api.put<KassenbuchJahresabschlussDto>(`/api/KassenbuchJahresabschluss/${id}`, data);
  },

  // Mark as audited
  markAsAudited: async (id: number, auditorName: string): Promise<KassenbuchJahresabschlussDto> => {
    return api.post<KassenbuchJahresabschlussDto>(`/api/KassenbuchJahresabschluss/${id}/audit`, auditorName);
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/KassenbuchJahresabschluss/${id}`);
  },
};

// ============================================================================
// SPENDEN PROTOKOLL SERVICE
// ============================================================================

export const spendenProtokollService = {
  // Get all protocols
  getAll: async (includeDeleted = false): Promise<SpendenProtokollDto[]> => {
    return api.get<SpendenProtokollDto[]>(`/api/SpendenProtokoll?includeDeleted=${includeDeleted}`);
  },

  // Get by ID
  getById: async (id: number): Promise<SpendenProtokollDto> => {
    return api.get<SpendenProtokollDto>(`/api/SpendenProtokoll/${id}`);
  },

  // Get by Verein
  getByVerein: async (vereinId: number): Promise<SpendenProtokollDto[]> => {
    return api.get<SpendenProtokollDto[]>(`/api/SpendenProtokoll/verein/${vereinId}`);
  },

  // Get by date range
  getByDateRange: async (vereinId: number, fromDate: string, toDate: string): Promise<SpendenProtokollDto[]> => {
    return api.get<SpendenProtokollDto[]>(`/api/SpendenProtokoll/verein/${vereinId}/daterange?fromDate=${fromDate}&toDate=${toDate}`);
  },

  // Get by category
  getByKategorie: async (vereinId: number, kategorie: string): Promise<SpendenProtokollDto[]> => {
    return api.get<SpendenProtokollDto[]>(`/api/SpendenProtokoll/verein/${vereinId}/kategorie/${kategorie}`);
  },

  // Get total amount
  getTotalAmount: async (vereinId: number, fromDate?: string, toDate?: string): Promise<number> => {
    let params = '';
    if (fromDate) params += `?fromDate=${fromDate}`;
    if (toDate) params += `${params ? '&' : '?'}toDate=${toDate}`;
    return api.get<number>(`/api/SpendenProtokoll/verein/${vereinId}/total${params}`);
  },

  // Get category summary
  getKategorieSummary: async (vereinId: number, jahr?: number): Promise<SpendenKategorieSummaryDto[]> => {
    const params = jahr ? `?jahr=${jahr}` : '';
    return api.get<SpendenKategorieSummaryDto[]>(`/api/SpendenProtokoll/verein/${vereinId}/summary${params}`);
  },

  // Create
  create: async (data: CreateSpendenProtokollDto): Promise<SpendenProtokollDto> => {
    return api.post<SpendenProtokollDto>('/api/SpendenProtokoll', data);
  },

  // Update
  update: async (id: number, data: UpdateSpendenProtokollDto): Promise<SpendenProtokollDto> => {
    return api.put<SpendenProtokollDto>(`/api/SpendenProtokoll/${id}`, data);
  },

  // Sign (witness signature)
  sign: async (id: number, zeugeNumber: number): Promise<SpendenProtokollDto> => {
    return api.post<SpendenProtokollDto>(`/api/SpendenProtokoll/${id}/sign/${zeugeNumber}`, {});
  },

  // Link to Kassenbuch
  linkToKassenbuch: async (id: number, kassenbuchId: number): Promise<SpendenProtokollDto> => {
    return api.post<SpendenProtokollDto>(`/api/SpendenProtokoll/${id}/link-kassenbuch/${kassenbuchId}`, {});
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/SpendenProtokoll/${id}`);
  },
};

// ============================================================================
// DURCHLAUFENDE POSTEN SERVICE
// ============================================================================

export const durchlaufendePostenService = {
  // Get all
  getAll: async (includeDeleted = false): Promise<DurchlaufendePostenDto[]> => {
    return api.get<DurchlaufendePostenDto[]>(`/api/DurchlaufendePosten?includeDeleted=${includeDeleted}`);
  },

  // Get by ID
  getById: async (id: number): Promise<DurchlaufendePostenDto> => {
    return api.get<DurchlaufendePostenDto>(`/api/DurchlaufendePosten/${id}`);
  },

  // Get by Verein
  getByVerein: async (vereinId: number): Promise<DurchlaufendePostenDto[]> => {
    return api.get<DurchlaufendePostenDto[]>(`/api/DurchlaufendePosten/verein/${vereinId}`);
  },

  // Get by status
  getByStatus: async (vereinId: number, status: string): Promise<DurchlaufendePostenDto[]> => {
    return api.get<DurchlaufendePostenDto[]>(`/api/DurchlaufendePosten/verein/${vereinId}/status/${status}`);
  },

  // Get open items
  getOpen: async (vereinId: number): Promise<DurchlaufendePostenDto[]> => {
    return api.get<DurchlaufendePostenDto[]>(`/api/DurchlaufendePosten/verein/${vereinId}/open`);
  },

  // Get by FiBuKonto
  getByFiBuKonto: async (vereinId: number, fiBuNummer: string): Promise<DurchlaufendePostenDto[]> => {
    return api.get<DurchlaufendePostenDto[]>(`/api/DurchlaufendePosten/verein/${vereinId}/konto/${fiBuNummer}`);
  },

  // Get total open amount
  getTotalOpenAmount: async (vereinId: number): Promise<number> => {
    return api.get<number>(`/api/DurchlaufendePosten/verein/${vereinId}/total-open`);
  },

  // Get summary by recipient
  getEmpfaengerSummary: async (vereinId: number): Promise<DurchlaufendePostenSummaryDto[]> => {
    return api.get<DurchlaufendePostenSummaryDto[]>(`/api/DurchlaufendePosten/verein/${vereinId}/empfaenger-summary`);
  },

  // Create
  create: async (data: CreateDurchlaufendePostenDto): Promise<DurchlaufendePostenDto> => {
    return api.post<DurchlaufendePostenDto>('/api/DurchlaufendePosten', data);
  },

  // Update
  update: async (id: number, data: UpdateDurchlaufendePostenDto): Promise<DurchlaufendePostenDto> => {
    return api.put<DurchlaufendePostenDto>(`/api/DurchlaufendePosten/${id}`, data);
  },

  // Close (mark as transferred)
  close: async (id: number, ausgabenDatum: string, ausgabenBetrag: number, referenz?: string): Promise<DurchlaufendePostenDto> => {
    let params = `?ausgabenDatum=${ausgabenDatum}&ausgabenBetrag=${ausgabenBetrag}`;
    if (referenz) params += `&referenz=${encodeURIComponent(referenz)}`;
    return api.post<DurchlaufendePostenDto>(`/api/DurchlaufendePosten/${id}/close${params}`, {});
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/DurchlaufendePosten/${id}`);
  },
};

