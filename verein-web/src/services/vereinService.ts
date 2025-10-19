import api from './api';
import {
  VereinDto,
  CreateVereinDto,
  UpdateVereinDto,
  AdresseDto,
  CreateAdresseDto,
  BankkontoDto,
  CreateBankkontoDto
} from '../types/verein';

// Verein Service
export const vereinService = {
  // Get all Vereine
  getAll: async (): Promise<VereinDto[]> => {
    return api.get<VereinDto[]>('/api/Vereine');
  },

  // Get Verein by ID
  getById: async (id: number): Promise<VereinDto> => {
    return api.get<VereinDto>(`/api/Vereine/${id}`);
  },

  // Get active Vereine
  getActive: async (): Promise<VereinDto[]> => {
    return api.get<VereinDto[]>('/api/Vereine/active');
  },

  // Create new Verein
  create: async (verein: CreateVereinDto): Promise<VereinDto> => {
    return api.post<VereinDto>('/api/Vereine', verein);
  },

  // Update Verein
  update: async (id: number, verein: UpdateVereinDto): Promise<VereinDto> => {
    return api.put<VereinDto>(`/api/Vereine/${id}`, verein);
  },

  // Delete Verein (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/Vereine/${id}`);
  },

  // Get full details with related data
  getFullDetails: async (id: number): Promise<VereinDto> => {
    return api.get<VereinDto>(`/api/Vereine/${id}/full-details`);
  },
};

// Adresse Service
export const adresseService = {
  // Get all Adressen
  getAll: async (): Promise<AdresseDto[]> => {
    return api.get<AdresseDto[]>('/api/Adressen');
  },

  // Get Adresse by ID
  getById: async (id: number): Promise<AdresseDto> => {
    return api.get<AdresseDto>(`/api/Adressen/${id}`);
  },

  // Get Adressen by Verein ID
  getByVereinId: async (vereinId: number): Promise<AdresseDto[]> => {
    return api.get<AdresseDto[]>(`/api/Adressen/verein/${vereinId}`);
  },

  // Create new Adresse
  create: async (adresse: CreateAdresseDto): Promise<AdresseDto> => {
    return api.post<AdresseDto>('/api/Adressen', adresse);
  },

  // Update Adresse
  update: async (id: number, adresse: Partial<CreateAdresseDto>): Promise<AdresseDto> => {
    return api.put<AdresseDto>(`/api/Adressen/${id}`, adresse);
  },

  // Delete Adresse (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/Adressen/${id}`);
  },
};

// Bankkonto Service
export const bankkontoService = {
  // Get all Bankkonten
  getAll: async (): Promise<BankkontoDto[]> => {
    return api.get<BankkontoDto[]>('/api/Bankkonten');
  },

  // Get Bankkonto by ID
  getById: async (id: number): Promise<BankkontoDto> => {
    return api.get<BankkontoDto>(`/api/Bankkonten/${id}`);
  },

  // Get Bankkonten by Verein ID
  getByVereinId: async (vereinId: number): Promise<BankkontoDto[]> => {
    return api.get<BankkontoDto[]>(`/api/Bankkonten/verein/${vereinId}`);
  },

  // Create new Bankkonto
  create: async (bankkonto: CreateBankkontoDto): Promise<BankkontoDto> => {
    return api.post<BankkontoDto>('/api/Bankkonten', bankkonto);
  },

  // Update Bankkonto
  update: async (id: number, bankkonto: Partial<CreateBankkontoDto>): Promise<BankkontoDto> => {
    return api.put<BankkontoDto>(`/api/Bankkonten/${id}`, bankkonto);
  },

  // Delete Bankkonto (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/Bankkonten/${id}`);
  },
};

// Health Service
export const healthService = {
  // Basic health check
  check: async (): Promise<any> => {
    return api.get('/api/health');
  },

  // Detailed health check
  detailed: async (): Promise<any> => {
    return api.get('/api/health/detailed');
  },
};

// Export all services
const services = {
  verein: vereinService,
  adresse: adresseService,
  bankkonto: bankkontoService,
  health: healthService,
};

export default services;
