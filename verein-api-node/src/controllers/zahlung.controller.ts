/**
 * Zahlung Controller
 * Handles Member Payments endpoints
 */

import { Request, Response } from 'express';
import { zahlungRepository } from '../repositories';
import { ApiResponse, CreateMitgliedZahlungDto, UpdateMitgliedZahlungDto } from '../models';

// GET /api/zahlungen - Get all Zahlungen
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const zahlungen = await zahlungRepository.findAll();
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting Zahlungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Zahlungen' } as ApiResponse<null>);
  }
}

// GET /api/zahlungen/:id - Get Zahlung by ID
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Zahlung-ID' } as ApiResponse<null>);
      return;
    }
    const zahlung = await zahlungRepository.findById(id);
    if (!zahlung) {
      res.status(404).json({ success: false, message: `Zahlung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: zahlung });
  } catch (error) {
    console.error('Error getting Zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Zahlung' } as ApiResponse<null>);
  }
}

// GET /api/zahlungen/mitglied/:mitgliedId - Get by Mitglied
export async function getByMitglied(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const includeDeleted = req.query.includeDeleted === 'true';
    const zahlungen = await zahlungRepository.findByMitgliedId(mitgliedId, includeDeleted);
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting Zahlungen by Mitglied:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Zahlungen' } as ApiResponse<null>);
  }
}

// GET /api/zahlungen/verein/:vereinId - Get by Verein
export async function getByVerein(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const includeDeleted = req.query.includeDeleted === 'true';
    const zahlungen = await zahlungRepository.findByVereinId(vereinId, includeDeleted);
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting Zahlungen by Verein:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Zahlungen' } as ApiResponse<null>);
  }
}

// GET /api/zahlungen/date-range - Get by date range
export async function getByDateRange(req: Request, res: Response): Promise<void> {
  try {
    const fromDate = req.query.fromDate as string;
    const toDate = req.query.toDate as string;
    const vereinId = req.query.vereinId ? parseInt(req.query.vereinId as string, 10) : undefined;

    if (!fromDate || !toDate) {
      res.status(400).json({ success: false, message: 'fromDate und toDate sind erforderlich' } as ApiResponse<null>);
      return;
    }

    const zahlungen = await zahlungRepository.findByDateRange(fromDate, toDate, vereinId);
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting Zahlungen by date range:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/zahlungen/mitglied/:mitgliedId/total
export async function getTotalPayment(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const fromDate = req.query.fromDate as string | undefined;
    const toDate = req.query.toDate as string | undefined;
    const total = await zahlungRepository.getTotalPaymentAmount(mitgliedId, fromDate, toDate);
    res.json({ success: true, data: total });
  } catch (error) {
    console.error('Error getting total payment:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/zahlungen - Create Zahlung
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateMitgliedZahlungDto = req.body;
    const userId = (req as any).user?.userId;
    const zahlung = await zahlungRepository.create(dto, userId);
    res.status(201).json({ success: true, data: zahlung, message: 'Zahlung erfolgreich erstellt' });
  } catch (error) {
    console.error('Error creating Zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/zahlungen/:id - Update Zahlung
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Zahlung-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateMitgliedZahlungDto = req.body;
    const userId = (req as any).user?.userId;
    const zahlung = await zahlungRepository.update(id, dto, userId);
    if (!zahlung) {
      res.status(404).json({ success: false, message: `Zahlung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: zahlung, message: 'Zahlung erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Error updating Zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// DELETE /api/zahlungen/:id - Delete Zahlung
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Zahlung-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await zahlungRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Zahlung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Zahlung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting Zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

