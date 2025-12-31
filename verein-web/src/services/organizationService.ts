import api from './api';
import {
  OrganizationDto,
  OrganizationCreateDto,
  OrganizationUpdateDto,
  TreeNodeDto,
  PathNodeDto
} from '../types/organization';

export interface OrganizationQuery {
  orgType?: string;
  federationCode?: string;
  parentId?: number;
  includeDeleted?: boolean;
}

export const organizationService = {
  getAll: async (params?: OrganizationQuery): Promise<OrganizationDto[]> => {
    return api.get<OrganizationDto[]>('/api/Organizations', params);
  },

  getById: async (id: number, includeDeleted = false): Promise<OrganizationDto> => {
    return api.get<OrganizationDto>(`/api/Organizations/${id}`, { includeDeleted });
  },

  create: async (payload: OrganizationCreateDto): Promise<OrganizationDto> => {
    return api.post<OrganizationDto>('/api/Organizations', payload);
  },

  update: async (id: number, payload: OrganizationUpdateDto): Promise<OrganizationDto> => {
    return api.put<OrganizationDto>(`/api/Organizations/${id}`, payload);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/Organizations/${id}`);
  },

  restore: async (id: number): Promise<void> => {
    return api.post<void>(`/api/Organizations/${id}/restore`);
  },

  getTree: async (id: number, includeDeleted = false): Promise<TreeNodeDto> => {
    return api.get<TreeNodeDto>(`/api/Organizations/${id}/tree`, { includeDeleted });
  },

  getPath: async (id: number): Promise<PathNodeDto[]> => {
    return api.get<PathNodeDto[]>(`/api/Organizations/${id}/path`);
  }
};
