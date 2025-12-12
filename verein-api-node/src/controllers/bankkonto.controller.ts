/**
 * Bankkonto Controller
 * Bank Account endpoints
 */

import { Request, Response } from 'express';
import { bankkontoRepository } from '../repositories/bankkonto.repository';
import { ApiResponse, CreateBankkontoDto, UpdateBankkontoDto } from '../models';

// GET /api/bankkonten - Get all
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const konten = await bankkontoRepository.findAll();
    res.json({ success: true, data: konten });
  } catch (error) {
    console.error('Error getting bankkonten:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/bankkonten/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Bankkonto-ID' } as ApiResponse<null>);
      return;
    }
    const konto = await bankkontoRepository.findById(id);
    if (!konto) {
      res.status(404).json({ success: false, message: `Bankkonto mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: konto });
  } catch (error) {
    console.error('Error getting bankkonto:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/bankkonten/verein/:vereinId
export async function getByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const konten = await bankkontoRepository.findByVereinId(vereinId);
    res.json({ success: true, data: konten });
  } catch (error) {
    console.error('Error getting bankkonten by verein:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/bankkonten/iban/:iban
export async function getByIban(req: Request, res: Response): Promise<void> {
  try {
    const iban = req.params.iban;
    const konto = await bankkontoRepository.findByIban(iban);
    if (!konto) {
      res.status(404).json({ success: false, message: `Bankkonto mit IBAN ${iban} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: konto });
  } catch (error) {
    console.error('Error getting bankkonto by IBAN:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/bankkonten
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateBankkontoDto = req.body;
    const userId = (req as any).user?.userId;
    const konto = await bankkontoRepository.create(dto, userId);
    res.status(201).json({ success: true, data: konto, message: 'Bankkonto erfolgreich erstellt' });
  } catch (error) {
    console.error('Error creating bankkonto:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/bankkonten/:id
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Bankkonto-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateBankkontoDto = req.body;
    const userId = (req as any).user?.userId;
    const konto = await bankkontoRepository.update(id, dto, userId);
    if (!konto) {
      res.status(404).json({ success: false, message: `Bankkonto mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: konto, message: 'Bankkonto aktualisiert' });
  } catch (error) {
    console.error('Error updating bankkonto:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// PATCH /api/bankkonten/:id/set-default
export async function setAsDefault(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Bankkonto-ID' } as ApiResponse<null>);
      return;
    }
    const konto = await bankkontoRepository.findById(id);
    if (!konto) {
      res.status(404).json({ success: false, message: `Bankkonto mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    await bankkontoRepository.setAsStandard(konto.vereinId, id);
    const updated = await bankkontoRepository.findById(id);
    res.json({ success: true, data: updated, message: 'Standardkonto gesetzt' });
  } catch (error) {
    console.error('Error setting default bankkonto:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Setzen' } as ApiResponse<null>);
  }
}

// POST /api/bankkonten/validate-iban
export async function validateIban(req: Request, res: Response): Promise<void> {
  try {
    const { iban } = req.body;
    const isValid = bankkontoRepository.isValidIban(iban);
    res.json({ success: true, data: { iban, isValid, message: isValid ? 'Valid IBAN format' : 'Invalid IBAN format' } });
  } catch (error) {
    console.error('Error validating IBAN:', error);
    res.status(500).json({ success: false, message: 'Fehler bei der Validierung' } as ApiResponse<null>);
  }
}

// DELETE /api/bankkonten/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Bankkonto-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await bankkontoRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Bankkonto mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Bankkonto gelöscht' });
  } catch (error) {
    console.error('Error deleting bankkonto:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

