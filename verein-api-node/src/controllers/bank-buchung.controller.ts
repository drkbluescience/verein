/**
 * BankBuchung Controller
 * Bank Transaction endpoints
 */

import { Request, Response } from 'express';
import { bankBuchungRepository } from '../repositories/bank-buchung.repository';
import { ApiResponse, CreateBankBuchungDto, UpdateBankBuchungDto } from '../models';

// GET /api/bankbuchungen - Get all
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const buchungen = await bankBuchungRepository.findAll(includeDeleted);
    res.json({ success: true, data: buchungen });
  } catch (error) {
    console.error('Error getting bankbuchungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/bankbuchungen/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Buchung-ID' } as ApiResponse<null>);
      return;
    }
    const buchung = await bankBuchungRepository.findById(id);
    if (!buchung) {
      res.status(404).json({ success: false, message: `Buchung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: buchung });
  } catch (error) {
    console.error('Error getting bankbuchung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/bankbuchungen/verein/:vereinId
export async function getByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const includeDeleted = req.query.includeDeleted === 'true';
    const buchungen = await bankBuchungRepository.findByVereinId(vereinId, includeDeleted);
    res.json({ success: true, data: buchungen });
  } catch (error) {
    console.error('Error getting bankbuchungen by verein:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/bankbuchungen/bankkonto/:bankKontoId
export async function getByBankKontoId(req: Request, res: Response): Promise<void> {
  try {
    const bankKontoId = parseInt(req.params.bankKontoId, 10);
    if (isNaN(bankKontoId)) {
      res.status(400).json({ success: false, message: 'Ungültige BankKonto-ID' } as ApiResponse<null>);
      return;
    }
    const includeDeleted = req.query.includeDeleted === 'true';
    const buchungen = await bankBuchungRepository.findByBankKontoId(bankKontoId, includeDeleted);
    res.json({ success: true, data: buchungen });
  } catch (error) {
    console.error('Error getting bankbuchungen by bankkonto:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/bankbuchungen/date-range
export async function getByDateRange(req: Request, res: Response): Promise<void> {
  try {
    const fromDate = new Date(req.query.fromDate as string);
    const toDate = new Date(req.query.toDate as string);
    const bankKontoId = req.query.bankKontoId ? parseInt(req.query.bankKontoId as string, 10) : undefined;

    const buchungen = await bankBuchungRepository.findByDateRange(fromDate, toDate, bankKontoId);
    res.json({ success: true, data: buchungen });
  } catch (error) {
    console.error('Error getting bankbuchungen by date range:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/bankbuchungen/bankkonto/:bankKontoId/total
export async function getTotalAmount(req: Request, res: Response): Promise<void> {
  try {
    const bankKontoId = parseInt(req.params.bankKontoId, 10);
    if (isNaN(bankKontoId)) {
      res.status(400).json({ success: false, message: 'Ungültige BankKonto-ID' } as ApiResponse<null>);
      return;
    }
    const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
    const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;

    const total = await bankBuchungRepository.getTotalAmount(bankKontoId, fromDate, toDate);
    res.json({ success: true, data: total });
  } catch (error) {
    console.error('Error getting total amount:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/bankbuchungen
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateBankBuchungDto = req.body;
    const userId = (req as any).user?.userId;
    const buchung = await bankBuchungRepository.create(dto, userId);
    res.status(201).json({ success: true, data: buchung, message: 'Buchung erstellt' });
  } catch (error) {
    console.error('Error creating bankbuchung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// DELETE /api/bankbuchungen/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Buchung-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await bankBuchungRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Buchung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Buchung gelöscht' });
  } catch (error) {
    console.error('Error deleting bankbuchung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

