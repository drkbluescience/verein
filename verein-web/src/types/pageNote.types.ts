// PageNote Types
// Matches backend DTOs and Enums

export enum PageNoteStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Rejected = 'Rejected'
}

export enum PageNoteCategory {
  General = 'General',
  Bug = 'Bug',
  Feature = 'Feature',
  Question = 'Question',
  Improvement = 'Improvement',
  DataCorrection = 'DataCorrection'
}

export enum PageNotePriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

// DTOs matching backend
export interface PageNoteDto {
  id: number;
  pageUrl: string;
  pageTitle?: string;
  entityType?: string;
  entityId?: number;
  title: string;
  content: string;
  category: PageNoteCategory;
  priority: PageNotePriority;
  userEmail: string;
  userName?: string;
  status: PageNoteStatus;
  completedBy?: string;
  completedAt?: string;
  adminNotes?: string;
  created: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
  deletedFlag: boolean;
  aktiv: boolean;
}

export interface CreatePageNoteDto {
  pageUrl: string;
  pageTitle?: string;
  entityType?: string;
  entityId?: number;
  title: string;
  content: string;
  category?: PageNoteCategory;
  priority?: PageNotePriority;
}

export interface UpdatePageNoteDto {
  title?: string;
  content?: string;
  category?: PageNoteCategory;
  priority?: PageNotePriority;
}

export interface CompletePageNoteDto {
  status: PageNoteStatus;
  adminNotes?: string;
}

export interface PageNoteStatisticsDto {
  totalNotes: number;
  pendingNotes: number;
  inProgressNotes: number;
  completedNotes: number;
  rejectedNotes: number;
  notesByCategory: Record<PageNoteCategory, number>;
  notesByPriority: Record<PageNotePriority, number>;
  notesByUser: Array<{
    userEmail: string;
    userName?: string;
    count: number;
  }>;
  recentNotes: PageNoteDto[];
}

// UI Helper Types
export interface PageNoteFormData {
  title: string;
  content: string;
  category: PageNoteCategory;
  priority: PageNotePriority;
}

export interface PageNoteFilters {
  status?: PageNoteStatus;
  category?: PageNoteCategory;
  priority?: PageNotePriority;
  userEmail?: string;
  pageUrl?: string;
  entityType?: string;
  entityId?: number;
}

// Category and Priority Labels for UI
export const CategoryLabels: Record<PageNoteCategory, { de: string; tr: string }> = {
  [PageNoteCategory.General]: { de: 'Allgemein', tr: 'Genel' },
  [PageNoteCategory.Bug]: { de: 'Fehler', tr: 'Hata' },
  [PageNoteCategory.Feature]: { de: 'Funktion', tr: 'Özellik' },
  [PageNoteCategory.Question]: { de: 'Frage', tr: 'Soru' },
  [PageNoteCategory.Improvement]: { de: 'Verbesserung', tr: 'İyileştirme' },
  [PageNoteCategory.DataCorrection]: { de: 'Datenkorrektur', tr: 'Veri Düzeltme' }
};

export const PriorityLabels: Record<PageNotePriority, { de: string; tr: string }> = {
  [PageNotePriority.Low]: { de: 'Niedrig', tr: 'Düşük' },
  [PageNotePriority.Medium]: { de: 'Mittel', tr: 'Orta' },
  [PageNotePriority.High]: { de: 'Hoch', tr: 'Yüksek' },
  [PageNotePriority.Critical]: { de: 'Kritisch', tr: 'Kritik' }
};

export const StatusLabels: Record<PageNoteStatus, { de: string; tr: string }> = {
  [PageNoteStatus.Pending]: { de: 'Ausstehend', tr: 'Bekliyor' },
  [PageNoteStatus.InProgress]: { de: 'In Bearbeitung', tr: 'Devam Ediyor' },
  [PageNoteStatus.Completed]: { de: 'Abgeschlossen', tr: 'Tamamlandı' },
  [PageNoteStatus.Rejected]: { de: 'Abgelehnt', tr: 'Reddedildi' }
};

// Category Icons
export const CategoryIcons: Record<PageNoteCategory, string> = {
  [PageNoteCategory.General]: '📝',
  [PageNoteCategory.Bug]: '🐛',
  [PageNoteCategory.Feature]: '✨',
  [PageNoteCategory.Question]: '❓',
  [PageNoteCategory.Improvement]: '🔧',
  [PageNoteCategory.DataCorrection]: '📊'
};

// Priority Colors
export const PriorityColors: Record<PageNotePriority, string> = {
  [PageNotePriority.Low]: '#10b981',
  [PageNotePriority.Medium]: '#f59e0b',
  [PageNotePriority.High]: '#ef4444',
  [PageNotePriority.Critical]: '#dc2626'
};

