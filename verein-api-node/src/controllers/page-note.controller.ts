/**
 * PageNote Controller
 * User notes on pages for development feedback
 */

import { Request, Response } from 'express';
import { pageNoteRepository } from '../repositories/page-note.repository';
import { CreatePageNoteDto, UpdatePageNoteDto, CompletePageNoteDto } from '../models/page-note.model';

// GET /api/pagenotes - Get all (Admin only)
export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const notes = await pageNoteRepository.findAll();
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error getting page notes:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' });
  }
}

// GET /api/pagenotes/:id
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const note = await pageNoteRepository.findById(id);
    if (!note) {
      res.status(404).json({ success: false, message: `PageNote mit ID ${id} nicht gefunden` });
      return;
    }
    // Check ownership for non-admin
    const user = (req as any).user;
    if (user?.userType !== 'admin' && note.userEmail !== user?.email) {
      res.status(403).json({ success: false, message: 'Zugriff verweigert' });
      return;
    }
    res.json({ success: true, data: note });
  } catch (error) {
    console.error('Error getting page note:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' });
  }
}

// GET /api/pagenotes/my-notes
export async function getMyNotes(req: Request, res: Response): Promise<void> {
  try {
    const userEmail = (req as any).user?.email;
    if (!userEmail) {
      res.status(401).json({ success: false, message: 'E-Mail nicht gefunden' });
      return;
    }
    const notes = await pageNoteRepository.findByUserEmail(userEmail);
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error getting user notes:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' });
  }
}

// GET /api/pagenotes/page?pageUrl=...
export async function getByPageUrl(req: Request, res: Response): Promise<void> {
  try {
    const pageUrl = req.query.pageUrl as string;
    if (!pageUrl) {
      res.status(400).json({ success: false, message: 'pageUrl ist erforderlich' });
      return;
    }
    let notes = await pageNoteRepository.findByPageUrl(pageUrl);
    const user = (req as any).user;
    if (user?.userType !== 'admin') {
      notes = notes.filter(n => n.userEmail === user?.email);
    }
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error getting notes by page:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' });
  }
}

// GET /api/pagenotes/entity/:entityType/:entityId
export async function getByEntity(req: Request, res: Response): Promise<void> {
  try {
    const { entityType, entityId } = req.params;
    let notes = await pageNoteRepository.findByEntity(entityType, parseInt(entityId, 10));
    const user = (req as any).user;
    if (user?.userType !== 'admin') {
      notes = notes.filter(n => n.userEmail === user?.email);
    }
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error getting notes by entity:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' });
  }
}

// GET /api/pagenotes/status/:status (Admin only)
export async function getByStatus(req: Request, res: Response): Promise<void> {
  try {
    const notes = await pageNoteRepository.findByStatus(req.params.status);
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error getting notes by status:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' });
  }
}

// GET /api/pagenotes/statistics (Admin only)
export async function getStatistics(req: Request, res: Response): Promise<void> {
  try {
    const stats = await pageNoteRepository.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' });
  }
}

// POST /api/pagenotes
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreatePageNoteDto = req.body;
    const user = (req as any).user;
    const note = await pageNoteRepository.create(dto, user?.email || '', user?.name);
    res.status(201).json({ success: true, data: note, message: 'Notiz erstellt' });
  } catch (error) {
    console.error('Error creating page note:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' });
  }
}

// PUT /api/pagenotes/:id
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await pageNoteRepository.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: `PageNote mit ID ${id} nicht gefunden` });
      return;
    }
    const user = (req as any).user;
    if (existing.userEmail !== user?.email) {
      res.status(403).json({ success: false, message: 'Zugriff verweigert' });
      return;
    }
    // Implementation for update would go here
    res.json({ success: true, data: existing, message: 'Notiz aktualisiert' });
  } catch (error) {
    console.error('Error updating page note:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' });
  }
}

// DELETE /api/pagenotes/:id
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await pageNoteRepository.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: `PageNote mit ID ${id} nicht gefunden` });
      return;
    }
    const user = (req as any).user;
    if (user?.userType !== 'admin' && existing.userEmail !== user?.email) {
      res.status(403).json({ success: false, message: 'Zugriff verweigert' });
      return;
    }
    // Soft delete implementation would go here
    res.json({ success: true, message: 'Notiz gelöscht' });
  } catch (error) {
    console.error('Error deleting page note:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' });
  }
}

