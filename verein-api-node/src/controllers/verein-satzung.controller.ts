/**
 * VereinSatzung Controller
 * Association Statutes/Bylaws endpoints
 */

import { Request, Response } from 'express';
import { vereinSatzungRepository } from '../repositories';
import { ApiResponse } from '../models';
import { UpdateVereinSatzungDto } from '../models/verein.model';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads/satzungen';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// GET /api/vereinsatzung/verein/:vereinId
export async function getByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const satzungen = await vereinSatzungRepository.findByVereinId(vereinId);
    res.json({ success: true, data: satzungen });
  } catch (error) {
    console.error('Error getting satzungen:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/vereinsatzung/verein/:vereinId/active
export async function getActiveByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const satzung = await vereinSatzungRepository.findActiveByVereinId(vereinId);
    if (!satzung) {
      res.status(404).json({ success: false, message: 'Keine aktive Satzung gefunden' } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: satzung });
  } catch (error) {
    console.error('Error getting active satzung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/vereinsatzung/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Satzung-ID' } as ApiResponse<null>);
      return;
    }
    const satzung = await vereinSatzungRepository.findById(id);
    if (!satzung) {
      res.status(404).json({ success: false, message: `Satzung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: satzung });
  } catch (error) {
    console.error('Error getting satzung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/vereinsatzung/upload/:vereinId - Upload new satzung
export async function upload(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }

    const file = (req as any).file;
    if (!file) {
      res.status(400).json({ success: false, message: 'Keine Datei hochgeladen' } as ApiResponse<null>);
      return;
    }

    const { satzungVom, bemerkung, setAsActive } = req.body;
    const userId = (req as any).user?.userId;

    // Save file to disk
    const fileName = `${vereinId}_${Date.now()}_${file.originalname}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const satzung = await vereinSatzungRepository.create({
      vereinId,
      dosyaPfad: filePath,
      dosyaAdi: file.originalname,
      dosyaBoyutu: file.size,
      satzungVom: satzungVom || new Date().toISOString(),
      bemerkung,
      setAsActive: setAsActive !== 'false',
    }, userId);

    res.status(201).json({ success: true, data: satzung, message: 'Satzung erfolgreich hochgeladen' });
  } catch (error) {
    console.error('Error uploading satzung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Hochladen' } as ApiResponse<null>);
  }
}

// GET /api/vereinsatzung/:id/download
export async function download(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Satzung-ID' } as ApiResponse<null>);
      return;
    }

    const satzung = await vereinSatzungRepository.findById(id);
    if (!satzung || !satzung.dosyaPfad) {
      res.status(404).json({ success: false, message: 'Satzung nicht gefunden' } as ApiResponse<null>);
      return;
    }

    if (!fs.existsSync(satzung.dosyaPfad)) {
      res.status(404).json({ success: false, message: 'Datei nicht gefunden' } as ApiResponse<null>);
      return;
    }

    const fileName = satzung.dosyaAdi || 'satzung.pdf';
    res.download(satzung.dosyaPfad, fileName);
  } catch (error) {
    console.error('Error downloading satzung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Herunterladen' } as ApiResponse<null>);
  }
}

// PUT /api/vereinsatzung/:id
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Satzung-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateVereinSatzungDto = req.body;
    const userId = (req as any).user?.userId;
    const satzung = await vereinSatzungRepository.update(id, dto, userId);
    if (!satzung) {
      res.status(404).json({ success: false, message: `Satzung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: satzung, message: 'Satzung erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Error updating satzung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// POST /api/vereinsatzung/:id/set-active
export async function setActive(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Satzung-ID' } as ApiResponse<null>);
      return;
    }
    const success = await vereinSatzungRepository.setActive(id);
    if (!success) {
      res.status(404).json({ success: false, message: `Satzung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Satzung als aktiv gesetzt' });
  } catch (error) {
    console.error('Error setting active:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Setzen' } as ApiResponse<null>);
  }
}

// DELETE /api/vereinsatzung/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Satzung-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await vereinSatzungRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Satzung mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Satzung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting satzung:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

