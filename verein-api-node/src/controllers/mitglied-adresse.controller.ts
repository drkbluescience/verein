/**
 * MitgliedAdresse Controller
 * Member Address endpoints
 */

import { Request, Response } from 'express';
import { mitgliedAdresseRepository } from '../repositories';
import { ApiResponse, CreateMitgliedAdresseDto, UpdateMitgliedAdresseDto } from '../models';

// GET /api/mitgliedadressen - Get all
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const adressen = await mitgliedAdresseRepository.findAll();
    res.json({ success: true, data: adressen });
  } catch (error) {
    console.error('Error getting adressen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/mitgliedadressen/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Adresse-ID' } as ApiResponse<null>);
      return;
    }
    const adresse = await mitgliedAdresseRepository.findById(id);
    if (!adresse) {
      res.status(404).json({ success: false, message: `Adresse mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: adresse });
  } catch (error) {
    console.error('Error getting adresse:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/mitgliedadressen/mitglied/:mitgliedId
export async function getByMitgliedId(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const activeOnly = req.query.activeOnly !== 'false';
    const adressen = await mitgliedAdresseRepository.findByMitgliedId(mitgliedId, !activeOnly);
    res.json({ success: true, data: adressen });
  } catch (error) {
    console.error('Error getting adressen by mitglied:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/mitgliedadressen/mitglied/:mitgliedId/standard
export async function getStandardAddress(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const adresse = await mitgliedAdresseRepository.getStandardAddress(mitgliedId);
    if (!adresse) {
      res.status(404).json({ success: false, message: 'Keine Standardadresse gefunden' } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: adresse });
  } catch (error) {
    console.error('Error getting standard address:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/mitgliedadressen
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateMitgliedAdresseDto = req.body;
    const userId = (req as any).user?.userId;
    const adresse = await mitgliedAdresseRepository.create(dto, userId);
    res.status(201).json({ success: true, data: adresse, message: 'Adresse erfolgreich erstellt' });
  } catch (error) {
    console.error('Error creating adresse:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/mitgliedadressen/:id
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Adresse-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateMitgliedAdresseDto = req.body;
    const userId = (req as any).user?.userId;
    const adresse = await mitgliedAdresseRepository.update(id, dto, userId);
    if (!adresse) {
      res.status(404).json({ success: false, message: `Adresse mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: adresse, message: 'Adresse erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Error updating adresse:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// POST /api/mitgliedadressen/:mitgliedId/address/:addressId/set-standard
export async function setAsStandard(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    const addressId = parseInt(req.params.addressId, 10);
    if (isNaN(mitgliedId) || isNaN(addressId)) {
      res.status(400).json({ success: false, message: 'Ungültige ID' } as ApiResponse<null>);
      return;
    }
    await mitgliedAdresseRepository.setAsStandard(mitgliedId, addressId);
    const adresse = await mitgliedAdresseRepository.findById(addressId);
    res.json({ success: true, data: adresse, message: 'Standardadresse gesetzt' });
  } catch (error) {
    console.error('Error setting standard address:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Setzen' } as ApiResponse<null>);
  }
}

// DELETE /api/mitgliedadressen/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Adresse-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await mitgliedAdresseRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Adresse mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Adresse gelöscht' });
  } catch (error) {
    console.error('Error deleting adresse:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

