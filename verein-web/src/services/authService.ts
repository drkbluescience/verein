import { api } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userType: string; // "admin", "dernek", "mitglied"
  firstName: string;
  lastName: string;
  email: string;
  vereinId?: number;
  mitgliedId?: number;
  permissions: string[];
  token: string; // JWT token
}

export interface RegisterMitgliedRequest {
  vorname: string;
  nachname: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefon?: string;
  mobiltelefon?: string;
  geburtsdatum?: string;
  geburtsort?: string;
}

export interface RegisterVereinRequest {
  name: string;
  kurzname?: string;
  email: string;
  telefon?: string;
  vorstandsvorsitzender?: string;
  vorstandsvorsitzenderEmail?: string;
  password: string;
  confirmPassword: string;
  kontaktperson?: string;
  webseite?: string;
  gruendungsdatum?: string;
  zweck?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  mitgliedId?: number;
  vereinId?: number;
  email: string;
}

export const authService = {
  // Login with email and password
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    return await api.post<LoginResponse>('/api/Auth/login', request);
  },

  // Get current user information
  getUser: async (email: string): Promise<LoginResponse> => {
    return await api.get<LoginResponse>('/api/Auth/user', { email });
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post('/api/Auth/logout');
  },

  // Register new member (Mitglied)
  registerMitglied: async (request: RegisterMitgliedRequest): Promise<RegisterResponse> => {
    return await api.post<RegisterResponse>('/api/Auth/register-mitglied', request);
  },

  // Register new verein (Association)
  registerVerein: async (request: RegisterVereinRequest): Promise<RegisterResponse> => {
    return await api.post<RegisterResponse>('/api/Auth/register-verein', request);
  }
};
