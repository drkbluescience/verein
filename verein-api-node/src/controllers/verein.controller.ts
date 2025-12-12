/**
 * Verein Controller
 * Handles Verein (Association) endpoints
 */

import { Request, Response } from 'express';
import { vereinRepository } from '../repositories';
import { ApiResponse, CreateVereinDto, UpdateVereinDto } from '../models';

// GET /api/vereine - Get all Vereine
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const vereine = await vereinRepository.findAll();
    res.json({
      success: true,
      data: vereine,
    });
  } catch (error) {
    console.error('Error getting all Vereine:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Vereine',
    } as ApiResponse<null>);
  }
}

// GET /api/vereine/active - Get active Vereine
export async function getActive(req: Request, res: Response): Promise<void> {
  try {
    const vereine = await vereinRepository.findActive();
    res.json({
      success: true,
      data: vereine,
    });
  } catch (error) {
    console.error('Error getting active Vereine:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der aktiven Vereine',
    } as ApiResponse<null>);
  }
}

// GET /api/vereine/:id - Get Verein by ID
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Verein-ID',
      } as ApiResponse<null>);
      return;
    }

    const verein = await vereinRepository.findById(id);
    if (!verein) {
      res.status(404).json({
        success: false,
        message: `Verein mit ID ${id} nicht gefunden`,
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: verein,
    });
  } catch (error) {
    console.error('Error getting Verein:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen des Vereins',
    } as ApiResponse<null>);
  }
}

// GET /api/vereine/:id/full-details - Get Verein with full details
export async function getFullDetails(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Verein-ID',
      } as ApiResponse<null>);
      return;
    }

    const verein = await vereinRepository.findWithDetails(id);
    if (!verein) {
      res.status(404).json({
        success: false,
        message: `Verein mit ID ${id} nicht gefunden`,
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: verein,
    });
  } catch (error) {
    console.error('Error getting Verein details:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Vereinsdetails',
    } as ApiResponse<null>);
  }
}

// POST /api/vereine - Create new Verein
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateVereinDto = req.body;

    if (!dto.name) {
      res.status(400).json({
        success: false,
        message: 'Vereinsname ist erforderlich',
      } as ApiResponse<null>);
      return;
    }

    const userId = (req as any).user?.userId;
    const verein = await vereinRepository.create(dto, userId);

    res.status(201).json({
      success: true,
      data: verein,
      message: 'Verein erfolgreich erstellt',
    });
  } catch (error) {
    console.error('Error creating Verein:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Erstellen des Vereins',
    } as ApiResponse<null>);
  }
}

// PUT /api/vereine/:id - Update Verein
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Verein-ID',
      } as ApiResponse<null>);
      return;
    }

    const dto: UpdateVereinDto = req.body;
    const userId = (req as any).user?.userId;
    const verein = await vereinRepository.update(id, dto, userId);

    if (!verein) {
      res.status(404).json({
        success: false,
        message: `Verein mit ID ${id} nicht gefunden`,
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: verein,
      message: 'Verein erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Error updating Verein:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Aktualisieren des Vereins',
    } as ApiResponse<null>);
  }
}

// DELETE /api/vereine/:id - Delete Verein (soft delete)
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Verein-ID',
      } as ApiResponse<null>);
      return;
    }

    const userId = (req as any).user?.userId;
    const success = await vereinRepository.softDelete(id, userId);

    if (!success) {
      res.status(404).json({
        success: false,
        message: `Verein mit ID ${id} nicht gefunden`,
      } as ApiResponse<null>);
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting Verein:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Löschen des Vereins',
    } as ApiResponse<null>);
  }
}

