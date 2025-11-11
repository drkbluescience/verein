import { api } from './api';
import {
  MitgliedDto,
  CreateMitgliedDto,
  UpdateMitgliedDto,
  MitgliedAdresseDto,
  CreateMitgliedAdresseDto,
  MitgliedFamilieDto,
  CreateMitgliedFamilieDto,
  CreateMitgliedWithAddressRequest,
  TransferMitgliedRequest,
  SetActiveStatusRequest,
  MembershipStatistics,
  PagedResult,
  MitgliedSearchParams
} from '../types/mitglied';

// Mitglieder CRUD Operations
export const mitgliedService = {
  // Get all Mitglieder with pagination
  getAll: async (params: MitgliedSearchParams = {}): Promise<PagedResult<MitgliedDto>> => {
    const queryParams = new URLSearchParams();

    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    return await api.get<PagedResult<MitgliedDto>>(`/api/Mitglieder?${queryParams}`);
  },

  // Get Mitglied by ID
  getById: async (id: number): Promise<MitgliedDto> => {
    return await api.get<MitgliedDto>(`/api/Mitglieder/${id}`);
  },

  // Get Mitglieder by Verein ID
  getByVereinId: async (vereinId: number, activeOnly: boolean = true): Promise<MitgliedDto[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('activeOnly', activeOnly.toString());

    return await api.get<MitgliedDto[]>(`/api/Mitglieder/verein/${vereinId}?${queryParams}`);
  },

  // Create new Mitglied
  create: async (mitglied: CreateMitgliedDto): Promise<MitgliedDto> => {
    return await api.post<MitgliedDto>('/api/Mitglieder', mitglied);
  },

  // Create Mitglied with Address
  createWithAddress: async (request: CreateMitgliedWithAddressRequest): Promise<MitgliedDto> => {
    return await api.post<MitgliedDto>('/api/Mitglieder/with-address', request);
  },

  // Update Mitglied
  update: async (id: number, mitglied: UpdateMitgliedDto): Promise<MitgliedDto> => {
    return await api.put<MitgliedDto>(`/api/Mitglieder/${id}`, mitglied);
  },

  // Delete Mitglied
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/Mitglieder/${id}`);
  },

  // Transfer Mitglied to another Verein
  transfer: async (id: number, request: TransferMitgliedRequest): Promise<MitgliedDto> => {
    return await api.post<MitgliedDto>(`/api/Mitglieder/${id}/transfer`, request);
  },

  // Set active status
  setActiveStatus: async (id: number, request: SetActiveStatusRequest): Promise<MitgliedDto> => {
    return await api.post<MitgliedDto>(`/api/Mitglieder/${id}/set-active`, request);
  },

  // Search Mitglieder
  search: async (searchTerm: string, vereinId?: number): Promise<MitgliedDto[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('searchTerm', searchTerm);
    if (vereinId) queryParams.append('vereinId', vereinId.toString());

    return await api.get<MitgliedDto[]>(`/api/Mitglieder/search?${queryParams}`);
  },

  // Get membership statistics for a Verein
  getMembershipStatistics: async (vereinId: number): Promise<MembershipStatistics> => {
    return await api.get<MembershipStatistics>(`/api/Mitglieder/statistics/verein/${vereinId}`);
  }
};

// MitgliedAdresse Operations
export const mitgliedAdresseService = {
  // Get all addresses with pagination
  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<MitgliedAdresseDto>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('pageNumber', pageNumber.toString());
    queryParams.append('pageSize', pageSize.toString());

    return await api.get<PagedResult<MitgliedAdresseDto>>(`/api/MitgliedAdressen?${queryParams}`);
  },

  // Get all addresses for a Mitglied
  getByMitgliedId: async (mitgliedId: number, activeOnly: boolean = true): Promise<MitgliedAdresseDto[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('activeOnly', activeOnly.toString());

    return await api.get<MitgliedAdresseDto[]>(`/api/MitgliedAdressen/mitglied/${mitgliedId}?${queryParams}`);
  },

  // Get standard address for a Mitglied
  getStandardAddress: async (mitgliedId: number): Promise<MitgliedAdresseDto> => {
    return await api.get<MitgliedAdresseDto>(`/api/MitgliedAdressen/mitglied/${mitgliedId}/standard`);
  },

  // Get address by ID
  getById: async (id: number): Promise<MitgliedAdresseDto> => {
    return await api.get<MitgliedAdresseDto>(`/api/MitgliedAdressen/${id}`);
  },

  // Create new address
  create: async (adresse: CreateMitgliedAdresseDto): Promise<MitgliedAdresseDto> => {
    return await api.post<MitgliedAdresseDto>('/api/MitgliedAdressen', adresse);
  },

  // Update address
  update: async (id: number, adresse: Partial<CreateMitgliedAdresseDto>): Promise<MitgliedAdresseDto> => {
    return await api.put<MitgliedAdresseDto>(`/api/MitgliedAdressen/${id}`, adresse);
  },

  // Delete address
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/MitgliedAdressen/${id}`);
  },

  // Set as standard address
  setAsStandardAddress: async (mitgliedId: number, addressId: number): Promise<MitgliedAdresseDto> => {
    return await api.post<MitgliedAdresseDto>(`/api/MitgliedAdressen/${mitgliedId}/address/${addressId}/set-standard`);
  },

  // Get address statistics
  getAddressStatistics: async (mitgliedId: number): Promise<any> => {
    return await api.get(`/api/MitgliedAdressen/statistics/mitglied/${mitgliedId}`);
  },

  // Set as default address (deprecated - use setAsStandardAddress)
  setAsDefault: async (id: number): Promise<MitgliedAdresseDto> => {
    return await api.post<MitgliedAdresseDto>(`/api/MitgliedAdressen/${id}/set-default`);
  }
};

