/**
 * MitgliedFamilie Controller
 * Member Family Relationships endpoints
 */

import { Request, Response } from 'express';
import { mitgliedFamilieRepository } from '../repositories';
import { ApiResponse, CreateMitgliedFamilieDto, UpdateMitgliedFamilieDto } from '../models';

// GET /api/mitgliedfamilien - Get all
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const familien = await mitgliedFamilieRepository.findAll();
    res.json({ success: true, data: familien });
  } catch (error) {
    console.error('Error getting familien:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/mitgliedfamilien/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Familien-ID' } as ApiResponse<null>);
      return;
    }
    const familie = await mitgliedFamilieRepository.findById(id);
    if (!familie) {
      res.status(404).json({ success: false, message: `Familienbeziehung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: familie });
  } catch (error) {
    console.error('Error getting familie:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/mitgliedfamilien/mitglied/:mitgliedId
export async function getByMitgliedId(req: Request, res: Response): Promise<void> {
  try {
    const mitgliedId = parseInt(req.params.mitgliedId, 10);
    if (isNaN(mitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const activeOnly = req.query.activeOnly !== 'false';
    const familien = await mitgliedFamilieRepository.findByMitgliedId(mitgliedId, !activeOnly);
    res.json({ success: true, data: familien });
  } catch (error) {
    console.error('Error getting familien by mitglied:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/mitgliedfamilien/mitglied/:parentMitgliedId/children
export async function getChildren(req: Request, res: Response): Promise<void> {
  try {
    const parentMitgliedId = parseInt(req.params.parentMitgliedId, 10);
    if (isNaN(parentMitgliedId)) {
      res.status(400).json({ success: false, message: 'Ungültige Mitglied-ID' } as ApiResponse<null>);
      return;
    }
    const children = await mitgliedFamilieRepository.getChildren(parentMitgliedId);
    res.json({ success: true, data: children });
  } catch (error) {
    console.error('Error getting children:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/mitgliedfamilien
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateMitgliedFamilieDto = req.body;
    const userId = (req as any).user?.userId;
    const familie = await mitgliedFamilieRepository.create(dto, userId);
    res.status(201).json({ success: true, data: familie, message: 'Familienbeziehung erstellt' });
  } catch (error) {
    console.error('Error creating familie:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/mitgliedfamilien/:id
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Familien-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateMitgliedFamilieDto = req.body;
    const userId = (req as any).user?.userId;
    const familie = await mitgliedFamilieRepository.update(id, dto, userId);
    if (!familie) {
      res.status(404).json({ success: false, message: `Familienbeziehung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: familie, message: 'Familienbeziehung aktualisiert' });
  } catch (error) {
    console.error('Error updating familie:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// DELETE /api/mitgliedfamilien/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Familien-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await mitgliedFamilieRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Familienbeziehung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Familienbeziehung gelöscht' });
  } catch (error) {
    console.error('Error deleting familie:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

