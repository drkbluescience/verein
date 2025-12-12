/**
 * Keytable Repository
 * Handles all lookup table operations
 */

import { getPool } from '../config/database';
import { KeytableWithUebersetzung, AllKeytablesResponse, KeytableType } from '../models';

// Available keytables with their table names
const KEYTABLES: Record<KeytableType, string> = {
  AdresseTyp: 'AdresseTyp',
  BeitragPeriode: 'BeitragPeriode',
  BeitragZahlungstagTyp: 'BeitragZahlungstagTyp',
  FamilienbeziehungTyp: 'FamilienbeziehungTyp',
  Forderungsart: 'Forderungsart',
  Forderungsstatus: 'Forderungsstatus',
  Geschlecht: 'Geschlecht',
  Kontotyp: 'Kontotyp',
  MitgliedFamilieStatus: 'MitgliedFamilieStatus',
  MitgliedStatus: 'MitgliedStatus',
  MitgliedTyp: 'MitgliedTyp',
  Rechtsform: 'Rechtsform',
  Staatsangehoerigkeit: 'Staatsangehoerigkeit',
  Waehrung: 'Waehrung',
  ZahlungStatus: 'ZahlungStatus',
  ZahlungTyp: 'ZahlungTyp',
};

export class KeytableRepository {
  // Get keytable by table name (string version for dynamic access)
  async getByTableName(tableName: string, sprache = 'de'): Promise<KeytableWithUebersetzung[]> {
    return this.getKeytable(tableName as KeytableType, sprache);
  }

  // Get single keytable with translations
  async getKeytable(tableName: KeytableType, sprache?: string): Promise<KeytableWithUebersetzung[]> {
    const pool = await getPool();
    
    // Build query to get keytable with translations
    let query = `
      SELECT 
        k.Id as id,
        k.Code as code,
        u.Sprache as sprache,
        u.Name as name
      FROM [Keytable].[${KEYTABLES[tableName]}] k
      LEFT JOIN [Keytable].[${KEYTABLES[tableName]}Uebersetzung] u ON k.Id = u.${KEYTABLES[tableName]}Id
    `;

    const request = pool.request();
    if (sprache) {
      query += ' WHERE u.Sprache = @sprache OR u.Sprache IS NULL';
      request.input('sprache', sprache);
    }

    query += ' ORDER BY k.Id, u.Sprache';

    const result = await request.query(query);

    // Group by id and aggregate translations
    const grouped = new Map<number, KeytableWithUebersetzung>();
    
    for (const row of result.recordset) {
      if (!grouped.has(row.id)) {
        grouped.set(row.id, {
          id: row.id,
          code: row.code,
          uebersetzungen: [],
        });
      }
      
      if (row.sprache && row.name) {
        grouped.get(row.id)!.uebersetzungen.push({
          sprache: row.sprache,
          name: row.name,
        });
      }
    }

    return Array.from(grouped.values());
  }

  // Get all keytables at once
  async getAllKeytables(sprache?: string): Promise<AllKeytablesResponse> {
    const keytableNames = Object.keys(KEYTABLES) as KeytableType[];
    
    const results = await Promise.all(
      keytableNames.map(name => this.getKeytable(name, sprache))
    );

    return {
      adresseTyp: results[0],
      beitragPeriode: results[1],
      beitragZahlungstagTyp: results[2],
      familienbeziehungTyp: results[3],
      forderungsart: results[4],
      forderungsstatus: results[5],
      geschlecht: results[6],
      kontotyp: results[7],
      mitgliedFamilieStatus: results[8],
      mitgliedStatus: results[9],
      mitgliedTyp: results[10],
      rechtsform: results[11],
      staatsangehoerigkeit: results[12],
      waehrung: results[13],
      zahlungStatus: results[14],
      zahlungTyp: results[15],
    };
  }

  // Get translation name for a keytable item
  async getTranslationName(tableName: KeytableType, id: number, sprache: string): Promise<string | null> {
    const pool = await getPool();
    const request = pool.request();
    request.input('id', id);
    request.input('sprache', sprache);

    const result = await request.query(`
      SELECT u.Name
      FROM [Keytable].[${KEYTABLES[tableName]}Uebersetzung] u
      WHERE u.${KEYTABLES[tableName]}Id = @id AND u.Sprache = @sprache
    `);

    return result.recordset[0]?.Name || null;
  }
}

// Singleton instance
export const keytableRepository = new KeytableRepository();

