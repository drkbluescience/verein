import { api } from './api';
import {
  VeranstaltungDto,
  CreateVeranstaltungDto,
  UpdateVeranstaltungDto,
  VeranstaltungAnmeldungDto,
  CreateVeranstaltungAnmeldungDto,
  UpdateVeranstaltungAnmeldungDto,
  VeranstaltungBildDto,
  CreateVeranstaltungBildDto,
  UpdateVeranstaltungBildDto,
  VeranstaltungSearchParams
} from '../types/veranstaltung';

// Veranstaltung Service
export const veranstaltungService = {
  // Get all Veranstaltungen (for admin)
  getAll: async (params?: VeranstaltungSearchParams): Promise<VeranstaltungDto[]> => {
    return await api.get<VeranstaltungDto[]>('/api/Veranstaltungen', params);
  },

  // Get Veranstaltung by ID
  getById: async (id: number): Promise<VeranstaltungDto> => {
    return await api.get<VeranstaltungDto>(`/api/Veranstaltungen/${id}`);
  },

  // Get Veranstaltungen by Verein ID (for dernek users)
  getByVereinId: async (vereinId: number): Promise<VeranstaltungDto[]> => {
    return await api.get<VeranstaltungDto[]>(`/api/Veranstaltungen/verein/${vereinId}`);
  },

  // Get Veranstaltungen by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<VeranstaltungDto[]> => {
    return await api.get<VeranstaltungDto[]>('/api/Veranstaltungen/date-range', {
      startDate,
      endDate
    });
  },

  // Create new Veranstaltung
  create: async (data: CreateVeranstaltungDto): Promise<VeranstaltungDto> => {
    return await api.post<VeranstaltungDto>('/api/Veranstaltungen', data);
  },

  // Update Veranstaltung
  update: async (id: number, data: UpdateVeranstaltungDto): Promise<VeranstaltungDto> => {
    return await api.put<VeranstaltungDto>(`/api/Veranstaltungen/${id}`, data);
  },

  // Delete Veranstaltung (soft delete)
  delete: async (id: number): Promise<void> => {
    return await api.delete<void>(`/api/Veranstaltungen/${id}`);
  }
};

// VeranstaltungAnmeldung Service
export const veranstaltungAnmeldungService = {
  // Get all Anmeldungen
  getAll: async (): Promise<VeranstaltungAnmeldungDto[]> => {
    return await api.get<VeranstaltungAnmeldungDto[]>('/api/VeranstaltungAnmeldungen');
  },

  // Get Anmeldung by ID
  getById: async (id: number): Promise<VeranstaltungAnmeldungDto> => {
    return await api.get<VeranstaltungAnmeldungDto>(`/api/VeranstaltungAnmeldungen/${id}`);
  },

  // Get Anmeldungen by Veranstaltung ID
  getByVeranstaltungId: async (veranstaltungId: number): Promise<VeranstaltungAnmeldungDto[]> => {
    return await api.get<VeranstaltungAnmeldungDto[]>(`/api/VeranstaltungAnmeldungen/veranstaltung/${veranstaltungId}`);
  },

  // Get Anmeldungen by Member ID
  getByMitgliedId: async (mitgliedId: number): Promise<VeranstaltungAnmeldungDto[]> => {
    return await api.get<VeranstaltungAnmeldungDto[]>(`/api/VeranstaltungAnmeldungen/mitglied/${mitgliedId}`);
  },

  // Get Anmeldungen by Status
  getByStatus: async (status: number): Promise<VeranstaltungAnmeldungDto[]> => {
    return await api.get<VeranstaltungAnmeldungDto[]>(`/api/VeranstaltungAnmeldungen/status/${status}`);
  },

  // Create new Anmeldung
  create: async (data: CreateVeranstaltungAnmeldungDto): Promise<VeranstaltungAnmeldungDto> => {
    return await api.post<VeranstaltungAnmeldungDto>('/api/VeranstaltungAnmeldungen', data);
  },

  // Update Anmeldung
  update: async (id: number, data: UpdateVeranstaltungAnmeldungDto): Promise<VeranstaltungAnmeldungDto> => {
    return await api.put<VeranstaltungAnmeldungDto>(`/api/VeranstaltungAnmeldungen/${id}`, data);
  },

  // Update Anmeldung Status
  updateStatus: async (id: number, status: string): Promise<VeranstaltungAnmeldungDto> => {
    return await api.patch<VeranstaltungAnmeldungDto>(`/api/VeranstaltungAnmeldungen/${id}/status`, status);
  },

  // Delete Anmeldung
  delete: async (id: number): Promise<void> => {
    return await api.delete<void>(`/api/VeranstaltungAnmeldungen/${id}`);
  }
};

