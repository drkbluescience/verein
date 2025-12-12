/**
 * Base interfaces for all entities
 */

// Auditable entity base - matches AuditableEntity in .NET
export interface AuditableEntity {
  id: number;
  created?: Date | null;
  createdBy?: number | null;
  modified?: Date | null;
  modifiedBy?: number | null;
  deletedFlag?: boolean | null;
  aktiv?: boolean | null;
}

// Keytable base - for lookup tables
export interface KeytableBase {
  id: number;
  code: string;
}

// Keytable translation - for lookup table translations
export interface KeytableUebersetzung {
  sprache: string;
  name: string;
}

// Keytable with translations
export interface KeytableWithUebersetzung extends KeytableBase {
  uebersetzungen: KeytableUebersetzung[];
}

// Pagination request
export interface PaginationRequest {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Create/Update DTOs - common fields excluded
export type CreateDto<T extends AuditableEntity> = Omit<T, 'id' | 'created' | 'createdBy' | 'modified' | 'modifiedBy' | 'deletedFlag'>;
export type UpdateDto<T extends AuditableEntity> = Partial<Omit<T, 'id' | 'created' | 'createdBy' | 'modified' | 'modifiedBy' | 'deletedFlag'>>;

