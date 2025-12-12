/**
 * Mitglied Controller
 * Handles Member endpoints
 */

import { Request, Response } from 'express';
import { mitgliedRepository } from '../repositories';
import { ApiResponse, CreateMitgliedDto, UpdateMitgliedDto } from '../models';

// GET /api/mitglieder - Get all Mitglieder with pagination
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.pageNumber as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    const result = await mitgliedRepository.findPaginated({ page, pageSize });
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error getting Mitglieder:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Mitglieder',
    } as ApiResponse<null>);
  }
}

// GET /api/mitglieder/:id - Get Mitglied by ID
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Mitglied-ID',
      } as ApiResponse<null>);
      return;
    }

    const mitglied = await mitgliedRepository.findById(id);
    if (!mitglied) {
      res.status(404).json({
        success: false,
        message: `Mitglied mit ID ${id} nicht gefunden`,
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: mitglied,
    });
  } catch (error) {
    console.error('Error getting Mitglied:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen des Mitglieds',
    } as ApiResponse<null>);
  }
}

// GET /api/mitglieder/verein/:vereinId - Get Mitglieder by Verein
export async function getByVerein(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Verein-ID',
      } as ApiResponse<null>);
      return;
    }

    const activeOnly = req.query.activeOnly !== 'false';
    const mitglieder = await mitgliedRepository.findByVereinId(vereinId, activeOnly);

    res.json({
      success: true,
      data: mitglieder,
    });
  } catch (error) {
    console.error('Error getting Mitglieder by Verein:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Mitglieder',
    } as ApiResponse<null>);
  }
}

// GET /api/mitglieder/search - Search Mitglieder by name
export async function search(req: Request, res: Response): Promise<void> {
  try {
    const searchTerm = req.query.searchTerm as string;
    const vereinId = req.query.vereinId ? parseInt(req.query.vereinId as string, 10) : undefined;

    if (!searchTerm) {
      res.status(400).json({
        success: false,
        message: 'Suchbegriff ist erforderlich',
      } as ApiResponse<null>);
      return;
    }

    const mitglieder = await mitgliedRepository.searchByName(searchTerm, vereinId);
    res.json({
      success: true,
      data: mitglieder,
    });
  } catch (error) {
    console.error('Error searching Mitglieder:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler bei der Suche',
    } as ApiResponse<null>);
  }
}

// GET /api/mitglieder/statistics/verein/:vereinId - Get membership statistics
export async function getStatistics(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Verein-ID',
      } as ApiResponse<null>);
      return;
    }

    const statistics = await mitgliedRepository.getMembershipStatistics(vereinId);
    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Statistiken',
    } as ApiResponse<null>);
  }
}

// POST /api/mitglieder - Create new Mitglied
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateMitgliedDto = req.body;
    const userId = (req as any).user?.userId;
    const mitglied = await mitgliedRepository.create(dto, userId);

    res.status(201).json({
      success: true,
      data: mitglied,
      message: 'Mitglied erfolgreich erstellt',
    });
  } catch (error) {
    console.error('Error creating Mitglied:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Erstellen des Mitglieds',
    } as ApiResponse<null>);
  }
}

// PUT /api/mitglieder/:id - Update Mitglied
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Mitglied-ID',
      } as ApiResponse<null>);
      return;
    }

    const dto: UpdateMitgliedDto = req.body;
    const userId = (req as any).user?.userId;
    const mitglied = await mitgliedRepository.update(id, dto, userId);

    if (!mitglied) {
      res.status(404).json({
        success: false,
        message: `Mitglied mit ID ${id} nicht gefunden`,
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: mitglied,
      message: 'Mitglied erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Error updating Mitglied:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Aktualisieren des Mitglieds',
    } as ApiResponse<null>);
  }
}

// DELETE /api/mitglieder/:id - Delete Mitglied (soft delete)
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Mitglied-ID',
      } as ApiResponse<null>);
      return;
    }

    const userId = (req as any).user?.userId;
    const success = await mitgliedRepository.softDelete(id, userId);

    if (!success) {
      res.status(404).json({
        success: false,
        message: `Mitglied mit ID ${id} nicht gefunden`,
      } as ApiResponse<null>);
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting Mitglied:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Löschen des Mitglieds',
    } as ApiResponse<null>);
  }
}

// POST /api/mitglieder/:id/set-active - Set active status
export async function setActiveStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { isActive } = req.body;

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Ungültige Mitglied-ID',
      } as ApiResponse<null>);
      return;
    }

    const userId = (req as any).user?.userId;
    const mitglied = await mitgliedRepository.setActiveStatus(id, isActive, userId);

    if (!mitglied) {
      res.status(404).json({
        success: false,
        message: `Mitglied mit ID ${id} nicht gefunden`,
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: mitglied,
      message: isActive ? 'Mitglied aktiviert' : 'Mitglied deaktiviert',
    });
  } catch (error) {
    console.error('Error setting active status:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Ändern des Status',
    } as ApiResponse<null>);
  }
}

