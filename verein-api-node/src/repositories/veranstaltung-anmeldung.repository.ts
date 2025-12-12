/**
 * VeranstaltungAnmeldung Repository
 * Event Registration operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { VeranstaltungAnmeldung, CreateVeranstaltungAnmeldungDto, UpdateVeranstaltungAnmeldungDto } from '../models';

export class VeranstaltungAnmeldungRepository extends BaseRepository<VeranstaltungAnmeldung> {
  constructor() {
    super({ schema: 'dbo', table: 'VeranstaltungAnmeldung' });
  }

  // Find by Veranstaltung ID
  async findByVeranstaltungId(veranstaltungId: number): Promise<VeranstaltungAnmeldung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('veranstaltungId', mssql.Int, veranstaltungId);

    const result = await request.query(`
      SELECT va.*, v.Titel as VeranstaltungTitel,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName
      FROM dbo.VeranstaltungAnmeldung va
      LEFT JOIN dbo.Veranstaltung v ON va.VeranstaltungId = v.Id
      LEFT JOIN [Mitglied].[Mitglied] m ON va.MitgliedId = m.Id
      WHERE va.VeranstaltungId = @veranstaltungId AND (va.DeletedFlag IS NULL OR va.DeletedFlag = 0)
      ORDER BY va.Created DESC
    `);

    return result.recordset.map(this.mapToAnmeldung);
  }

  // Find by Mitglied ID
  async findByMitgliedId(mitgliedId: number): Promise<VeranstaltungAnmeldung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);

    const result = await request.query(`
      SELECT va.*, v.Titel as VeranstaltungTitel,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName
      FROM dbo.VeranstaltungAnmeldung va
      LEFT JOIN dbo.Veranstaltung v ON va.VeranstaltungId = v.Id
      LEFT JOIN [Mitglied].[Mitglied] m ON va.MitgliedId = m.Id
      WHERE va.MitgliedId = @mitgliedId AND (va.DeletedFlag IS NULL OR va.DeletedFlag = 0)
      ORDER BY va.Created DESC
    `);

    return result.recordset.map(this.mapToAnmeldung);
  }

  // Get participant count for an event
  async getParticipantCount(veranstaltungId: number): Promise<number> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('veranstaltungId', mssql.Int, veranstaltungId);

    const result = await request.query(`
      SELECT COUNT(*) as count
      FROM dbo.VeranstaltungAnmeldung
      WHERE VeranstaltungId = @veranstaltungId 
        AND (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND (Status IS NULL OR Status != 'Storniert')
    `);

    return result.recordset[0].count;
  }

  // Create Anmeldung
  async create(data: CreateVeranstaltungAnmeldungDto, userId?: number): Promise<VeranstaltungAnmeldung> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('veranstaltungId', mssql.Int, data.veranstaltungId);
    request.input('mitgliedId', mssql.Int, data.mitgliedId || null);
    request.input('name', mssql.NVarChar(100), data.name || null);
    request.input('email', mssql.NVarChar(100), data.email || null);
    request.input('telefon', mssql.NVarChar(30), data.telefon || null);
    request.input('status', mssql.NVarChar(20), data.status || 'Angemeldet');
    request.input('bemerkung', mssql.NVarChar(250), data.bemerkung || null);
    request.input('preis', mssql.Decimal(18, 2), data.preis || null);
    request.input('waehrungId', mssql.Int, data.waehrungId || null);
    request.input('zahlungStatusId', mssql.Int, data.zahlungStatusId || null);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO dbo.VeranstaltungAnmeldung (
        VeranstaltungId, MitgliedId, Name, Email, Telefon, Status, Bemerkung,
        Preis, WaehrungId, ZahlungStatusId, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @veranstaltungId, @mitgliedId, @name, @email, @telefon, @status, @bemerkung,
        @preis, @waehrungId, @zahlungStatusId, @created, @createdBy
      )
    `);

    return this.mapToAnmeldung(result.recordset[0]);
  }

  // Update Anmeldung
  async update(id: number, data: UpdateVeranstaltungAnmeldungDto, userId?: number): Promise<VeranstaltungAnmeldung | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];

    if (data.status !== undefined) {
      request.input('status', mssql.NVarChar(20), data.status);
      updates.push('Status = @status');
    }
    if (data.bemerkung !== undefined) {
      request.input('bemerkung', mssql.NVarChar(250), data.bemerkung);
      updates.push('Bemerkung = @bemerkung');
    }
    if (data.preis !== undefined) {
      request.input('preis', mssql.Decimal(18, 2), data.preis);
      updates.push('Preis = @preis');
    }

    await request.query(`
      UPDATE dbo.VeranstaltungAnmeldung
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Map row to VeranstaltungAnmeldung
  private mapToAnmeldung(row: any): VeranstaltungAnmeldung {
    return {
      id: row.Id,
      veranstaltungId: row.VeranstaltungId,
      mitgliedId: row.MitgliedId,
      name: row.Name,
      email: row.Email,
      telefon: row.Telefon,
      status: row.Status,
      bemerkung: row.Bemerkung,
      preis: row.Preis,
      waehrungId: row.WaehrungId,
      zahlungStatusId: row.ZahlungStatusId,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      veranstaltungTitel: row.VeranstaltungTitel,
      mitgliedName: row.MitgliedName,
    };
  }
}

export const veranstaltungAnmeldungRepository = new VeranstaltungAnmeldungRepository();

