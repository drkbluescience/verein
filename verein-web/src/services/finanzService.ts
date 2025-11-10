/**
 * Finanz Services
 * API services for financial management (payments, claims, bank transactions)
 */

import api from './api';
import {
  BankkontoDto,
  CreateBankkontoDto,
  UpdateBankkontoDto,
  BankBuchungDto,
  CreateBankBuchungDto,
  UpdateBankBuchungDto,
  BankUploadResponseDto,
  MitgliedForderungDto,
  CreateMitgliedForderungDto,
  UpdateMitgliedForderungDto,
  MitgliedZahlungDto,
  CreateMitgliedZahlungDto,
  UpdateMitgliedZahlungDto,
  MitgliedForderungZahlungDto,
  CreateMitgliedForderungZahlungDto,
  MitgliedVorauszahlungDto,
  CreateMitgliedVorauszahlungDto,
  VeranstaltungZahlungDto,
  CreateVeranstaltungZahlungDto,
  UpdateVeranstaltungZahlungDto,
} from '../types/finanz.types';

// ============================================================================
// BANKKONTO SERVICE
// ============================================================================

export const bankkontoService = {
  // Get all bank accounts
  getAll: async (): Promise<BankkontoDto[]> => {
    return api.get<BankkontoDto[]>('/api/Bankkonten');
  },

  // Get bank account by ID
  getById: async (id: number): Promise<BankkontoDto> => {
    return api.get<BankkontoDto>(`/api/Bankkonten/${id}`);
  },

  // Get bank accounts by Verein ID
  getByVereinId: async (vereinId: number): Promise<BankkontoDto[]> => {
    return api.get<BankkontoDto[]>(`/api/Bankkonten/verein/${vereinId}`);
  },

  // Create new bank account
  create: async (data: CreateBankkontoDto): Promise<BankkontoDto> => {
    return api.post<BankkontoDto>('/api/Bankkonten', data);
  },

  // Update bank account
  update: async (id: number, data: UpdateBankkontoDto): Promise<BankkontoDto> => {
    return api.put<BankkontoDto>(`/api/Bankkonten/${id}`, data);
  },

  // Delete bank account
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/Bankkonten/${id}`);
  },
};

// ============================================================================
// BANK BUCHUNG SERVICE
// ============================================================================

export const bankBuchungService = {
  // Get all bank transactions
  getAll: async (): Promise<BankBuchungDto[]> => {
    return api.get<BankBuchungDto[]>('/api/BankBuchungen');
  },

  // Get bank transaction by ID
  getById: async (id: number): Promise<BankBuchungDto> => {
    return api.get<BankBuchungDto>(`/api/BankBuchungen/${id}`);
  },

  // Get bank transactions by Verein ID
  getByVereinId: async (vereinId: number): Promise<BankBuchungDto[]> => {
    return api.get<BankBuchungDto[]>(`/api/BankBuchungen/verein/${vereinId}`);
  },

  // Create new bank transaction
  create: async (data: CreateBankBuchungDto): Promise<BankBuchungDto> => {
    return api.post<BankBuchungDto>('/api/BankBuchungen', data);
  },

  // Update bank transaction
  update: async (id: number, data: UpdateBankBuchungDto): Promise<BankBuchungDto> => {
    return api.put<BankBuchungDto>(`/api/BankBuchungen/${id}`, data);
  },

  // Delete bank transaction (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/BankBuchungen/${id}`);
  },

  // Upload Excel file with bank transactions
  uploadExcel: async (vereinId: number, bankKontoId: number, file: File): Promise<BankUploadResponseDto> => {
    const formData = new FormData();
    formData.append('vereinId', vereinId.toString());
    formData.append('bankKontoId', bankKontoId.toString());
    formData.append('file', file);

    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5103'}/api/BankBuchungen/upload-excel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },
};

// ============================================================================
// MITGLIED FORDERUNG SERVICE
// ============================================================================

export const mitgliedForderungService = {
  // Get all claims
  getAll: async (): Promise<MitgliedForderungDto[]> => {
    return api.get<MitgliedForderungDto[]>('/api/MitgliedForderungen');
  },

  // Get claim by ID
  getById: async (id: number): Promise<MitgliedForderungDto> => {
    return api.get<MitgliedForderungDto>(`/api/MitgliedForderungen/${id}`);
  },

  // Get claims by Mitglied ID
  getByMitgliedId: async (mitgliedId: number): Promise<MitgliedForderungDto[]> => {
    return api.get<MitgliedForderungDto[]>(`/api/MitgliedForderungen/mitglied/${mitgliedId}`);
  },

  // Get unpaid claims by Verein ID
  getUnpaid: async (vereinId: number): Promise<MitgliedForderungDto[]> => {
    return api.get<MitgliedForderungDto[]>(`/api/MitgliedForderungen/verein/${vereinId}/unpaid`);
  },

  // Get overdue claims by Verein ID
  getOverdue: async (vereinId: number): Promise<MitgliedForderungDto[]> => {
    return api.get<MitgliedForderungDto[]>(`/api/MitgliedForderungen/verein/${vereinId}/overdue`);
  },

  // Create new claim
  create: async (data: CreateMitgliedForderungDto): Promise<MitgliedForderungDto> => {
    return api.post<MitgliedForderungDto>('/api/MitgliedForderungen', data);
  },

  // Update claim
  update: async (id: number, data: UpdateMitgliedForderungDto): Promise<MitgliedForderungDto> => {
    return api.put<MitgliedForderungDto>(`/api/MitgliedForderungen/${id}`, data);
  },

  // Delete claim (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/MitgliedForderungen/${id}`);
  },
};

// ============================================================================
// MITGLIED ZAHLUNG SERVICE
// ============================================================================