// MitgliedFamilie Operations
export const mitgliedFamilieService = {
  // Get all family relationships with pagination
  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<MitgliedFamilieDto>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('pageNumber', pageNumber.toString());
    queryParams.append('pageSize', pageSize.toString());

    return await api.get<PagedResult<MitgliedFamilieDto>>(`/api/MitgliedFamilien?${queryParams}`);
  },

  // Get family relationship by ID
  getById: async (id: number): Promise<MitgliedFamilieDto> => {
    return await api.get<MitgliedFamilieDto>(`/api/MitgliedFamilien/${id}`);
  },

  // Get family relationships for a Mitglied
  getByMitgliedId: async (mitgliedId: number, activeOnly: boolean = true): Promise<MitgliedFamilieDto[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('activeOnly', activeOnly.toString());

    return await api.get<MitgliedFamilieDto[]>(`/api/MitgliedFamilien/mitglied/${mitgliedId}?${queryParams}`);
  },

  // Get children of a Mitglied
  getChildren: async (parentMitgliedId: number): Promise<MitgliedDto[]> => {
    return await api.get<MitgliedDto[]>(`/api/MitgliedFamilien/mitglied/${parentMitgliedId}/children`);
  },

  // Get parents of a Mitglied
  getParents: async (mitgliedId: number): Promise<MitgliedDto[]> => {
    return await api.get<MitgliedDto[]>(`/api/MitgliedFamilien/mitglied/${mitgliedId}/parents`);
  },

  // Get siblings of a Mitglied
  getSiblings: async (mitgliedId: number): Promise<MitgliedDto[]> => {
    return await api.get<MitgliedDto[]>(`/api/MitgliedFamilien/mitglied/${mitgliedId}/siblings`);
  },

  // Get family tree
  getFamilyTree: async (mitgliedId: number, maxDepth: number = 3): Promise<any> => {
    const queryParams = new URLSearchParams();
    queryParams.append('maxDepth', maxDepth.toString());

    return await api.get(`/api/MitgliedFamilien/mitglied/${mitgliedId}/family-tree?${queryParams}`);
  },

  // Get family statistics
  getFamilyStatistics: async (mitgliedId: number): Promise<any> => {
    return await api.get(`/api/MitgliedFamilien/statistics/mitglied/${mitgliedId}`);
  },

  // Create family relationship
  create: async (relationship: CreateMitgliedFamilieDto): Promise<MitgliedFamilieDto> => {
    return await api.post<MitgliedFamilieDto>('/api/MitgliedFamilien', relationship);
  },

  // Update family relationship
  update: async (id: number, relationship: Partial<CreateMitgliedFamilieDto>): Promise<MitgliedFamilieDto> => {
    return await api.put<MitgliedFamilieDto>(`/api/MitgliedFamilien/${id}`, relationship);
  },

  // Delete family relationship
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/MitgliedFamilien/${id}`);
  }
};

// Utility functions
export const mitgliedUtils = {
  // Get full name
  getFullName: (mitglied: MitgliedDto): string => {
    return `${mitglied.vorname} ${mitglied.nachname}`.trim();
  },

  // Calculate age
  calculateAge: (geburtsdatum?: string): number | undefined => {
    if (!geburtsdatum) return undefined;
    
    const birthDate = new Date(geburtsdatum);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  // Get membership duration data (returns object for i18n formatting)
  getMembershipDuration: (eintrittsdatum?: string): { value: number; unit: 'years' | 'months' | 'new' | 'unknown' } => {
    if (!eintrittsdatum) return { value: 0, unit: 'unknown' };

    const joinDate = new Date(eintrittsdatum);
    const today = new Date();
    const years = today.getFullYear() - joinDate.getFullYear();
    const months = today.getMonth() - joinDate.getMonth();

    if (years > 0) {
      return { value: years, unit: 'years' };
    } else if (months > 0) {
      return { value: months, unit: 'months' };
    } else {
      return { value: 0, unit: 'new' };
    }
  },

  // Get status display text
  getStatusText: (mitglied: MitgliedDto): string => {
    if (mitglied.austrittsdatum) return 'Ayrılmış';
    if (mitglied.aktiv === false) return 'Pasif';
    return 'Aktif';
  },

  // Get status color
  getStatusColor: (mitglied: MitgliedDto): 'success' | 'warning' | 'error' => {
    if (mitglied.austrittsdatum) return 'error';
    if (mitglied.aktiv === false) return 'warning';
    return 'success';
  }
};
