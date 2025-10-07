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
  }
};

// MitgliedAdresse Operations
export const mitgliedAdresseService = {
  // Get all addresses for a Mitglied
  getByMitgliedId: async (mitgliedId: number, activeOnly: boolean = true): Promise<MitgliedAdresseDto[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('activeOnly', activeOnly.toString());

    return await api.get<MitgliedAdresseDto[]>(`/api/MitgliedAdressen/mitglied/${mitgliedId}?${queryParams}`);
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

  // Set as default address
  setAsDefault: async (id: number): Promise<MitgliedAdresseDto> => {
    return await api.post<MitgliedAdresseDto>(`/api/MitgliedAdressen/${id}/set-default`);
  }
};

// MitgliedFamilie Operations
export const mitgliedFamilieService = {
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

  // Get family tree
  getFamilyTree: async (mitgliedId: number): Promise<any> => {
    return await api.get(`/api/MitgliedFamilien/mitglied/${mitgliedId}/family-tree`);
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

  // Format membership duration
  getMembershipDuration: (eintrittsdatum?: string): string => {
    if (!eintrittsdatum) return 'Bilinmiyor';
    
    const joinDate = new Date(eintrittsdatum);
    const today = new Date();
    const years = today.getFullYear() - joinDate.getFullYear();
    const months = today.getMonth() - joinDate.getMonth();
    
    if (years > 0) {
      return `${years} yıl`;
    } else if (months > 0) {
      return `${months} ay`;
    } else {
      return 'Yeni üye';
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
