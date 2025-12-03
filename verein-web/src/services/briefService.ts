import { api } from './api';
import {
  BriefVorlageDto,
  CreateBriefVorlageDto,
  UpdateBriefVorlageDto,
  BriefDto,
  CreateBriefDto,
  UpdateBriefDto,
  SendBriefDto,
  QuickSendBriefDto,
  NachrichtDto,
  BriefStatisticsDto,
  BriefVorlageKategorie
} from '../types/brief.types';

// ==================== Brief Vorlage (Template) Service ====================

export const briefVorlageService = {
  /**
   * Get all templates for a specific Verein
   */
  getByVereinId: async (vereinId: number): Promise<BriefVorlageDto[]> => {
    return api.get<BriefVorlageDto[]>(`/api/BriefVorlagen/verein/${vereinId}`);
  },

  /**
   * Get all active templates for a specific Verein
   */
  getActiveByVereinId: async (vereinId: number): Promise<BriefVorlageDto[]> => {
    return api.get<BriefVorlageDto[]>(`/api/BriefVorlagen/verein/${vereinId}/active`);
  },

  /**
   * Get all templates (deprecated - use getByVereinId instead)
   */
  getAll: async (): Promise<BriefVorlageDto[]> => {
    // This endpoint doesn't exist on backend, kept for backward compatibility
    // Will return empty array
    console.warn('briefVorlageService.getAll() is deprecated. Use getByVereinId() instead.');
    return [];
  },

  /**
   * Get template by ID
   */
  getById: async (id: number): Promise<BriefVorlageDto> => {
    return api.get<BriefVorlageDto>(`/api/BriefVorlagen/${id}`);
  },

  /**
   * Get templates by category
   */
  getByCategory: async (kategorie: BriefVorlageKategorie): Promise<BriefVorlageDto[]> => {
    return api.get<BriefVorlageDto[]>(`/api/BriefVorlagen/kategorie/${kategorie}`);
  },

  /**
   * Get all available categories
   */
  getCategories: async (): Promise<string[]> => {
    return api.get<string[]>('/api/BriefVorlagen/kategorien');
  },

  /**
   * Create a new template
   */
  create: async (data: CreateBriefVorlageDto): Promise<BriefVorlageDto> => {
    return api.post<BriefVorlageDto>('/api/BriefVorlagen', data);
  },

  /**
   * Update a template
   */
  update: async (id: number, data: UpdateBriefVorlageDto): Promise<BriefVorlageDto> => {
    return api.put<BriefVorlageDto>(`/api/BriefVorlagen/${id}`, data);
  },

  /**
   * Delete a template (soft delete)
   */
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/BriefVorlagen/${id}`);
  },
};

// ==================== Brief (Letter Draft) Service ====================

export const briefService = {
  /**
   * Get all letters for a Verein
   */
  getByVereinId: async (vereinId: number): Promise<BriefDto[]> => {
    return api.get<BriefDto[]>(`/api/Briefe/verein/${vereinId}`);
  },

  /**
   * Get letter by ID
   */
  getById: async (id: number): Promise<BriefDto> => {
    return api.get<BriefDto>(`/api/Briefe/${id}`);
  },

  /**
   * Get draft letters for a Verein
   */
  getDraftsByVereinId: async (vereinId: number): Promise<BriefDto[]> => {
    return api.get<BriefDto[]>(`/api/Briefe/verein/${vereinId}/drafts`);
  },

  /**
   * Get sent letters for a Verein
   */
  getSentByVereinId: async (vereinId: number): Promise<BriefDto[]> => {
    return api.get<BriefDto[]>(`/api/Briefe/verein/${vereinId}/sent`);
  },

  /**
   * Get letter statistics for a Verein
   */
  getStatisticsByVereinId: async (vereinId: number): Promise<BriefStatisticsDto> => {
    return api.get<BriefStatisticsDto>(`/api/Briefe/verein/${vereinId}/statistics`);
  },

  /**
   * Create a new letter draft
   */
  create: async (data: CreateBriefDto): Promise<BriefDto> => {
    return api.post<BriefDto>('/api/Briefe', data);
  },

  /**
   * Update a letter draft
   */
  update: async (id: number, data: UpdateBriefDto): Promise<BriefDto> => {
    return api.put<BriefDto>(`/api/Briefe/${id}`, data);
  },

  /**
   * Delete a letter (soft delete)
   */
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/Briefe/${id}`);
  },

  /**
   * Send a letter to selected members
   */
  send: async (data: SendBriefDto): Promise<NachrichtDto[]> => {
    return api.post<NachrichtDto[]>('/api/Briefe/send', data);
  },

  /**
   * Create and send a letter in one step
   */
  quickSend: async (data: QuickSendBriefDto): Promise<NachrichtDto[]> => {
    return api.post<NachrichtDto[]>('/api/Briefe/quick-send', data);
  },

  /**
   * Preview letter content with placeholder replacement
   */
  preview: async (briefId: number, mitgliedId: number): Promise<string> => {
    return api.get<string>(`/api/Briefe/${briefId}/vorschau/${mitgliedId}`);
  },
};

