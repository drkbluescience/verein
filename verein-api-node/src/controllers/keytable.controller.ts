/**
 * Keytable Controller
 * Handles lookup table endpoints
 */

import { Request, Response } from 'express';
import { keytableRepository } from '../repositories';
import { ApiResponse } from '../models';

// Helper to create generic keytable getter
function createKeytableGetter(tableName: string) {
  return async (_req: Request, res: Response): Promise<void> => {
    try {
      const items = await keytableRepository.getByTableName(tableName);
      res.json({
        success: true,
        data: items,
      });
    } catch (error) {
      console.error(`Error getting ${tableName}:`, error);
      res.status(500).json({
        success: false,
        message: `Fehler beim Abrufen von ${tableName}`,
      } as ApiResponse<null>);
    }
  };
}

// GET /api/keytable/geschlechter
export const getGeschlechter = createKeytableGetter('Geschlecht');

// GET /api/keytable/mitgliedstatuse
export const getMitgliedStatuse = createKeytableGetter('MitgliedStatus');

// GET /api/keytable/mitgliedtypen
export const getMitgliedTypen = createKeytableGetter('MitgliedTyp');

// GET /api/keytable/familienbeziehungtypen
export const getFamilienbeziehungTypen = createKeytableGetter('FamilienbeziehungTyp');

// GET /api/keytable/zahlungtypen
export const getZahlungTypen = createKeytableGetter('ZahlungTyp');

// GET /api/keytable/zahlungstatuse
export const getZahlungStatuse = createKeytableGetter('ZahlungStatus');

// GET /api/keytable/forderungsarten
export const getForderungsarten = createKeytableGetter('Forderungsart');

// GET /api/keytable/forderungsstatuse
export const getForderungsstatuse = createKeytableGetter('Forderungsstatus');

// GET /api/keytable/waehrungen
export const getWaehrungen = createKeytableGetter('Waehrung');

// GET /api/keytable/rechtsformen
export const getRechtsformen = createKeytableGetter('Rechtsform');

// GET /api/keytable/adressetypen
export const getAdresseTypen = createKeytableGetter('AdresseTyp');

// GET /api/keytable/kontotypen
export const getKontotypen = createKeytableGetter('Kontotyp');

// GET /api/keytable/mitgliedfamiliestatuse
export const getMitgliedFamilieStatuse = createKeytableGetter('MitgliedFamilieStatus');

// GET /api/keytable/staatsangehoerigkeiten
export const getStaatsangehoerigkeiten = createKeytableGetter('Staatsangehoerigkeit');

// GET /api/keytable/beitragperioden
export const getBeitragPerioden = createKeytableGetter('BeitragPeriode');

// GET /api/keytable/beitragzahlungstagtypen
export const getBeitragZahlungstagTypen = createKeytableGetter('BeitragZahlungstagTyp');

// GET /api/keytable/all - Get all keytables at once
export async function getAllKeytables(_req: Request, res: Response): Promise<void> {
  try {
    const [
      geschlechter,
      mitgliedStatuse,
      mitgliedTypen,
      familienbeziehungTypen,
      zahlungTypen,
      zahlungStatuse,
      forderungsarten,
      forderungsstatuse,
      waehrungen,
      rechtsformen,
      adresseTypen,
      kontotypen,
      mitgliedFamilieStatuse,
      staatsangehoerigkeiten,
      beitragPerioden,
      beitragZahlungstagTypen,
    ] = await Promise.all([
      keytableRepository.getByTableName('Geschlecht'),
      keytableRepository.getByTableName('MitgliedStatus'),
      keytableRepository.getByTableName('MitgliedTyp'),
      keytableRepository.getByTableName('FamilienbeziehungTyp'),
      keytableRepository.getByTableName('ZahlungTyp'),
      keytableRepository.getByTableName('ZahlungStatus'),
      keytableRepository.getByTableName('Forderungsart'),
      keytableRepository.getByTableName('Forderungsstatus'),
      keytableRepository.getByTableName('Waehrung'),
      keytableRepository.getByTableName('Rechtsform'),
      keytableRepository.getByTableName('AdresseTyp'),
      keytableRepository.getByTableName('Kontotyp'),
      keytableRepository.getByTableName('MitgliedFamilieStatus'),
      keytableRepository.getByTableName('Staatsangehoerigkeit'),
      keytableRepository.getByTableName('BeitragPeriode'),
      keytableRepository.getByTableName('BeitragZahlungstagTyp'),
    ]);

    res.json({
      success: true,
      data: {
        geschlechter,
        mitgliedStatuse,
        mitgliedTypen,
        familienbeziehungTypen,
        zahlungTypen,
        zahlungStatuse,
        forderungsarten,
        forderungsstatuse,
        waehrungen,
        rechtsformen,
        adresseTypen,
        kontotypen,
        mitgliedFamilieStatuse,
        staatsangehoerigkeiten,
        beitragPerioden,
        beitragZahlungstagTypen,
      },
    });
  } catch (error) {
    console.error('Error getting all keytables:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Keytables',
    } as ApiResponse<null>);
  }
}

