import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

// Success response
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
}

// Created response
export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Created successfully'
): Response {
  return sendSuccess(res, data, message, 201);
}

// Paginated response
export function sendPaginated<T>(
  res: Response,
  items: T[],
  totalCount: number,
  pageNumber: number,
  pageSize: number
): Response {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const response: ApiResponse<PaginatedResponse<T>> = {
    success: true,
    data: {
      items,
      totalCount,
      pageNumber,
      pageSize,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    },
  };
  
  return res.status(200).json(response);
}

// Error response
export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: string[]
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
}

// Not found response
export function sendNotFound(
  res: Response,
  message = 'Resource not found'
): Response {
  return sendError(res, message, 404);
}

// Unauthorized response
export function sendUnauthorized(
  res: Response,
  message = 'Unauthorized'
): Response {
  return sendError(res, message, 401);
}

// Forbidden response
export function sendForbidden(
  res: Response,
  message = 'Forbidden'
): Response {
  return sendError(res, message, 403);
}

// Server error response
export function sendServerError(
  res: Response,
  message = 'Internal server error'
): Response {
  return sendError(res, message, 500);
}

