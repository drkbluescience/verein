/**
 * Verein Repository
 * Handles Verein CRUD operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { Verein, CreateVereinDto, UpdateVereinDto } from '../models';

export class VereinRepository extends BaseRepository<Verein> {
  constructor() {
    super({ schema: 'Verein', table: 'Verein' });
  }

  // Find active Vereine only
  async findActive(): Promise<Verein[]> {
    const pool = await this.getDb();
    const result = await pool.request().query(`
      SELECT * FROM [Verein].[Verein]
      WHERE Aktiv = 1 AND (DeletedFlag IS NULL OR DeletedFlag = 0)
      ORDER BY Name
    `);
    return result.recordset;
  }

  // Find Verein with full details
  async findWithDetails(id: number): Promise<Verein | null> {
    return this.findByIdWithRelations(id);
  }

  // Find Verein with related data
  async findByIdWithRelations(id: number): Promise<Verein | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);

    const result = await request.query(`
      SELECT
        v.*,
        a.Id as AdresseId_Nav, a.Strasse, a.Hausnummer, a.PLZ, a.Ort, a.Land,
        b.Id as BankkontoId_Nav, b.Bankname, b.IBAN, b.BIC, b.Kontoinhaber,
        r.Id as RechtlicheId, r.RegistergerichtNummer, r.RegistergerichtName,
        r.FinanzamtName, r.FinanzamtNummer, r.GemeinnuetzigAnerkannt
      FROM [Verein].[Verein] v
      LEFT JOIN [Verein].[Adresse] a ON v.AdresseId = a.Id
      LEFT JOIN [Verein].[Bankkonto] b ON v.HauptBankkontoId = b.Id
      LEFT JOIN [Verein].[RechtlicheDaten] r ON r.VereinId = v.Id
      WHERE v.Id = @id AND (v.DeletedFlag IS NULL OR v.DeletedFlag = 0)
    `);

    if (!result.recordset[0]) return null;

    const row = result.recordset[0];
    return this.mapToVereinWithRelations(row);
  }

  // Create new Verein
  async create(data: CreateVereinDto, userId?: number): Promise<Verein> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('name', mssql.NVarChar(200), data.name);
    request.input('kurzname', mssql.NVarChar(50), data.kurzname || null);
    request.input('vereinsnummer', mssql.NVarChar(30), data.vereinsnummer || null);
    request.input('rechtsformId', mssql.Int, data.rechtsformId || null);
    request.input('gruendungsdatum', mssql.Date, data.gruendungsdatum ? new Date(data.gruendungsdatum) : null);
    request.input('zweck', mssql.NVarChar(500), data.zweck || null);
    request.input('telefon', mssql.NVarChar(30), data.telefon || null);
    request.input('fax', mssql.NVarChar(30), data.fax || null);
    request.input('email', mssql.NVarChar(100), data.email || null);
    request.input('webseite', mssql.NVarChar(200), data.webseite || null);
    request.input('mandantencode', mssql.NVarChar(50), data.mandantencode || null);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);
    request.input('aktiv', mssql.Bit, true);

    const result = await request.query(`
      INSERT INTO [Verein].[Verein] (
        Name, Kurzname, Vereinsnummer, RechtsformId, Gruendungsdatum, Zweck,
        Telefon, Fax, Email, Webseite, Mandantencode, Created, CreatedBy, Aktiv
      )
      OUTPUT INSERTED.*
      VALUES (
        @name, @kurzname, @vereinsnummer, @rechtsformId, @gruendungsdatum, @zweck,
        @telefon, @fax, @email, @webseite, @mandantencode, @created, @createdBy, @aktiv
      )
    `);

    return result.recordset[0];
  }

  // Update Verein
  async update(id: number, data: UpdateVereinDto, userId?: number): Promise<Verein | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    // Build dynamic update query
    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];
    
    const fields: Array<{ key: keyof UpdateVereinDto; type: mssql.ISqlTypeFactoryWithNoParams; maxLength?: number }> = [
      { key: 'name', type: mssql.NVarChar, maxLength: 200 },
      { key: 'kurzname', type: mssql.NVarChar, maxLength: 50 },
      { key: 'vereinsnummer', type: mssql.NVarChar, maxLength: 30 },
      { key: 'rechtsformId', type: mssql.Int },
      { key: 'zweck', type: mssql.NVarChar, maxLength: 500 },
      { key: 'telefon', type: mssql.NVarChar, maxLength: 30 },
      { key: 'email', type: mssql.NVarChar, maxLength: 100 },
      { key: 'webseite', type: mssql.NVarChar, maxLength: 200 },
      { key: 'vorstandsvorsitzender', type: mssql.NVarChar, maxLength: 100 },
      { key: 'geschaeftsfuehrer', type: mssql.NVarChar, maxLength: 100 },
      { key: 'kontaktperson', type: mssql.NVarChar, maxLength: 100 },
      { key: 'aktiv', type: mssql.Bit },
    ];

    for (const field of fields) {
      if (data[field.key] !== undefined) {
        const sqlType = field.maxLength ? (field.type as any)(field.maxLength) : field.type;
        request.input(field.key, sqlType, data[field.key]);
        updates.push(`${field.key.charAt(0).toUpperCase() + field.key.slice(1)} = @${field.key}`);
      }
    }

    const result = await request.query(`
      UPDATE [Verein].[Verein]
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE Id = @id
    `);

    return result.recordset[0] || null;
  }

  // Helper to map row to Verein with relations
  private mapToVereinWithRelations(row: any): Verein {
    return {
      ...row,
      hauptAdresse: row.AdresseId_Nav ? {
        id: row.AdresseId_Nav,
        strasse: row.Strasse,
        hausnummer: row.Hausnummer,
        plz: row.PLZ,
        ort: row.Ort,
        land: row.Land,
      } : null,
      hauptBankkonto: row.BankkontoId_Nav ? {
        id: row.BankkontoId_Nav,
        bankname: row.Bankname,
        iban: row.IBAN,
        bic: row.BIC,
        kontoinhaber: row.Kontoinhaber,
      } : null,
      rechtlicheDaten: row.RechtlicheId ? {
        id: row.RechtlicheId,
        registergerichtNummer: row.RegistergerichtNummer,
        registergerichtName: row.RegistergerichtName,
        finanzamtName: row.FinanzamtName,
        finanzamtNummer: row.FinanzamtNummer,
        gemeinnuetzigAnerkannt: row.GemeinnuetzigAnerkannt,
      } : null,
    };
  }
}

// Singleton instance
export const vereinRepository = new VereinRepository();
