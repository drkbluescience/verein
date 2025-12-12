/**
 * Nachricht Controller
 * Sent Messages endpoints (inbox for members)
 */

import { Request, Response } from 'express';
import { nachrichtRepository } from '../repositories';
import { ApiResponse } from '../models';

// GET /api/nachrichten/mitglied/:mitgliedId - Get inbox
export async function getByMitgliedId(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const nachrichten = await nachrichtRepository.findByMitgliedId(mitgliedId);
    res.json({ success: true, data: nachrichten });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/nachrichten/brief/:briefId - Get messages by Brief
export async function getByBriefId(req: Request, res: Response): Promise<void> {
  try {
    const briefId = parseInt(req.params.briefId, 10);
    if (isNaN(briefId)) {
      res.status(400).json({ success: false, message: 'Ungültige Brief-ID' } as ApiResponse<null>);
      return;
    }
    const nachrichten = await nachrichtRepository.findByBriefId(briefId);
    res.json({ success: true, data: nachrichten });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/nachrichten/:id - Get message by ID
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Nachricht-ID' } as ApiResponse<null>);
      return;
    }
    const nachricht = await nachrichtRepository.findById(id);
    if (!nachricht) {
      res.status(404).json({ success: false, message: `Nachricht mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: nachricht });
  } catch (error) {
    console.error('Error getting message:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/nachrichten/mitglied/:mitgliedId/unread-count - Get unread count
export async function getUnreadCount(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const count = await nachrichtRepository.getUnreadCount(mitgliedId);
    res.json({ success: true, data: { unreadCount: count } });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/nachrichten/:id/mark-read - Mark as read
export async function markAsRead(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Nachricht-ID' } as ApiResponse<null>);
      return;
    }
    const success = await nachrichtRepository.markAsRead(id);
    if (!success) {
      res.status(404).json({ success: false, message: `Nachricht mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Nachricht als gelesen markiert' });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Markieren' } as ApiResponse<null>);
  }
}

// DELETE /api/nachrichten/:id - Delete message
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Nachricht-ID' } as ApiResponse<null>);
      return;
    }
    const deleted = await nachrichtRepository.softDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Nachricht mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Nachricht erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

