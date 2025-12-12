/**
 * BriefVorlage Controller
 * Letter Templates endpoints
 */

import { Request, Response } from 'express';
import { briefVorlageRepository } from '../repositories';
import { ApiResponse, CreateBriefVorlageDto, UpdateBriefVorlageDto } from '../models';

// GET /api/briefvorlagen/verein/:vereinId - Get templates by Verein
export async function getByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const vorlagen = await briefVorlageRepository.findByVereinId(vereinId);
    res.json({ success: true, data: vorlagen });
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/briefvorlagen/verein/:vereinId/active - Get active templates
export async function getActiveByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const vorlagen = await briefVorlageRepository.findActiveByVereinId(vereinId);
    res.json({ success: true, data: vorlagen });
  } catch (error) {
    console.error('Error getting active templates:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/briefvorlagen/:id - Get template by ID
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Vorlage-ID' } as ApiResponse<null>);
      return;
    }
    const vorlage = await briefVorlageRepository.findById(id);
    if (!vorlage) {
      res.status(404).json({ success: false, message: `Vorlage mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: vorlage });
  } catch (error) {
    console.error('Error getting template:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/briefvorlagen/verein/:vereinId/category/:kategorie
export async function getByCategory(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    const kategorie = req.params.kategorie;
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const vorlagen = await briefVorlageRepository.findByCategory(vereinId, kategorie);
    res.json({ success: true, data: vorlagen });
  } catch (error) {
    console.error('Error getting templates by category:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/briefvorlagen/verein/:vereinId/categories
export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const categories = await briefVorlageRepository.getCategories(vereinId);
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/briefvorlagen - Create template
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateBriefVorlageDto = req.body;
    const userId = (req as any).user?.userId;
    const vorlage = await briefVorlageRepository.create(dto, userId);
    res.status(201).json({ success: true, data: vorlage, message: 'Vorlage erfolgreich erstellt' });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/briefvorlagen/:id - Update template
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Vorlage-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateBriefVorlageDto = req.body;
    const userId = (req as any).user?.userId;
    const vorlage = await briefVorlageRepository.update(id, dto, userId);
    if (!vorlage) {
      res.status(404).json({ success: false, message: `Vorlage mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: vorlage, message: 'Vorlage erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// DELETE /api/briefvorlagen/:id - Delete template
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Vorlage-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await briefVorlageRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Vorlage mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Vorlage erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

