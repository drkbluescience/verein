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
   * Get all messages for a specific member (inbox)
   * @param mitgliedId - Member ID to get messages for
   */
  getByMitgliedId: async (mitgliedId: number): Promise<NachrichtDto[]> => {
    return api.get<NachrichtDto[]>(`/api/Nachrichten/mitglied/${mitgliedId}`);
  },

  /**
   * Get message by ID
   */
  getById: async (id: number): Promise<NachrichtDto> => {
    return api.get<NachrichtDto>(`/api/Nachrichten/${id}`);
  },

  /**
   * Get unread messages for a specific member
   * @param mitgliedId - Member ID to get unread messages for
   */
  getUnreadByMitgliedId: async (mitgliedId: number): Promise<NachrichtDto[]> => {
    return api.get<NachrichtDto[]>(`/api/Nachrichten/mitglied/${mitgliedId}/unread`);
  },

  /**
   * Get unread message count for a specific member
   * @param mitgliedId - Member ID to get unread count for
   */
  getUnreadCount: async (mitgliedId: number): Promise<UnreadCountDto> => {
    return api.get<UnreadCountDto>(`/api/Nachrichten/mitglied/${mitgliedId}/unread-count`);
  },

  /**
   * Get messages sent from a specific letter (for Verein view)
   * @param briefId - Letter ID to get sent messages for
   */
  getByBriefId: async (briefId: number): Promise<NachrichtDto[]> => {
    return api.get<NachrichtDto[]>(`/api/Nachrichten/brief/${briefId}`);
  },

  /**
   * Get all messages sent by a Verein
   * @param vereinId - Verein ID to get sent messages for
   */
  getByVereinId: async (vereinId: number): Promise<NachrichtDto[]> => {
    return api.get<NachrichtDto[]>(`/api/Nachrichten/verein/${vereinId}`);
  },

  /**
   * Get message statistics for a member
   * @param mitgliedId - Member ID to get statistics for
   */
  getStatistics: async (mitgliedId: number): Promise<BriefStatisticsDto> => {
    return api.get<BriefStatisticsDto>(`/api/Nachrichten/mitglied/${mitgliedId}/statistics`);
  },

  /**
   * Mark a message as read
   * @param id - Message ID to mark as read
   */
  markAsRead: async (id: number): Promise<NachrichtDto> => {
    return api.patch<NachrichtDto>(`/api/Nachrichten/${id}/read`);
  },

  /**
   * Mark multiple messages as read
   * @param ids - Array of message IDs to mark as read
   */
  markMultipleAsRead: async (ids: number[]): Promise<number> => {
    return api.patch<number>('/api/Nachrichten/mark-read', ids);
  },

  /**
   * Delete a message (soft delete - only hides from member's view)
   * @param id - Message ID to delete
   */
  delete: async (id: number): Promise<void> => {
    return api.delete(`/api/Nachrichten/${id}`);
  },
};

export default nachrichtService;

