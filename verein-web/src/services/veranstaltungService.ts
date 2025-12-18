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

  // Get participant count for a Veranstaltung
  getParticipantCount: async (veranstaltungId: number): Promise<number> => {
    return await api.get<number>(`/api/VeranstaltungAnmeldungen/veranstaltung/${veranstaltungId}/count`);
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
  formatEventDate: (startdatum: string, enddatum?: string, istWiederholend?: boolean, wiederholungEnde?: string): string => {
    const start = new Date(startdatum);
    const startFormatted = start.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // For recurring events, show start date and recurrence end date
    if (istWiederholend && wiederholungEnde) {
      const recurrenceEnd = new Date(wiederholungEnde);
      const recurrenceEndFormatted = recurrenceEnd.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      if (startFormatted === recurrenceEndFormatted) {
        return startFormatted;
      }
      return `${startFormatted} - ${recurrenceEndFormatted}`;
    }

    // For non-recurring events with end date
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

  // Check if event is upcoming (has future occurrences)
  isUpcoming: (
    startdatum: string,
    istWiederholend?: boolean,
    wiederholungTyp?: 'daily' | 'weekly' | 'monthly' | 'yearly',
    wiederholungInterval?: number,
    wiederholungEnde?: string,
    wiederholungTage?: string,
    wiederholungMonatTag?: number
  ): boolean => {
    const nextOccurrence = veranstaltungUtils.getNextOccurrenceDate(
      startdatum,
      istWiederholend,
      wiederholungTyp,
      wiederholungInterval,
      wiederholungEnde,
      wiederholungTage,
      wiederholungMonatTag
    );
    return nextOccurrence !== null;
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

  // Get next occurrence date for recurring events
  getNextOccurrenceDate: (
    startdatum: string,
    istWiederholend?: boolean,
    wiederholungTyp?: 'daily' | 'weekly' | 'monthly' | 'yearly',
    wiederholungInterval?: number,
    wiederholungEnde?: string,
    wiederholungTage?: string,
    wiederholungMonatTag?: number
  ): Date | null => {
    // Normalize dates to midnight for accurate day comparison
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const start = new Date(startdatum);
    start.setHours(0, 0, 0, 0);

    // If not recurring, return start date if it's in the future or today
    if (!istWiederholend) {
      return start >= now ? start : null;
    }

    // If recurring has ended, return null
    if (wiederholungEnde) {
      const recurrenceEnd = new Date(wiederholungEnde);
      recurrenceEnd.setHours(0, 0, 0, 0);
      if (now > recurrenceEnd) {
        return null;
      }
    }

    const interval = wiederholungInterval || 1;
    let nextDate = new Date(start);

    // Calculate next occurrence based on recurrence type
    switch (wiederholungTyp) {
      case 'daily':
        // Find next daily occurrence (must be >= start date and >= today)
        while (nextDate < now || nextDate < start) {
          nextDate.setDate(nextDate.getDate() + interval);
        }
        break;

      case 'weekly':
        // For weekly events with specific days
        if (wiederholungTage) {
          const daysOfWeek = wiederholungTage.split(',').map(d => d.trim());
          const dayMap: { [key: string]: number } = {
            'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0
          };

          // Find the next occurrence starting from the later of today or start date
          let found = false;
          let checkDate = new Date(now > start ? now : start);
          checkDate.setHours(0, 0, 0, 0);

          // Check up to 8 weeks ahead to find next occurrence
          for (let i = 0; i < 56; i++) {
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][checkDate.getDay()];
            if (daysOfWeek.includes(dayName) && checkDate >= now && checkDate >= start) {
              nextDate = new Date(checkDate);
              found = true;
              break;
            }
            checkDate.setDate(checkDate.getDate() + 1);
          }

          if (!found) {
            return null;
          }
        } else {
          // Simple weekly recurrence
          while (nextDate < now) {
            nextDate.setDate(nextDate.getDate() + (7 * interval));
          }
        }
        break;

      case 'monthly':
        // For monthly events on specific day
        if (wiederholungMonatTag) {
          let checkDate = new Date(now > start ? now : start);
          checkDate.setDate(wiederholungMonatTag);
          checkDate.setHours(0, 0, 0, 0);

          // If this month's occurrence has passed or is before start date, go to next month
          while (checkDate < now || checkDate < start) {
            checkDate.setMonth(checkDate.getMonth() + interval);
          }

          nextDate = checkDate;
        } else {
          // Simple monthly recurrence
          while (nextDate < now || nextDate < start) {
            nextDate.setMonth(nextDate.getMonth() + interval);
          }
        }
        break;

      case 'yearly':
        // Simple yearly recurrence
        while (nextDate < now || nextDate < start) {
          nextDate.setFullYear(nextDate.getFullYear() + interval);
        }
        break;

      default:
        return start >= now ? start : null;
    }

    // Check if next occurrence is within recurrence end date
    if (wiederholungEnde) {
      const recurrenceEnd = new Date(wiederholungEnde);
      recurrenceEnd.setHours(0, 0, 0, 0);
      if (nextDate > recurrenceEnd) {
        return null;
      }
    }

    return nextDate;
  },

  // Get days until next event occurrence
  getDaysUntilEvent: (
    startdatum: string,
    istWiederholend?: boolean,
    wiederholungTyp?: 'daily' | 'weekly' | 'monthly' | 'yearly',
    wiederholungInterval?: number,
    wiederholungEnde?: string,
    wiederholungTage?: string,
    wiederholungMonatTag?: number
  ): number | null => {
    const nextOccurrence = veranstaltungUtils.getNextOccurrenceDate(
      startdatum,
      istWiederholend,
      wiederholungTyp,
      wiederholungInterval,
      wiederholungEnde,
      wiederholungTage,
      wiederholungMonatTag
    );

    if (!nextOccurrence) {
      return null;
    }

    // Reset time to midnight for accurate day calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(nextOccurrence);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return days;
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
