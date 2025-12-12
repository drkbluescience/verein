/**
 * PageNote Models
 * User notes on pages for development feedback
 */

import { AuditableEntity } from './base.model';

// PageNote Status
export type PageNoteStatus = 'Pending' | 'InProgress' | 'Completed' | 'Rejected';

// PageNote Category
export type PageNoteCategory = 'General' | 'Bug' | 'Feature' | 'Improvement' | 'Question';

// PageNote Priority
export type PageNotePriority = 'Low' | 'Medium' | 'High' | 'Critical';

// PageNote entity
export interface PageNote {
  id: number;
  pageUrl: string;
  pageTitle?: string | null;
  entityType?: string | null;
  entityId?: number | null;
  title: string;
  content: string;
  category: PageNoteCategory;
  priority: PageNotePriority;
  userEmail: string;
  userName?: string | null;
  status: PageNoteStatus;
  completedBy?: string | null;
  completedAt?: string | null;
  adminNotes?: string | null;
  aktiv?: boolean | null;
  created?: string | null;
  createdBy?: string | null;
  modified?: string | null;
  modifiedBy?: string | null;
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

export interface PageNoteStatistics {
  totalNotes: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  rejectedCount: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}

