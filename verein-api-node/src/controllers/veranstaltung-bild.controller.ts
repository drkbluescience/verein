/**
 * VeranstaltungBild Controller
 * Event Image endpoints
 */

import { Request, Response } from 'express';
import { veranstaltungBildRepository } from '../repositories/veranstaltung-bild.repository';
import { ApiResponse, CreateVeranstaltungBildDto, UpdateVeranstaltungBildDto } from '../models';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'veranstaltungen');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// GET /api/veranstaltungbilder - Get all
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const bilder = await veranstaltungBildRepository.findAll();
    res.json({ success: true, data: bilder });
  } catch (error) {
    console.error('Error getting bilder:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungbilder/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Bild-ID' } as ApiResponse<null>);
      return;
    }
    const bild = await veranstaltungBildRepository.findById(id);
    if (!bild) {
      res.status(404).json({ success: false, message: `Bild mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: bild });
  } catch (error) {
    console.error('Error getting bild:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/veranstaltungbilder/veranstaltung/:veranstaltungId
export async function getByVeranstaltungId(req: Request, res: Response): Promise<void> {
  try {
    const veranstaltungId = parseInt(req.params.veranstaltungId, 10);
    if (isNaN(veranstaltungId)) {
      res.status(400).json({ success: false, message: 'Ungültige Veranstaltung-ID' } as ApiResponse<null>);
      return;
    }
    const bilder = await veranstaltungBildRepository.findByVeranstaltungId(veranstaltungId);
    res.json({ success: true, data: bilder });
  } catch (error) {
    console.error('Error getting bilder by veranstaltung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/veranstaltungbilder/upload/:veranstaltungId
export async function uploadImage(req: Request, res: Response): Promise<void> {
  try {
    const veranstaltungId = parseInt(req.params.veranstaltungId, 10);
    if (isNaN(veranstaltungId)) {
      res.status(400).json({ success: false, message: 'Ungültige Veranstaltung-ID' } as ApiResponse<null>);
      return;
    }
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Keine Datei hochgeladen' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const dto: CreateVeranstaltungBildDto = {
      veranstaltungId,
      bildPfad: `/uploads/veranstaltungen/${req.file.filename}`,
      bildName: req.file.originalname,
      bildTyp: req.file.mimetype,
      bildGroesse: req.file.size,
      titel: req.body.titel,
      reihenfolge: parseInt(req.body.reihenfolge, 10) || 1,
    };
    const bild = await veranstaltungBildRepository.create(dto, userId);
    res.status(201).json({ success: true, data: bild, message: 'Bild hochgeladen' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Hochladen' } as ApiResponse<null>);
  }
}

// POST /api/veranstaltungbilder
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateVeranstaltungBildDto = req.body;
    const userId = (req as any).user?.userId;
    const bild = await veranstaltungBildRepository.create(dto, userId);
    res.status(201).json({ success: true, data: bild, message: 'Bild erstellt' });
  } catch (error) {
    console.error('Error creating bild:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/veranstaltungbilder/:id
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Bild-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateVeranstaltungBildDto = req.body;
    const userId = (req as any).user?.userId;
    const bild = await veranstaltungBildRepository.update(id, dto, userId);
    if (!bild) {
      res.status(404).json({ success: false, message: `Bild mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: bild, message: 'Bild aktualisiert' });
  } catch (error) {
    console.error('Error updating bild:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// DELETE /api/veranstaltungbilder/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Bild-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await veranstaltungBildRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Bild mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Bild gelöscht' });
  } catch (error) {
    console.error('Error deleting bild:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

