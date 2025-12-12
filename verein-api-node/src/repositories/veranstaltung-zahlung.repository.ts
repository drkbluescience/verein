/**
 * VeranstaltungZahlung Repository
 * Event Payment operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { VeranstaltungZahlung, CreateVeranstaltungZahlungDto } from '../models';

export class VeranstaltungZahlungRepository extends BaseRepository<VeranstaltungZahlung> {
  constructor() {
    super({ schema: 'Finanz', table: 'VeranstaltungZahlung' });
  }

  // Find by Veranstaltung ID
  async findByVeranstaltungId(veranstaltungId: number): Promise<VeranstaltungZahlung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('veranstaltungId', mssql.Int, veranstaltungId);
    const result = await request.query(`
      SELECT vz.*, v.Titel as VeranstaltungTitel,
        m.Vorname + ' ' + m.Nachname as MitgliedName
      FROM [Finanz].[VeranstaltungZahlung] vz
      LEFT JOIN [dbo].[Veranstaltung] v ON vz.VeranstaltungId = v.Id
      LEFT JOIN [Mitglied].[Mitglied] m ON vz.MitgliedId = m.Id
      WHERE vz.VeranstaltungId = @veranstaltungId
        AND (vz.DeletedFlag IS NULL OR vz.DeletedFlag = 0)
      ORDER BY vz.Zahlungsdatum DESC
    `);
    return result.recordset.map(this.mapToZahlung);
  }

  // Find by Mitglied ID
  async findByMitgliedId(mitgliedId: number): Promise<VeranstaltungZahlung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);
    const result = await request.query(`
      SELECT vz.*, v.Titel as VeranstaltungTitel
      FROM [Finanz].[VeranstaltungZahlung] vz
      LEFT JOIN [dbo].[Veranstaltung] v ON vz.VeranstaltungId = v.Id
      WHERE vz.MitgliedId = @mitgliedId
        AND (vz.DeletedFlag IS NULL OR vz.DeletedFlag = 0)
      ORDER BY vz.Zahlungsdatum DESC
    `);
    return result.recordset.map(this.mapToZahlung);
  }

  // Create
  async create(data: CreateVeranstaltungZahlungDto, userId?: number): Promise<VeranstaltungZahlung> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('veranstaltungId', mssql.Int, data.veranstaltungId);
    request.input('anmeldungId', mssql.Int, data.anmeldungId || null);
    request.input('mitgliedId', mssql.Int, data.mitgliedId || null);
    request.input('betrag', mssql.Decimal(18, 2), data.betrag);
    request.input('waehrungId', mssql.Int, data.waehrungId || 1);
    request.input('zahlungsdatum', mssql.Date, new Date(data.zahlungsdatum));
    request.input('zahlungsweg', mssql.NVarChar(30), data.zahlungsweg || null);
    request.input('referenz', mssql.NVarChar(100), data.referenz || null);
    request.input('bemerkung', mssql.NVarChar(250), data.bemerkung || null);
    request.input('statusId', mssql.Int, data.statusId || 1);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Finanz].[VeranstaltungZahlung] (
        VeranstaltungId, AnmeldungId, MitgliedId, Betrag, WaehrungId,
        Zahlungsdatum, Zahlungsweg, Referenz, Bemerkung, StatusId, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @veranstaltungId, @anmeldungId, @mitgliedId, @betrag, @waehrungId,
        @zahlungsdatum, @zahlungsweg, @referenz, @bemerkung, @statusId, @created, @createdBy
      )
    `);
    return this.mapToZahlung(result.recordset[0]);
  }

  // Get total by Veranstaltung
  async getTotalByVeranstaltungId(veranstaltungId: number): Promise<number> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('veranstaltungId', mssql.Int, veranstaltungId);
    const result = await request.query(`
      SELECT ISNULL(SUM(Betrag), 0) as Total
      FROM [Finanz].[VeranstaltungZahlung]
      WHERE VeranstaltungId = @veranstaltungId
        AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);
    return result.recordset[0]?.Total || 0;
  }

  // Map row
  private mapToZahlung(row: any): VeranstaltungZahlung {
    return {
      id: row.Id,
      veranstaltungId: row.VeranstaltungId,
      anmeldungId: row.AnmeldungId,
      mitgliedId: row.MitgliedId,
      betrag: parseFloat(row.Betrag),
      waehrungId: row.WaehrungId,
      zahlungsdatum: row.Zahlungsdatum,
      zahlungsweg: row.Zahlungsweg,
      referenz: row.Referenz,
      bemerkung: row.Bemerkung,
      statusId: row.StatusId,
      veranstaltungTitel: row.VeranstaltungTitel,
      mitgliedName: row.MitgliedName,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
    };
  }
}

export const veranstaltungZahlungRepository = new VeranstaltungZahlungRepository();

