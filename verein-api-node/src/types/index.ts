import { Request } from 'express';
import { JwtPayload as JwtPayloadModel, UserRoleDto } from '../models';

// Re-export JwtPayload from models
export type JwtPayload = JwtPayloadModel;

// Authenticated Request
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Export UserRoleDto for convenience
export type { UserRoleDto };

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Paginated Response
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Pagination Query
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  stack?: string;
}

