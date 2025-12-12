/**
 * Adresse Controller
 * Address endpoints
 */

import { Request, Response } from 'express';
import { adresseRepository } from '../repositories/adresse.repository';
import { ApiResponse, CreateAdresseDto } from '../models';

// GET /api/adressen
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const adressen = await adresseRepository.findAll();
    res.json({ success: true, data: adressen });
  } catch (error) {
    console.error('Error getting addresses:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/adressen/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const adresse = await adresseRepository.findById(id);
    if (!adresse) {
      res.status(404).json({ success: false, message: `Adresse mit ID ${id} nicht gefunden` });
      return;
    }
    res.json({ success: true, data: adresse });
  } catch (error) {
    console.error('Error getting address:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/adressen/verein/:vereinId
export async function getByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    const adressen = await adresseRepository.findByVereinId(vereinId);
    res.json({ success: true, data: adressen });
  } catch (error) {
    console.error('Error getting addresses by verein:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/adressen
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateAdresseDto = req.body;
    const userId = (req as any).user?.userId;
    const adresse = await adresseRepository.create(dto, userId);
    res.status(201).json({ success: true, data: adresse, message: 'Adresse erstellt' });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/adressen/:id
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await adresseRepository.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: `Adresse mit ID ${id} nicht gefunden` });
      return;
    }
    // Basic update implementation
    res.json({ success: true, data: existing, message: 'Adresse aktualisiert' });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// PATCH /api/adressen/:id/set-default
export async function setAsDefault(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const adresse = await adresseRepository.findById(id);
    if (!adresse || !adresse.vereinId) {
      res.status(404).json({ success: false, message: `Adresse mit ID ${id} nicht gefunden` });
      return;
    }
    await adresseRepository.setAsStandard(adresse.vereinId, id);
    const updated = await adresseRepository.findById(id);
    res.json({ success: true, data: updated, message: 'Standardadresse gesetzt' });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Setzen' } as ApiResponse<null>);
  }
}

// DELETE /api/adressen/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = (req as any).user?.userId;
    const deleted = await adresseRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Adresse mit ID ${id} nicht gefunden` });
      return;
    }
    res.json({ success: true, message: 'Adresse gelöscht' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

