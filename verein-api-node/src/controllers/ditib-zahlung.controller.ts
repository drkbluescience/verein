/**
 * VereinDitibZahlung Controller
 * DITIB Payment endpoints
 */

import { Request, Response } from 'express';
import { ditibZahlungRepository } from '../repositories/ditib-zahlung.repository';
import { ApiResponse, CreateVereinDitibZahlungDto } from '../models';

// GET /api/vereinditibzahlungen
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const zahlungen = await ditibZahlungRepository.findAll();
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting DITIB zahlungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/vereinditibzahlungen/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const zahlung = await ditibZahlungRepository.findById(id);
    if (!zahlung) {
      res.status(404).json({ success: false, message: `DITIB Zahlung mit ID ${id} nicht gefunden` });
      return;
    }
    res.json({ success: true, data: zahlung });
  } catch (error) {
    console.error('Error getting DITIB zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/vereinditibzahlungen/verein/:vereinId
export async function getByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    const zahlungen = await ditibZahlungRepository.findByVereinId(vereinId);
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting DITIB zahlungen by verein:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/vereinditibzahlungen/periode/:zahlungsperiode
export async function getByPeriode(req: Request, res: Response): Promise<void> {
  try {
    const zahlungsperiode = req.params.zahlungsperiode;
    const vereinId = req.query.vereinId ? parseInt(req.query.vereinId as string, 10) : undefined;
    const zahlungen = await ditibZahlungRepository.findByPeriode(zahlungsperiode, vereinId);
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting DITIB zahlungen by periode:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/vereinditibzahlungen/pending
export async function getPending(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = req.query.vereinId ? parseInt(req.query.vereinId as string, 10) : undefined;
    const zahlungen = await ditibZahlungRepository.findPending(vereinId);
    res.json({ success: true, data: zahlungen });
  } catch (error) {
    console.error('Error getting pending DITIB zahlungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/vereinditibzahlungen
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateVereinDitibZahlungDto = req.body;
    const userId = (req as any).user?.userId;
    const zahlung = await ditibZahlungRepository.create(dto, userId);
    res.status(201).json({ success: true, data: zahlung, message: 'DITIB Zahlung erstellt' });
  } catch (error) {
    console.error('Error creating DITIB zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// DELETE /api/vereinditibzahlungen/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = (req as any).user?.userId;
    const deleted = await ditibZahlungRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `DITIB Zahlung mit ID ${id} nicht gefunden` });
      return;
    }
    res.json({ success: true, message: 'DITIB Zahlung gelöscht' });
  } catch (error) {
    console.error('Error deleting DITIB zahlung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

