/**
 * MitgliedZahlung Repository
 * Handles Member Payments operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import {
  MitgliedZahlung,
  CreateMitgliedZahlungDto,
  UpdateMitgliedZahlungDto,
} from '../models';

export class ZahlungRepository extends BaseRepository<MitgliedZahlung> {
  constructor() {
    super({ schema: 'Finanz', table: 'MitgliedZahlung' });
  }

  // Find by Mitglied ID
  async findByMitgliedId(mitgliedId: number, includeDeleted = false, sprache = 'de'): Promise<MitgliedZahlung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);
    request.input('sprache', mssql.NVarChar, sprache);

    let whereClause = 'z.MitgliedId = @mitgliedId';
    if (!includeDeleted) {
      whereClause += ' AND (z.DeletedFlag IS NULL OR z.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT z.*,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        zt.Name as ZahlungTypName,
        zs.Name as StatusName
      FROM [Finanz].[MitgliedZahlung] z
      LEFT JOIN [Mitglied].[Mitglied] m ON z.MitgliedId = m.Id
      LEFT JOIN [Keytable].[ZahlungTypUebersetzung] zt ON z.ZahlungTypId = zt.ZahlungTypId AND zt.Sprache = @sprache
      LEFT JOIN [Keytable].[ZahlungStatusUebersetzung] zs ON z.StatusId = zs.ZahlungStatusId AND zs.Sprache = @sprache
      WHERE ${whereClause}
      ORDER BY z.Zahlungsdatum DESC
    `);

    return result.recordset.map(this.mapToZahlung);
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number, includeDeleted = false, sprache = 'de'): Promise<MitgliedZahlung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);
    request.input('sprache', mssql.NVarChar, sprache);

    let whereClause = 'z.VereinId = @vereinId';
    if (!includeDeleted) {
      whereClause += ' AND (z.DeletedFlag IS NULL OR z.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT z.*,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        zt.Name as ZahlungTypName,
        zs.Name as StatusName
      FROM [Finanz].[MitgliedZahlung] z
      LEFT JOIN [Mitglied].[Mitglied] m ON z.MitgliedId = m.Id
      LEFT JOIN [Keytable].[ZahlungTypUebersetzung] zt ON z.ZahlungTypId = zt.ZahlungTypId AND zt.Sprache = @sprache
      LEFT JOIN [Keytable].[ZahlungStatusUebersetzung] zs ON z.StatusId = zs.ZahlungStatusId AND zs.Sprache = @sprache
      WHERE ${whereClause}
      ORDER BY z.Zahlungsdatum DESC
    `);

    return result.recordset.map(this.mapToZahlung);
  }

  // Find by date range
  async findByDateRange(fromDate: string, toDate: string, vereinId?: number, sprache = 'de'): Promise<MitgliedZahlung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('fromDate', mssql.Date, new Date(fromDate));
    request.input('toDate', mssql.Date, new Date(toDate));
    request.input('sprache', mssql.NVarChar, sprache);

    let whereClause = `(z.DeletedFlag IS NULL OR z.DeletedFlag = 0)
      AND z.Zahlungsdatum >= @fromDate AND z.Zahlungsdatum <= @toDate`;

    if (vereinId) {
      request.input('vereinId', mssql.Int, vereinId);
      whereClause += ' AND z.VereinId = @vereinId';
    }

    const result = await request.query(`
      SELECT z.*,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        zt.Name as ZahlungTypName,
        zs.Name as StatusName
      FROM [Finanz].[MitgliedZahlung] z
      LEFT JOIN [Mitglied].[Mitglied] m ON z.MitgliedId = m.Id
      LEFT JOIN [Keytable].[ZahlungTypUebersetzung] zt ON z.ZahlungTypId = zt.ZahlungTypId AND zt.Sprache = @sprache
      LEFT JOIN [Keytable].[ZahlungStatusUebersetzung] zs ON z.StatusId = zs.ZahlungStatusId AND zs.Sprache = @sprache
      WHERE ${whereClause}
      ORDER BY z.Zahlungsdatum DESC
    `);

    return result.recordset.map(this.mapToZahlung);
  }

  // Get total payment amount for a Mitglied
  async getTotalPaymentAmount(mitgliedId: number, fromDate?: string, toDate?: string): Promise<number> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);

    let whereClause = 'MitgliedId = @mitgliedId AND (DeletedFlag IS NULL OR DeletedFlag = 0)';

    if (fromDate) {
      request.input('fromDate', mssql.Date, new Date(fromDate));
      whereClause += ' AND Zahlungsdatum >= @fromDate';
    }
    if (toDate) {
      request.input('toDate', mssql.Date, new Date(toDate));
      whereClause += ' AND Zahlungsdatum <= @toDate';
    }

    const result = await request.query(`
      SELECT ISNULL(SUM(Betrag), 0) as Total
      FROM [Finanz].[MitgliedZahlung]
      WHERE ${whereClause}
    `);

    return result.recordset[0]?.Total || 0;
  }

  // Create Zahlung
  async create(data: CreateMitgliedZahlungDto, userId?: number): Promise<MitgliedZahlung> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('mitgliedId', mssql.Int, data.mitgliedId);
    request.input('forderungId', mssql.Int, data.forderungId || null);
    request.input('zahlungTypId', mssql.Int, data.zahlungTypId);
    request.input('betrag', mssql.Decimal(18, 2), data.betrag);
    request.input('waehrungId', mssql.Int, data.waehrungId);
    request.input('zahlungsdatum', mssql.Date, new Date(data.zahlungsdatum));
    request.input('zahlungsweg', mssql.NVarChar(30), data.zahlungsweg || null);
    request.input('bankkontoId', mssql.Int, data.bankkontoId || null);
    request.input('referenz', mssql.NVarChar(100), data.referenz || null);
    request.input('bemerkung', mssql.NVarChar(250), data.bemerkung || null);
    request.input('statusId', mssql.Int, data.statusId);

    const result = await request.query(`
      INSERT INTO [Finanz].[MitgliedZahlung] (
        VereinId, MitgliedId, ForderungId, ZahlungTypId, Betrag, WaehrungId,
        Zahlungsdatum, Zahlungsweg, BankkontoId, Referenz, Bemerkung, StatusId, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @mitgliedId, @forderungId, @zahlungTypId, @betrag, @waehrungId,
        @zahlungsdatum, @zahlungsweg, @bankkontoId, @referenz, @bemerkung, @statusId, @created, @createdBy
      )
    `);

    return this.mapToZahlung(result.recordset[0]);
  }

  // Update Zahlung
  async update(id: number, data: UpdateMitgliedZahlungDto, userId?: number): Promise<MitgliedZahlung | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];

    if (data.betrag !== undefined) {
      request.input('betrag', mssql.Decimal(18, 2), data.betrag);
      updates.push('Betrag = @betrag');
    }
    if (data.zahlungsdatum !== undefined) {
      request.input('zahlungsdatum', mssql.Date, new Date(data.zahlungsdatum));
      updates.push('Zahlungsdatum = @zahlungsdatum');
    }
    if (data.statusId !== undefined) {
      request.input('statusId', mssql.Int, data.statusId);
      updates.push('StatusId = @statusId');
    }
    if (data.bemerkung !== undefined) {
      request.input('bemerkung', mssql.NVarChar(250), data.bemerkung);
      updates.push('Bemerkung = @bemerkung');
    }
    if (data.referenz !== undefined) {
      request.input('referenz', mssql.NVarChar(100), data.referenz);
      updates.push('Referenz = @referenz');
    }

    await request.query(`
      UPDATE [Finanz].[MitgliedZahlung]
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Map row to Zahlung
  private mapToZahlung(row: any): MitgliedZahlung {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      mitgliedId: row.MitgliedId,
      forderungId: row.ForderungId,
      zahlungTypId: row.ZahlungTypId,
      betrag: row.Betrag,
      waehrungId: row.WaehrungId,
      zahlungsdatum: row.Zahlungsdatum,
      zahlungsweg: row.Zahlungsweg,
      bankkontoId: row.BankkontoId,
      referenz: row.Referenz,
      bemerkung: row.Bemerkung,
      statusId: row.StatusId,
      bankBuchungId: row.BankBuchungId,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      mitgliedName: row.MitgliedName,
      zahlungTypName: row.ZahlungTypName,
      statusName: row.StatusName,
    };
  }
}

// Singleton instance
export const zahlungRepository = new ZahlungRepository();

