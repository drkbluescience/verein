import api from './api';
import { VereinSatzungDto, UpdateVereinSatzungDto } from '../types/vereinSatzung';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const vereinSatzungService = {
  // Get all statute versions for a Verein
  getByVereinId: async (vereinId: number): Promise<VereinSatzungDto[]> => {
    return await api.get<VereinSatzungDto[]>(`/api/VereinSatzung/verein/${vereinId}`);
  },

  // Get active statute for a Verein
  getActiveByVereinId: async (vereinId: number): Promise<VereinSatzungDto | null> => {
    try {
      return await api.get<VereinSatzungDto>(`/api/VereinSatzung/verein/${vereinId}/active`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get statute by ID
  getById: async (id: number): Promise<VereinSatzungDto> => {
    return await api.get<VereinSatzungDto>(`/api/VereinSatzung/${id}`);
  },

  // Upload statute file
  uploadSatzung: async (
    vereinId: number,
    file: File,
    satzungVom: string,
    setAsActive: boolean = true,
    bemerkung?: string
  ): Promise<VereinSatzungDto> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('satzungVom', satzungVom);
    formData.append('setAsActive', setAsActive.toString());
    if (bemerkung) {
      formData.append('bemerkung', bemerkung);
    }

    const response = await fetch(`${API_URL}/api/VereinSatzung/upload/${vereinId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  // Download statute file
  downloadSatzung: async (id: number, fileName?: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/VereinSatzung/${id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `satzung_${id}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Open statute file in new tab (inline viewing)
  openSatzungInNewTab: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/VereinSatzung/${id}/view`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to open file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  },

  // Update statute
  update: async (id: number, data: UpdateVereinSatzungDto): Promise<VereinSatzungDto> => {
    return await api.put<VereinSatzungDto>(`/api/VereinSatzung/${id}`, data);
  },

  // Set statute as active
  setActive: async (id: number): Promise<void> => {
    await api.post(`/api/VereinSatzung/${id}/set-active`, {});
  },

  // Delete statute
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/VereinSatzung/${id}`);
  },
};

