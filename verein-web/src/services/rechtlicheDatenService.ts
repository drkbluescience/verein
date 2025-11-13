import api from './api';
import {
  RechtlicheDatenDto,
  CreateRechtlicheDatenDto,
  UpdateRechtlicheDatenDto
} from '../types/rechtlicheDaten';

export const rechtlicheDatenService = {
  // Get by ID
  getById: async (id: number): Promise<RechtlicheDatenDto> => {
    return api.get<RechtlicheDatenDto>(`/api/RechtlicheDaten/${id}`);
  },

  // Get by Verein ID
  getByVereinId: async (vereinId: number): Promise<RechtlicheDatenDto> => {
    return api.get<RechtlicheDatenDto>(`/api/RechtlicheDaten/verein/${vereinId}`);
  },

  // Create
  create: async (data: CreateRechtlicheDatenDto): Promise<RechtlicheDatenDto> => {
    return api.post<RechtlicheDatenDto>('/api/RechtlicheDaten', data);
  },

  // Update
  update: async (id: number, data: UpdateRechtlicheDatenDto): Promise<RechtlicheDatenDto> => {
    return api.put<RechtlicheDatenDto>(`/api/RechtlicheDaten/${id}`, data);
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/RechtlicheDaten/${id}`);
  }
};

