/**
 * VeranstaltungAnmeldung Controller
 * Event Registration endpoints
 */

import { Request, Response } from 'express';
import { veranstaltungAnmeldungRepository } from '../repositories';
import { ApiResponse, CreateVeranstaltungAnmeldungDto, UpdateVeranstaltungAnmeldungDto } from '../models';

// GET /api/veranstaltunganmeldungen - Get all
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const anmeldungen = await veranstaltungAnmeldungRepository.findAll();
    res.json({ success: true, data: anmeldungen });
  } catch (error) {
    console.error('Error getting anmeldungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltunganmeldungen/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Anmeldung-ID' } as ApiResponse<null>);
      return;
    }
    const anmeldung = await veranstaltungAnmeldungRepository.findById(id);
    if (!anmeldung) {
      res.status(404).json({ success: false, message: `Anmeldung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: anmeldung });
  } catch (error) {
    console.error('Error getting anmeldung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltunganmeldungen/veranstaltung/:veranstaltungId
export async function getByVeranstaltungId(req: Request, res: Response): Promise<void> {
  try {
    const veranstaltungId = parseInt(req.params.veranstaltungId, 10);
    if (isNaN(veranstaltungId)) {
      res.status(400).json({ success: false, message: 'Ungültige Veranstaltung-ID' } as ApiResponse<null>);
      return;
    }
    const anmeldungen = await veranstaltungAnmeldungRepository.findByVeranstaltungId(veranstaltungId);
    res.json({ success: true, data: anmeldungen });
  } catch (error) {
    console.error('Error getting anmeldungen by veranstaltung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltunganmeldungen/veranstaltung/:veranstaltungId/count
export async function getParticipantCount(req: Request, res: Response): Promise<void> {
  try {
    const veranstaltungId = parseInt(req.params.veranstaltungId, 10);
    if (isNaN(veranstaltungId)) {
      res.status(400).json({ success: false, message: 'Ungültige Veranstaltung-ID' } as ApiResponse<null>);
      return;
    }
    const count = await veranstaltungAnmeldungRepository.getParticipantCount(veranstaltungId);
    res.json({ success: true, data: count });
  } catch (error) {
    console.error('Error getting participant count:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltunganmeldungen/mitglied/:mitgliedId
export async function getByMitgliedId(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const anmeldungen = await veranstaltungAnmeldungRepository.findByMitgliedId(mitgliedId);
    res.json({ success: true, data: anmeldungen });
  } catch (error) {
    console.error('Error getting anmeldungen by mitglied:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/veranstaltunganmeldungen
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateVeranstaltungAnmeldungDto = req.body;
    const userId = (req as any).user?.userId;
    const anmeldung = await veranstaltungAnmeldungRepository.create(dto, userId);
    res.status(201).json({ success: true, data: anmeldung, message: 'Anmeldung erfolgreich' });
  } catch (error) {
    console.error('Error creating anmeldung:', error);
    res.status(500).json({ success: false, message: 'Fehler bei der Anmeldung' } as ApiResponse<null>);
  }
}

// PUT /api/veranstaltunganmeldungen/:id
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Anmeldung-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateVeranstaltungAnmeldungDto = req.body;
    const userId = (req as any).user?.userId;
    const anmeldung = await veranstaltungAnmeldungRepository.update(id, dto, userId);
    if (!anmeldung) {
      res.status(404).json({ success: false, message: `Anmeldung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: anmeldung, message: 'Anmeldung aktualisiert' });
  } catch (error) {
    console.error('Error updating anmeldung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// DELETE /api/veranstaltunganmeldungen/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Anmeldung-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await veranstaltungAnmeldungRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Anmeldung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Anmeldung storniert' });
  } catch (error) {
    console.error('Error deleting anmeldung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Stornieren' } as ApiResponse<null>);
  }
}