// VeranstaltungBild Service
export const veranstaltungBildService = {
  // Get all Bilder
  getAll: async (): Promise<VeranstaltungBildDto[]> => {
    return await api.get<VeranstaltungBildDto[]>('/api/VeranstaltungBilder');
  },

  // Get Bild by ID
  getById: async (id: number): Promise<VeranstaltungBildDto> => {
    return await api.get<VeranstaltungBildDto>(`/api/VeranstaltungBilder/${id}`);
  },

  // Get Bilder by Veranstaltung ID
  getByVeranstaltungId: async (veranstaltungId: number): Promise<VeranstaltungBildDto[]> => {
    return await api.get<VeranstaltungBildDto[]>(`/api/VeranstaltungBilder/veranstaltung/${veranstaltungId}`);
  },

  // Upload Image
  uploadImage: async (
    veranstaltungId: number,
    file: File,
    titel?: string,
    reihenfolge: number = 1
  ): Promise<VeranstaltungBildDto> => {
    const formData = new FormData();
    formData.append('file', file);
    if (titel) formData.append('titel', titel);
    formData.append('reihenfolge', reihenfolge.toString());

    return await api.post<VeranstaltungBildDto>(
      `/api/VeranstaltungBilder/upload/${veranstaltungId}`,
      formData
    );
  },

  // Create Bild with existing path
  create: async (data: CreateVeranstaltungBildDto): Promise<VeranstaltungBildDto> => {
    return await api.post<VeranstaltungBildDto>('/api/VeranstaltungBilder', data);
  },

  // Update Bild
  update: async (id: number, data: UpdateVeranstaltungBildDto): Promise<VeranstaltungBildDto> => {
    return await api.put<VeranstaltungBildDto>(`/api/VeranstaltungBilder/${id}`, data);
  },

  // Reorder Images
  reorderImages: async (
    veranstaltungId: number,
    sortOrders: Record<number, number>
  ): Promise<VeranstaltungBildDto[]> => {
    return await api.patch<VeranstaltungBildDto[]>(
      `/api/VeranstaltungBilder/veranstaltung/${veranstaltungId}/reorder`,
      sortOrders
    );
  },

  // Delete Bild
  delete: async (id: number): Promise<void> => {
    return await api.delete<void>(`/api/VeranstaltungBilder/${id}`);
  }
};

// Utility functions for Veranstaltung data processing
export const veranstaltungUtils = {
  // Format event date for display
  formatEventDate: (startdatum: string, enddatum?: string): string => {
    const start = new Date(startdatum);
    const startFormatted = start.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    if (enddatum) {
      const end = new Date(enddatum);
      const endFormatted = end.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      if (startFormatted === endFormatted) {
        return startFormatted;
      }
      return `${startFormatted} - ${endFormatted}`;
    }

    return startFormatted;
  },

  // Format event time for display
  formatEventTime: (startdatum: string, enddatum?: string): string => {
    const start = new Date(startdatum);
    const startTime = start.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (enddatum) {
      const end = new Date(enddatum);
      const endTime = end.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${startTime} - ${endTime}`;
    }

    return startTime;
  },

  // Check if event is upcoming
  isUpcoming: (startdatum: string): boolean => {
    const now = new Date();
    const eventDate = new Date(startdatum);
    return eventDate > now;
  },

  // Check if event is past
  isPast: (startdatum: string, enddatum?: string): boolean => {
    const now = new Date();
    const endDate = enddatum ? new Date(enddatum) : new Date(startdatum);
    return endDate < now;
  },

  // Check if event is today
  isToday: (startdatum: string): boolean => {
    const today = new Date();
    const eventDate = new Date(startdatum);
    return today.toDateString() === eventDate.toDateString();
  },

  // Get days until event
  getDaysUntilEvent: (startdatum: string): number => {
    const now = new Date();
    const eventDate = new Date(startdatum);
    const diffTime = eventDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Get event status
  getEventStatus: (startdatum: string, enddatum?: string): 'upcoming' | 'ongoing' | 'past' | 'cancelled' => {
    const now = new Date();
    const start = new Date(startdatum);
    const end = enddatum ? new Date(enddatum) : start;

    if (now < start) {
      return 'upcoming';
    } else if (now >= start && now <= end) {
      return 'ongoing';
    } else {
      return 'past';
    }
  },

  // Calculate event duration in hours
  getEventDuration: (startdatum: string, enddatum?: string): number => {
    if (!enddatum) return 0;
    
    const start = new Date(startdatum);
    const end = new Date(enddatum);
    const diffTime = end.getTime() - start.getTime();
    return Math.round(diffTime / (1000 * 60 * 60)); // Convert to hours
  },

  // Format event duration for display
  formatEventDuration: (startdatum: string, enddatum?: string): string => {
    const hours = veranstaltungUtils.getEventDuration(startdatum, enddatum);
    
    if (hours === 0) return 'Ganztägig';
    if (hours < 24) return `${hours} Stunden`;
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (remainingHours === 0) return `${days} Tag${days > 1 ? 'e' : ''}`;
    return `${days} Tag${days > 1 ? 'e' : ''} ${remainingHours} Stunden`;
  },

  // Get short event description
  getShortDescription: (beschreibung?: string, maxLength: number = 100): string => {
    if (!beschreibung) return '';
    if (beschreibung.length <= maxLength) return beschreibung;
    return beschreibung.substring(0, maxLength) + '...';
  }
};
