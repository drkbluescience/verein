/**
 * RechtlicheDaten Controller
 * Legal Data endpoints
 */

import { Request, Response } from 'express';
import { rechtlicheDatenRepository } from '../repositories/rechtliche-daten.repository';
import { ApiResponse, RechtlicheDaten } from '../models';

// GET /api/rechtlichedaten/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await rechtlicheDatenRepository.findById(id);
    if (!data) {
      res.status(404).json({ success: false, message: `RechtlicheDaten mit ID ${id} nicht gefunden` });
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting rechtliche daten:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/rechtlichedaten/verein/:vereinId
export async function getByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    const data = await rechtlicheDatenRepository.findByVereinId(vereinId);
    if (!data) {
      res.status(404).json({ success: false, message: `RechtlicheDaten für Verein ${vereinId} nicht gefunden` });
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting rechtliche daten by verein:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/rechtlichedaten
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: Partial<RechtlicheDaten> = req.body;
    const userId = (req as any).user?.userId;
    const data = await rechtlicheDatenRepository.create(dto, userId);
    res.status(201).json({ success: true, data, message: 'RechtlicheDaten erstellt' });
  } catch (error) {
    console.error('Error creating rechtliche daten:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/rechtlichedaten/:id
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const dto: Partial<RechtlicheDaten> = req.body;
    const userId = (req as any).user?.userId;
    const data = await rechtlicheDatenRepository.update(id, dto, userId);
    if (!data) {
      res.status(404).json({ success: false, message: `RechtlicheDaten mit ID ${id} nicht gefunden` });
      return;
    }
    res.json({ success: true, data, message: 'RechtlicheDaten aktualisiert' });
  } catch (error) {
    console.error('Error updating rechtliche daten:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// DELETE /api/rechtlichedaten/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = (req as any).user?.userId;
    const deleted = await rechtlicheDatenRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `RechtlicheDaten mit ID ${id} nicht gefunden` });
      return;
    }
    res.json({ success: true, message: 'RechtlicheDaten gelöscht' });
  } catch (error) {
    console.error('Error deleting rechtliche daten:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

