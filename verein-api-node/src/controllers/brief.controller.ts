/**
 * Brief Controller
 * Letter Drafts endpoints
 */

import { Request, Response } from 'express';
import { briefRepository, nachrichtRepository, mitgliedRepository } from '../repositories';
import { ApiResponse, CreateBriefDto, UpdateBriefDto, SendBriefDto, QuickSendBriefDto } from '../models';

// GET /api/briefe/verein/:vereinId - Get all letters by Verein
export async function getByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const briefe = await briefRepository.findByVereinId(vereinId);
    res.json({ success: true, data: briefe });
  } catch (error) {
    console.error('Error getting letters:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/briefe/verein/:vereinId/drafts - Get drafts
export async function getDraftsByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const briefe = await briefRepository.findDraftsByVereinId(vereinId);
    res.json({ success: true, data: briefe });
  } catch (error) {
    console.error('Error getting drafts:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/briefe/verein/:vereinId/sent - Get sent letters
export async function getSentByVereinId(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const briefe = await briefRepository.findSentByVereinId(vereinId);
    res.json({ success: true, data: briefe });
  } catch (error) {
    console.error('Error getting sent letters:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/briefe/:id - Get letter by ID
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Brief-ID' } as ApiResponse<null>);
      return;
    }
    const brief = await briefRepository.findById(id);
    if (!brief) {
      res.status(404).json({ success: false, message: `Brief mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: brief });
  } catch (error) {
    console.error('Error getting letter:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// GET /api/briefe/verein/:vereinId/statistics - Get statistics
export async function getStatistics(req: Request, res: Response): Promise<void> {
  try {
    const vereinId = parseInt(req.params.vereinId, 10);
    if (isNaN(vereinId)) {
      res.status(400).json({ success: false, message: 'Ungültige Verein-ID' } as ApiResponse<null>);
      return;
    }
    const stats = await briefRepository.getStatistics(vereinId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen' } as ApiResponse<null>);
  }
}

// POST /api/briefe - Create letter
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const dto: CreateBriefDto = req.body;
    const userId = (req as any).user?.userId;
    const brief = await briefRepository.create(dto, userId);
    res.status(201).json({ success: true, data: brief, message: 'Brief erfolgreich erstellt' });
  } catch (error) {
    console.error('Error creating letter:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Erstellen' } as ApiResponse<null>);
  }
}

// PUT /api/briefe/:id - Update letter
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Brief-ID' } as ApiResponse<null>);
      return;
    }
    const dto: UpdateBriefDto = req.body;
    const userId = (req as any).user?.userId;
    const brief = await briefRepository.update(id, dto, userId);
    if (!brief) {
      res.status(404).json({ success: false, message: `Brief mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, data: brief, message: 'Brief erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Error updating letter:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren' } as ApiResponse<null>);
  }
}

// DELETE /api/briefe/:id - Delete letter
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Ungültige Brief-ID' } as ApiResponse<null>);
      return;
    }
    const userId = (req as any).user?.userId;
    const deleted = await briefRepository.softDelete(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: `Brief mit ID ${id} nicht gefunden` } as ApiResponse<null>);
      return;
    }
    res.json({ success: true, message: 'Brief erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting letter:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' } as ApiResponse<null>);
  }
}

// POST /api/briefe/:id/send - Send letter to members
export async function send(req: Request, res: Response): Promise<void> {
  try {
    const briefId = parseInt(req.params.id, 10);
    if (isNaN(briefId)) {
      res.status(400).json({ success: false, message: 'Ungültige Brief-ID' } as ApiResponse<null>);
      return;
    }

    const brief = await briefRepository.findById(briefId);
    if (!brief) {
      res.status(404).json({ success: false, message: `Brief mit ID ${briefId} nicht gefunden` } as ApiResponse<null>);
      return;
    }

    const { mitgliedIds } = req.body as SendBriefDto;
    if (!mitgliedIds || mitgliedIds.length === 0) {
      res.status(400).json({ success: false, message: 'Keine Empfänger ausgewählt' } as ApiResponse<null>);
      return;
    }

    // Get members and send messages
    const sentCount = await sendBriefToMembers(brief, mitgliedIds);

    // Update brief status
    const userId = (req as any).user?.userId;
    await briefRepository.update(briefId, { status: 'Gesendet' }, userId);

    res.json({ success: true, data: { sentCount }, message: `Brief an ${sentCount} Mitglieder gesendet` });
  } catch (error) {
    console.error('Error sending letter:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Senden' } as ApiResponse<null>);
  }
}

// POST /api/briefe/quick-send - Quick send without saving draft
export async function quickSend(req: Request, res: Response): Promise<void> {
  try {
    const dto: QuickSendBriefDto = req.body;
    const userId = (req as any).user?.userId;

    // Create brief
    const brief = await briefRepository.create({
      vereinId: dto.vereinId,
      titel: dto.titel,
      betreff: dto.betreff,
      inhalt: dto.inhalt,
      logoUrl: dto.logoUrl,
      logoPosition: dto.logoPosition,
      schriftart: dto.schriftart,
      schriftgroesse: dto.schriftgroesse,
    }, userId);

    // Send to members
    const sentCount = await sendBriefToMembers(brief, dto.mitgliedIds);

    // Update status
    await briefRepository.update(brief.id, { status: 'Gesendet' }, userId);

    res.status(201).json({ success: true, data: { briefId: brief.id, sentCount }, message: `Brief an ${sentCount} Mitglieder gesendet` });
  } catch (error) {
    console.error('Error quick sending:', error);
    res.status(500).json({ success: false, message: 'Fehler beim Senden' } as ApiResponse<null>);
  }
}

// Helper: Send brief to members with placeholder replacement
async function sendBriefToMembers(brief: any, mitgliedIds: number[]): Promise<number> {
  let sentCount = 0;

  for (const mitgliedId of mitgliedIds) {
    try {
      const mitglied = await mitgliedRepository.findById(mitgliedId);
      if (!mitglied) continue;

      // Replace placeholders
      const personalizedContent = replacePlaceholders(brief.inhalt, mitglied);
      const personalizedSubject = replacePlaceholders(brief.betreff, mitglied);

      await nachrichtRepository.create({
        briefId: brief.id,
        vereinId: brief.vereinId,
        mitgliedId: mitgliedId,
        betreff: personalizedSubject,
        inhalt: personalizedContent,
        logoUrl: brief.logoUrl,
      });

      sentCount++;
    } catch (err) {
      console.error(`Error sending to member ${mitgliedId}:`, err);
    }
  }

  return sentCount;
}

// Helper: Replace placeholders in content
function replacePlaceholders(content: string, mitglied: any): string {
  if (!content) return content;

  return content
    .replace(/\{Vorname\}/g, mitglied.vorname || '')
    .replace(/\{Nachname\}/g, mitglied.nachname || '')
    .replace(/\{Email\}/g, mitglied.email || '')
    .replace(/\{Telefon\}/g, mitglied.telefon || '')
    .replace(/\{Adresse\}/g, mitglied.adresse || '')
    .replace(/\{PLZ\}/g, mitglied.plz || '')
    .replace(/\{Ort\}/g, mitglied.ort || '')
    .replace(/\{MitgliedNummer\}/g, mitglied.mitgliedNummer || '')
    .replace(/\{Datum\}/g, new Date().toLocaleDateString('de-DE'));
}

