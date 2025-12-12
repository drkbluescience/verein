/**
 * VeranstaltungZahlung Controller
 * Event Payment endpoints
 */

import { Request, Response } from 'express';
import { veranstaltungZahlungRepository } from '../repositories/veranstaltung-zahlung.repository';
import { ApiResponse, CreateVeranstaltungZahlungDto } from '../models';

// GET /api/veranstaltungzahlungen
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const zahlungen = await veranstaltungZahlungRepository.findAll();
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting veranstaltung zahlungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungzahlungen/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const zahlung = await veranstaltungZahlungRepository.findById(id);
    if (!zahlung) {
      res.status(404).json({ success: false, message: `Zahlung mit ID ${id} nicht gefunden` });
      return;
    }
    res.json({ success: true, data: zahlung });
  } catch (error) {
    console.error('Error getting veranstaltung zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungzahlungen/veranstaltung/:veranstaltungId
export async function getByVeranstaltungId(req: Request, res: Response): Promise<void> {
  try {
    const veranstaltungId = parseInt(req.params.veranstaltungId, 10);
    const zahlungen = await veranstaltungZahlungRepository.findByVeranstaltungId(veranstaltungId);
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting zahlungen by veranstaltung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungzahlungen/mitglied/:mitgliedId
export async function getByMitgliedId(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    const zahlungen = await veranstaltungZahlungRepository.findByMitgliedId(mitgliedId);
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting zahlungen by mitglied:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungzahlungen/veranstaltung/:veranstaltungId/total
export async function getTotalByVeranstaltungId(req: Request, res: Response): Promise<void> {
  try {
    const veranstaltungId = parseInt(req.params.veranstaltungId, 10);
    const total = await veranstaltungZahlungRepository.getTotalByVeranstaltungId(veranstaltungId);
    res.json({ success: true, data: total });
  } catch (error) {
    console.error('Error getting total:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/veranstaltungzahlungen
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateVeranstaltungZahlungDto = req.body;
    const userId = (req as any).user?.userId;
    const zahlung = await veranstaltungZahlungRepository.create(dto, userId);
    res.status(201).json({ success: true, data: zahlung, message: 'Zahlung erstellt' });
  } catch (error) {
    console.error('Error creating zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// DELETE /api/veranstaltungzahlungen/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = (req as any).user?.userId;
    const deleted = await veranstaltungZahlungRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Zahlung mit ID ${id} nicht gefunden` });
      return;
    }
    res.json({ success: true, message: 'Zahlung gelöscht' });
  } catch (error) {
    console.error('Error deleting zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

