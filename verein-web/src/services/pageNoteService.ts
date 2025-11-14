import { api } from './api';
import {
  PageNoteDto,
  CreatePageNoteDto,
  UpdatePageNoteDto,
  CompletePageNoteDto,
  PageNoteStatisticsDto,
  PageNoteStatus,
  PageNoteCategory,
  PageNotePriority
} from '../types/pageNote.types';

/**
 * PageNote Service
 * Handles all API calls for PageNote functionality
 */
export const pageNoteService = {
  // ==================== CRUD Operations ====================
  
  /**
   * Create a new page note
   */
  create: async (data: CreatePageNoteDto): Promise<PageNoteDto> => {
    return api.post<PageNoteDto>('/api/PageNotes', data);
  },

  /**
   * Get page note by ID
   */
  getById: async (id: number): Promise<PageNoteDto> => {
    return api.get<PageNoteDto>(`/api/PageNotes/${id}`);
  },

  /**
   * Get all page notes (Admin only)
   */
  getAll: async (includeDeleted: boolean = false): Promise<PageNoteDto[]> => {
    console.log('📞 pageNoteService.getAll() called with includeDeleted:', includeDeleted);
    const result = await api.get<PageNoteDto[]>('/api/PageNotes', { includeDeleted });
    console.log('📦 pageNoteService.getAll() returned:', result.length, 'notes');
    return result;
  },

  /**
   * Update page note
   */
  update: async (id: number, data: UpdatePageNoteDto): Promise<PageNoteDto> => {
    return api.put<PageNoteDto>(`/api/PageNotes/${id}`, data);
  },

  /**
   * Delete page note
   */
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/PageNotes/${id}`);
  },

  // ==================== Query Operations ====================

  /**
   * Get current user's notes
   */
  getMyNotes: async (): Promise<PageNoteDto[]> => {
    console.log('📞 pageNoteService.getMyNotes() called');
    const result = await api.get<PageNoteDto[]>('/api/PageNotes/my-notes');
    console.log('📦 pageNoteService.getMyNotes() returned:', result.length, 'notes');
    return result;
  },

  /**
   * Get notes by page URL
   */
  getByPageUrl: async (pageUrl: string): Promise<PageNoteDto[]> => {
    return api.get<PageNoteDto[]>('/api/PageNotes/page', { pageUrl });
  },

  /**
   * Get notes by entity
   */
  getByEntity: async (entityType: string, entityId: number): Promise<PageNoteDto[]> => {
    return api.get<PageNoteDto[]>(`/api/PageNotes/entity/${entityType}/${entityId}`);
  },

  /**
   * Get notes by status (Admin only)
   */
  getByStatus: async (status: PageNoteStatus): Promise<PageNoteDto[]> => {
    return api.get<PageNoteDto[]>(`/api/PageNotes/status/${status}`);
  },

  /**
   * Get notes by category (Admin only)
   */
  getByCategory: async (category: PageNoteCategory): Promise<PageNoteDto[]> => {
    return api.get<PageNoteDto[]>(`/api/PageNotes/category/${category}`);
  },

  /**
   * Get notes by priority (Admin only)
   */
  getByPriority: async (priority: PageNotePriority): Promise<PageNoteDto[]> => {
    return api.get<PageNoteDto[]>(`/api/PageNotes/priority/${priority}`);
  },

  // ==================== Admin Operations ====================

  /**
   * Complete a note (Admin only)
   */
  complete: async (id: number, data: CompletePageNoteDto): Promise<PageNoteDto> => {
    return api.patch<PageNoteDto>(`/api/PageNotes/${id}/complete`, data);
  },

  /**
   * Get statistics (Admin only)
   */
  getStatistics: async (): Promise<PageNoteStatisticsDto> => {
    return api.get<PageNoteStatisticsDto>('/api/PageNotes/statistics');
  },

  // ==================== Helper Methods ====================

  /**
   * Get notes count for current page
   */
  getPageNotesCount: async (pageUrl: string): Promise<number> => {
    const notes = await pageNoteService.getByPageUrl(pageUrl);
    return notes.filter(note => !note.deletedFlag).length;
  },

  /**
   * Get pending notes count for current user
   */
  getMyPendingCount: async (): Promise<number> => {
    const notes = await pageNoteService.getMyNotes();
    return notes.filter(note => 
      note.status === PageNoteStatus.Pending && !note.deletedFlag
    ).length;
  }
};

export default pageNoteService;

