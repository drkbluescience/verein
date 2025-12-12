/**
 * Authentication Controller
 * Handles login, register, and user endpoints
 */

import { Request, Response } from 'express';
import { authService } from '../services';
import { LoginRequest, RegisterRequest, ChangePasswordRequest, ApiResponse } from '../models';

// POST /api/auth/login
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const request: LoginRequest = req.body;

    if (!request.email || !request.password) {
      res.status(400).json({
        success: false,
        message: 'E-Mail und Passwort sind erforderlich',
      } as ApiResponse<null>);
      return;
    }

    const result = await authService.login(request);

    res.json({
      success: true,
      data: result,
      message: 'Erfolgreich angemeldet',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen';
    res.status(401).json({
      success: false,
      message,
    } as ApiResponse<null>);
  }
}

// POST /api/auth/register
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const request: RegisterRequest = req.body;

    if (!request.email || !request.password || !request.vorname || !request.nachname) {
      res.status(400).json({
        success: false,
        message: 'Alle Felder sind erforderlich',
      } as ApiResponse<null>);
      return;
    }

    const user = await authService.register(request);

    res.status(201).json({
      success: true,
      data: user,
      message: 'Registrierung erfolgreich',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registrierung fehlgeschlagen';
    res.status(400).json({
      success: false,
      message,
    } as ApiResponse<null>);
  }
}

// GET /api/auth/me
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Nicht authentifiziert',
      } as ApiResponse<null>);
      return;
    }

    const user = await authService.getCurrentUser(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden',
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen des Benutzers',
    } as ApiResponse<null>);
  }
}

// POST /api/auth/change-password
export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    const request: ChangePasswordRequest = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Nicht authentifiziert',
      } as ApiResponse<null>);
      return;
    }

    if (!request.currentPassword || !request.newPassword) {
      res.status(400).json({
        success: false,
        message: 'Aktuelles und neues Passwort sind erforderlich',
      } as ApiResponse<null>);
      return;
    }

    await authService.changePassword(userId, request);

    res.json({
      success: true,
      message: 'Passwort erfolgreich geändert',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Passwortänderung fehlgeschlagen';
    res.status(400).json({
      success: false,
      message,
    } as ApiResponse<null>);
  }
}

// POST /api/auth/refresh (token refresh)
export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Nicht authentifiziert',
      } as ApiResponse<null>);
      return;
    }

    const user = await authService.getCurrentUser(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden',
      } as ApiResponse<null>);
      return;
    }

    // Note: In a real implementation, you'd want to regenerate the token
    // For now, just return success
    res.json({
      success: true,
      message: 'Token ist noch gültig',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token-Aktualisierung fehlgeschlagen',
    } as ApiResponse<null>);
  }
}

