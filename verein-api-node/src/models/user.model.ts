/**
 * User Models
 * Maps to Web schema tables in database
 */

import { AuditableEntity } from './base.model';

// UserRole - User role entity
export interface UserRole extends AuditableEntity {
  userId: number;
  vereinId: number;
  rolle: string;
}

// User - Main user entity
export interface User extends AuditableEntity {
  email: string;
  passwordHash?: string | null;
  vorname: string;
  nachname: string;
  isActive: boolean;
  emailConfirmed: boolean;
  lastLogin?: Date | null;
  failedLoginAttempts: number;
  lockoutEnd?: Date | null;
  
  // Navigation
  userRoles?: UserRole[];
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: UserDto;
}

// User DTO (without sensitive data)
export interface UserDto {
  id: number;
  email: string;
  vorname: string;
  nachname: string;
  isActive: boolean;
  emailConfirmed: boolean;
  lastLogin?: string | null;
  roles: UserRoleDto[];
}

// User role DTO
export interface UserRoleDto {
  vereinId: number;
  rolle: string;
}

// Register request
export interface RegisterRequest {
  email: string;
  password: string;
  vorname: string;
  nachname: string;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// JWT Payload
export interface JwtPayload {
  userId: number;
  email: string;
  vorname: string;
  nachname: string;
  roles: UserRoleDto[];
  iat?: number;
  exp?: number;
}

