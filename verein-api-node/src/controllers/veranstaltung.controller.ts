/**
 * Veranstaltung Controller
 * Event endpoints
 */

import { Request, Response } from 'express';
import { veranstaltungRepository } from '../repositories';
import { ApiResponse, CreateVeranstaltungDto, UpdateVeranstaltungDto } from '../models';

// GET /api/veranstaltungen - Get all events
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const events = await veranstaltungRepository.findAll();
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungen/:id - Get event by ID
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Veranstaltung-ID' } as ApiResponse<null>);
      return;
    }
    const event = await veranstaltungRepository.findById(id);
    if (!event) {
      res.status(404).json({ success: false, message: `Veranstaltung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungen/verein/:vereinId - Get events by Verein
export async function getByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const events = await veranstaltungRepository.findByVereinId(vereinId);
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error getting events by verein:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungen/upcoming - Get upcoming events
export async function getUpcoming(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = req.query.vereinId ? parseInt(req.query.vereinId as string, 10) : undefined;
    const events = await veranstaltungRepository.findUpcoming(vereinId);
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungen/date-range - Get events by date range
export async function getByDateRange(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate, vereinId } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ success: false, message: 'Start- und Enddatum erforderlich' } as ApiResponse<null>);
      return;
    }
    const vId = vereinId ? parseInt(vereinId as string, 10) : undefined;
    const events = await veranstaltungRepository.findByDateRange(
      new Date(startDate as string),
      new Date(endDate as string),
      vId
    );
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error getting events by date range:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/veranstaltungen - Create event
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateVeranstaltungDto = req.body;
    const userId = (req as any).user?.userId;
    const event = await veranstaltungRepository.create(dto, userId);
    res.status(201).json({ success: true, data: event, message: 'Veranstaltung erfolgreich erstellt' });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/veranstaltungen/:id - Update event
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Veranstaltung-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateVeranstaltungDto = req.body;
    const userId = (req as any).user?.userId;
    const event = await veranstaltungRepository.update(id, dto, userId);
    if (!event) {
      res.status(404).json({ success: false, message: `Veranstaltung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: event, message: 'Veranstaltung erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// DELETE /api/veranstaltungen/:id - Delete event
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Veranstaltung-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await veranstaltungRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Veranstaltung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Veranstaltung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