export const mitgliedZahlungService = {
  // Get all payments
  getAll: async (): Promise<MitgliedZahlungDto[]> => {
    return api.get<MitgliedZahlungDto[]>('/api/MitgliedZahlungen');
  },

  // Get payment by ID
  getById: async (id: number): Promise<MitgliedZahlungDto> => {
    return api.get<MitgliedZahlungDto>(`/api/MitgliedZahlungen/${id}`);
  },

  // Get payments by Mitglied ID
  getByMitgliedId: async (mitgliedId: number): Promise<MitgliedZahlungDto[]> => {
    return api.get<MitgliedZahlungDto[]>(`/api/MitgliedZahlungen/mitglied/${mitgliedId}`);
  },

  // Get payments by date range
  getByDateRange: async (
    vereinId: number,
    startDate: string,
    endDate: string
  ): Promise<MitgliedZahlungDto[]> => {
    return api.get<MitgliedZahlungDto[]>(
      `/api/MitgliedZahlungen/verein/${vereinId}/date-range?startDate=${startDate}&endDate=${endDate}`
    );
  },

  // Create new payment
  create: async (data: CreateMitgliedZahlungDto): Promise<MitgliedZahlungDto> => {
    return api.post<MitgliedZahlungDto>('/api/MitgliedZahlungen', data);
  },

  // Update payment
  update: async (id: number, data: UpdateMitgliedZahlungDto): Promise<MitgliedZahlungDto> => {
    return api.put<MitgliedZahlungDto>(`/api/MitgliedZahlungen/${id}`, data);
  },

  // Delete payment (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/MitgliedZahlungen/${id}`);
  },
};

// ============================================================================
// MITGLIED FORDERUNG ZAHLUNG SERVICE
// ============================================================================

export const mitgliedForderungZahlungService = {
  // Get all allocations
  getAll: async (): Promise<MitgliedForderungZahlungDto[]> => {
    return api.get<MitgliedForderungZahlungDto[]>('/api/MitgliedForderungZahlungen');
  },

  // Get allocation by ID
  getById: async (id: number): Promise<MitgliedForderungZahlungDto> => {
    return api.get<MitgliedForderungZahlungDto>(`/api/MitgliedForderungZahlungen/${id}`);
  },

  // Create new allocation
  create: async (data: CreateMitgliedForderungZahlungDto): Promise<MitgliedForderungZahlungDto> => {
    return api.post<MitgliedForderungZahlungDto>('/api/MitgliedForderungZahlungen', data);
  },

  // Delete allocation (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/MitgliedForderungZahlungen/${id}`);
  },
};

// ============================================================================
// MITGLIED VORAUSZAHLUNG SERVICE
// ============================================================================

export const mitgliedVorauszahlungService = {
  // Get all advance payments
  getAll: async (): Promise<MitgliedVorauszahlungDto[]> => {
    return api.get<MitgliedVorauszahlungDto[]>('/api/MitgliedVorauszahlungen');
  },

  // Get advance payment by ID
  getById: async (id: number): Promise<MitgliedVorauszahlungDto> => {
    return api.get<MitgliedVorauszahlungDto>(`/api/MitgliedVorauszahlungen/${id}`);
  },

  // Get advance payments by Mitglied ID
  getByMitgliedId: async (mitgliedId: number): Promise<MitgliedVorauszahlungDto[]> => {
    return api.get<MitgliedVorauszahlungDto[]>(`/api/MitgliedVorauszahlungen/mitglied/${mitgliedId}`);
  },

  // Create new advance payment
  create: async (data: CreateMitgliedVorauszahlungDto): Promise<MitgliedVorauszahlungDto> => {
    return api.post<MitgliedVorauszahlungDto>('/api/MitgliedVorauszahlungen', data);
  },

  // Delete advance payment (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/MitgliedVorauszahlungen/${id}`);
  },
};

// ============================================================================
// VERANSTALTUNG ZAHLUNG SERVICE
// ============================================================================

export const veranstaltungZahlungService = {
  // Get all event payments
  getAll: async (): Promise<VeranstaltungZahlungDto[]> => {
    return api.get<VeranstaltungZahlungDto[]>('/api/VeranstaltungZahlungen');
  },

  // Get event payment by ID
  getById: async (id: number): Promise<VeranstaltungZahlungDto> => {
    return api.get<VeranstaltungZahlungDto>(`/api/VeranstaltungZahlungen/${id}`);
  },

  // Get event payments by Veranstaltung ID
  getByVeranstaltungId: async (veranstaltungId: number): Promise<VeranstaltungZahlungDto[]> => {
    return api.get<VeranstaltungZahlungDto[]>(`/api/VeranstaltungZahlungen/veranstaltung/${veranstaltungId}`);
  },

  // Create new event payment
  create: async (data: CreateVeranstaltungZahlungDto): Promise<VeranstaltungZahlungDto> => {
    return api.post<VeranstaltungZahlungDto>('/api/VeranstaltungZahlungen', data);
  },

  // Update event payment
  update: async (id: number, data: UpdateVeranstaltungZahlungDto): Promise<VeranstaltungZahlungDto> => {
    return api.put<VeranstaltungZahlungDto>(`/api/VeranstaltungZahlungen/${id}`, data);
  },

  // Delete event payment (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/VeranstaltungZahlungen/${id}`);
  },
};

// ============================================================================
// EXPORT ALL SERVICES
// ============================================================================

const finanzServices = {
  bankBuchung: bankBuchungService,
  mitgliedForderung: mitgliedForderungService,
  mitgliedZahlung: mitgliedZahlungService,
  mitgliedForderungZahlung: mitgliedForderungZahlungService,
  mitgliedVorauszahlung: mitgliedVorauszahlungService,
  veranstaltungZahlung: veranstaltungZahlungService,
};

export default finanzServices;

