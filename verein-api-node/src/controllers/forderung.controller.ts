/**
 * Forderung Controller
 * Handles Member Claims/Invoices endpoints
 */

import { Request, Response } from 'express';
import { forderungRepository } from '../repositories';
import { ApiResponse, CreateMitgliedForderungDto, UpdateMitgliedForderungDto } from '../models';

// GET /api/forderungen - Get all Forderungen
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const forderungen = await forderungRepository.findAll();
    res.json({ success: true, data: forderungen });
  } catch (error) {
    console.error('Error getting Forderungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Forderungen' } as ApiResponse<null>);
  }
}

// GET /api/forderungen/:id - Get Forderung by ID
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Forderung-ID' } as ApiResponse<null>);
      return;
    }
    const forderung = await forderungRepository.findById(id);
    if (!forderung) {
      res.status(404).json({ success: false, message: `Forderung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: forderung });
  } catch (error) {
    console.error('Error getting Forderung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Forderung' } as ApiResponse<null>);
  }
}

// GET /api/forderungen/mitglied/:mitgliedId - Get by Mitglied
export async function getByMitglied(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const includeDeleted = req.query.includeDeleted === 'true';
    const forderungen = await forderungRepository.findByMitgliedId(mitgliedId, includeDeleted);
    res.json({ success: true, data: forderungen });
  } catch (error) {
    console.error('Error getting Forderungen by Mitglied:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Forderungen' } as ApiResponse<null>);
  }
}

// GET /api/forderungen/verein/:vereinId - Get by Verein
export async function getByVerein(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const includeDeleted = req.query.includeDeleted === 'true';
    const forderungen = await forderungRepository.findByVereinId(vereinId, includeDeleted);
    res.json({ success: true, data: forderungen });
  } catch (error) {
    console.error('Error getting Forderungen by Verein:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Forderungen' } as ApiResponse<null>);
  }
}

// GET /api/forderungen/unpaid - Get unpaid Forderungen
export async function getUnpaid(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = req.query.vereinId ? parseInt(req.query.vereinId as string, 10) : undefined;
    const forderungen = await forderungRepository.findUnpaid(vereinId);
    res.json({ success: true, data: forderungen });
  } catch (error) {
    console.error('Error getting unpaid Forderungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/forderungen/overdue - Get overdue Forderungen
export async function getOverdue(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = req.query.vereinId ? parseInt(req.query.vereinId as string, 10) : undefined;
    const forderungen = await forderungRepository.findOverdue(vereinId);
    res.json({ success: true, data: forderungen });
  } catch (error) {
    console.error('Error getting overdue Forderungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/forderungen/mitglied/:mitgliedId/total-unpaid
export async function getTotalUnpaid(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const total = await forderungRepository.getTotalUnpaidAmount(mitgliedId);
    res.json({ success: true, data: total });
  } catch (error) {
    console.error('Error getting total unpaid:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/forderungen/mitglied/:mitgliedId/summary
export async function getMitgliedSummary(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const summary = await forderungRepository.getMitgliedFinanzSummary(mitgliedId);
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error getting Mitglied summary:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/forderungen - Create Forderung
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateMitgliedForderungDto = req.body;
    const userId = (req as any).user?.userId;
    const forderung = await forderungRepository.create(dto, userId);
    res.status(201).json({ success: true, data: forderung, message: 'Forderung erfolgreich erstellt' });
  } catch (error) {
    console.error('Error creating Forderung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/forderungen/:id - Update Forderung
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Forderung-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateMitgliedForderungDto = req.body;
    const userId = (req as any).user?.userId;
    const forderung = await forderungRepository.update(id, dto, userId);
    if (!forderung) {
      res.status(404).json({ success: false, message: `Forderung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: forderung, message: 'Forderung erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Error updating Forderung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// DELETE /api/forderungen/:id - Delete Forderung
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Forderung-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await forderungRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Forderung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Forderung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting Forderung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

