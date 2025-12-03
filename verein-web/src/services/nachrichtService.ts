import { api } from './api';
import {
  NachrichtDto,
  UnreadCountDto,
  BriefStatisticsDto
} from '../types/brief.types';

// ==================== Nachricht (Message) Service ====================
// For member inbox - messages received from Verein

export const nachrichtService = {
  /**
   * Get all messages for the current member (inbox)
   */
  getAll: async (): Promise<NachrichtDto[]> => {
    return api.get<NachrichtDto[]>('/api/Nachrichten');
  },

  /**
   * Get message by ID
   */
  getById: async (id: number): Promise<NachrichtDto> => {
    return api.get<NachrichtDto>(`/api/Nachrichten/${id}`);
  },

  /**
   * Get unread messages only
   */
  getUnread: async (): Promise<NachrichtDto[]> => {
    return api.get<NachrichtDto[]>('/api/Nachrichten/ungelesen');
  },

  /**
   * Get unread message count
   */
  getUnreadCount: async (): Promise<UnreadCountDto> => {
    return api.get<UnreadCountDto>('/api/Nachrichten/ungelesen-anzahl');
  },

  /**
   * Get messages from a specific Verein
   */
  getByVerein: async (vereinId: number): Promise<NachrichtDto[]> => {
    return api.get<NachrichtDto[]>(`/api/Nachrichten/verein/${vereinId}`);
  },

  /**
   * Get messages for a specific member (admin view)
   */
  getByMitglied: async (mitgliedId: number): Promise<NachrichtDto[]> => {
    return api.get<NachrichtDto[]>(`/api/Nachrichten/mitglied/${mitgliedId}`);
  },

  /**
   * Get message statistics for a member
   */
  getStatistics: async (mitgliedId: number): Promise<BriefStatisticsDto> => {
    return api.get<BriefStatisticsDto>(`/api/Nachrichten/mitglied/${mitgliedId}/statistiken`);
  },

  /**
   * Mark a message as read
   */
  markAsRead: async (id: number): Promise<NachrichtDto> => {
    return api.patch<NachrichtDto>(`/api/Nachrichten/${id}/gelesen`);
  },

  /**
   * Mark multiple messages as read
   */
  markMultipleAsRead: async (ids: number[]): Promise<void> => {
    return api.patch('/api/Nachrichten/mehrere-gelesen', { ids });
  },

  /**
   * Delete a message (soft delete - only hides from member's view)
   */
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/Nachrichten/${id}`);
  },
};

export default nachrichtService;

