/**
 * MitgliedForderung Repository
 * Handles Member Claims/Invoices operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import {
  MitgliedForderung,
  CreateMitgliedForderungDto,
  UpdateMitgliedForderungDto,
  ForderungFilterParams,
  MitgliedFinanzSummary,
} from '../models';

export class ForderungRepository extends BaseRepository<MitgliedForderung> {
  constructor() {
    super({ schema: 'Finanz', table: 'MitgliedForderung' });
  }

  // Find by Mitglied ID
  async findByMitgliedId(mitgliedId: number, includeDeleted = false, sprache = 'de'): Promise<MitgliedForderung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);
    request.input('sprache', mssql.NVarChar, sprache);

    let whereClause = 'f.MitgliedId = @mitgliedId';
    if (!includeDeleted) {
      whereClause += ' AND (f.DeletedFlag IS NULL OR f.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT f.*,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        zt.Name as ZahlungTypName,
        fs.Name as StatusName,
        ISNULL((SELECT SUM(fz.Betrag) FROM [Finanz].[MitgliedForderungZahlung] fz WHERE fz.ForderungId = f.Id AND (fz.DeletedFlag IS NULL OR fz.DeletedFlag = 0)), 0) as BezahltBetrag
      FROM [Finanz].[MitgliedForderung] f
      LEFT JOIN [Mitglied].[Mitglied] m ON f.MitgliedId = m.Id
      LEFT JOIN [Keytable].[ZahlungTypUebersetzung] zt ON f.ZahlungTypId = zt.ZahlungTypId AND zt.Sprache = @sprache
      LEFT JOIN [Keytable].[ForderungsstatusUebersetzung] fs ON f.StatusId = fs.ForderungsstatusId AND fs.Sprache = @sprache
      WHERE ${whereClause}
      ORDER BY f.Faelligkeit DESC
    `);

    return result.recordset.map(this.mapToForderung);
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number, includeDeleted = false, sprache = 'de'): Promise<MitgliedForderung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);
    request.input('sprache', mssql.NVarChar, sprache);

    let whereClause = 'f.VereinId = @vereinId';
    if (!includeDeleted) {
      whereClause += ' AND (f.DeletedFlag IS NULL OR f.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT f.*,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        zt.Name as ZahlungTypName,
        fs.Name as StatusName,
        ISNULL((SELECT SUM(fz.Betrag) FROM [Finanz].[MitgliedForderungZahlung] fz WHERE fz.ForderungId = f.Id AND (fz.DeletedFlag IS NULL OR fz.DeletedFlag = 0)), 0) as BezahltBetrag
      FROM [Finanz].[MitgliedForderung] f
      LEFT JOIN [Mitglied].[Mitglied] m ON f.MitgliedId = m.Id
      LEFT JOIN [Keytable].[ZahlungTypUebersetzung] zt ON f.ZahlungTypId = zt.ZahlungTypId AND zt.Sprache = @sprache
      LEFT JOIN [Keytable].[ForderungsstatusUebersetzung] fs ON f.StatusId = fs.ForderungsstatusId AND fs.Sprache = @sprache
      WHERE ${whereClause}
      ORDER BY f.Faelligkeit DESC
    `);

    return result.recordset.map(this.mapToForderung);
  }

  // Find unpaid Forderungen
  async findUnpaid(vereinId?: number, sprache = 'de'): Promise<MitgliedForderung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('sprache', mssql.NVarChar, sprache);

    let whereClause = `(f.DeletedFlag IS NULL OR f.DeletedFlag = 0)
      AND f.BezahltAm IS NULL
      AND f.StatusId != 3`; // 3 = Bezahlt (Paid)

    if (vereinId) {
      request.input('vereinId', mssql.Int, vereinId);
      whereClause += ' AND f.VereinId = @vereinId';
    }

    const result = await request.query(`
      SELECT f.*,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        zt.Name as ZahlungTypName,
        fs.Name as StatusName,
        ISNULL((SELECT SUM(fz.Betrag) FROM [Finanz].[MitgliedForderungZahlung] fz WHERE fz.ForderungId = f.Id AND (fz.DeletedFlag IS NULL OR fz.DeletedFlag = 0)), 0) as BezahltBetrag
      FROM [Finanz].[MitgliedForderung] f
      LEFT JOIN [Mitglied].[Mitglied] m ON f.MitgliedId = m.Id
      LEFT JOIN [Keytable].[ZahlungTypUebersetzung] zt ON f.ZahlungTypId = zt.ZahlungTypId AND zt.Sprache = @sprache
      LEFT JOIN [Keytable].[ForderungsstatusUebersetzung] fs ON f.StatusId = fs.ForderungsstatusId AND fs.Sprache = @sprache
      WHERE ${whereClause}
      ORDER BY f.Faelligkeit ASC
    `);

    return result.recordset.map(this.mapToForderung);
  }

  // Find overdue Forderungen
  async findOverdue(vereinId?: number, sprache = 'de'): Promise<MitgliedForderung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('sprache', mssql.NVarChar, sprache);
    request.input('today', mssql.Date, new Date());

    let whereClause = `(f.DeletedFlag IS NULL OR f.DeletedFlag = 0)
      AND f.BezahltAm IS NULL
      AND f.Faelligkeit < @today`;

    if (vereinId) {
      request.input('vereinId', mssql.Int, vereinId);
      whereClause += ' AND f.VereinId = @vereinId';
    }

    const result = await request.query(`
      SELECT f.*,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        zt.Name as ZahlungTypName,
        fs.Name as StatusName,
        ISNULL((SELECT SUM(fz.Betrag) FROM [Finanz].[MitgliedForderungZahlung] fz WHERE fz.ForderungId = f.Id AND (fz.DeletedFlag IS NULL OR fz.DeletedFlag = 0)), 0) as BezahltBetrag
      FROM [Finanz].[MitgliedForderung] f
      LEFT JOIN [Mitglied].[Mitglied] m ON f.MitgliedId = m.Id
      LEFT JOIN [Keytable].[ZahlungTypUebersetzung] zt ON f.ZahlungTypId = zt.ZahlungTypId AND zt.Sprache = @sprache
      LEFT JOIN [Keytable].[ForderungsstatusUebersetzung] fs ON f.StatusId = fs.ForderungsstatusId AND fs.Sprache = @sprache
      WHERE ${whereClause}
      ORDER BY f.Faelligkeit ASC
    `);

    return result.recordset.map(this.mapToForderung);
  }

  // Get total unpaid amount for a Mitglied
  async getTotalUnpaidAmount(mitgliedId: number): Promise<number> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);

    const result = await request.query(`
      SELECT ISNULL(SUM(f.Betrag - ISNULL((SELECT SUM(fz.Betrag) FROM [Finanz].[MitgliedForderungZahlung] fz WHERE fz.ForderungId = f.Id AND (fz.DeletedFlag IS NULL OR fz.DeletedFlag = 0)), 0)), 0) as Total
      FROM [Finanz].[MitgliedForderung] f
      WHERE f.MitgliedId = @mitgliedId
        AND (f.DeletedFlag IS NULL OR f.DeletedFlag = 0)
        AND f.BezahltAm IS NULL
    `);

    return result.recordset[0]?.Total || 0;
  }

  // Get Mitglied Finanz Summary
  async getMitgliedFinanzSummary(mitgliedId: number): Promise<MitgliedFinanzSummary> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);
    request.input('today', mssql.Date, new Date());

    const result = await request.query(`
      SELECT
        m.Id as MitgliedId,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        ISNULL(SUM(f.Betrag), 0) as TotalForderungen,
        ISNULL(SUM(ISNULL((SELECT SUM(fz.Betrag) FROM [Finanz].[MitgliedForderungZahlung] fz WHERE fz.ForderungId = f.Id AND (fz.DeletedFlag IS NULL OR fz.DeletedFlag = 0)), 0)), 0) as TotalBezahlt,
        COUNT(CASE WHEN f.BezahltAm IS NULL THEN 1 END) as AnzahlOffeneForderungen,
        COUNT(CASE WHEN f.BezahltAm IS NULL AND f.Faelligkeit < @today THEN 1 END) as AnzahlUeberfaellig
      FROM [Mitglied].[Mitglied] m
      LEFT JOIN [Finanz].[MitgliedForderung] f ON m.Id = f.MitgliedId AND (f.DeletedFlag IS NULL OR f.DeletedFlag = 0)
      WHERE m.Id = @mitgliedId
      GROUP BY m.Id, m.Vorname, m.Nachname
    `);

    const row = result.recordset[0];
    return {
      mitgliedId: row?.MitgliedId || mitgliedId,
      mitgliedName: row?.MitgliedName || '',
      totalForderungen: row?.TotalForderungen || 0,
      totalBezahlt: row?.TotalBezahlt || 0,
      offenerBetrag: (row?.TotalForderungen || 0) - (row?.TotalBezahlt || 0),
      anzahlOffeneForderungen: row?.AnzahlOffeneForderungen || 0,
      anzahlUeberfaellig: row?.AnzahlUeberfaellig || 0,
    };
  }

  // Create Forderung
  async create(data: CreateMitgliedForderungDto, userId?: number): Promise<MitgliedForderung> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('mitgliedId', mssql.Int, data.mitgliedId);
    request.input('zahlungTypId', mssql.Int, data.zahlungTypId);
    request.input('forderungsnummer', mssql.NVarChar(50), data.forderungsnummer || null);
    request.input('betrag', mssql.Decimal(18, 2), data.betrag);
    request.input('waehrungId', mssql.Int, data.waehrungId);
    request.input('jahr', mssql.Int, data.jahr || null);
    request.input('quartal', mssql.Int, data.quartal || null);
    request.input('monat', mssql.Int, data.monat || null);
    request.input('faelligkeit', mssql.Date, new Date(data.faelligkeit));
    request.input('beschreibung', mssql.NVarChar(250), data.beschreibung || null);
    request.input('statusId', mssql.Int, data.statusId);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Finanz].[MitgliedForderung] (
        VereinId, MitgliedId, ZahlungTypId, Forderungsnummer, Betrag, WaehrungId,
        Jahr, Quartal, Monat, Faelligkeit, Beschreibung, StatusId, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @mitgliedId, @zahlungTypId, @forderungsnummer, @betrag, @waehrungId,
        @jahr, @quartal, @monat, @faelligkeit, @beschreibung, @statusId, @created, @createdBy
      )
    `);

    return this.mapToForderung(result.recordset[0]);
  }

  // Update Forderung
  async update(id: number, data: UpdateMitgliedForderungDto, userId?: number): Promise<MitgliedForderung | null> {
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
    if (data.faelligkeit !== undefined) {
      request.input('faelligkeit', mssql.Date, new Date(data.faelligkeit));
      updates.push('Faelligkeit = @faelligkeit');
    }
    if (data.statusId !== undefined) {
      request.input('statusId', mssql.Int, data.statusId);
      updates.push('StatusId = @statusId');
    }
    if (data.beschreibung !== undefined) {
      request.input('beschreibung', mssql.NVarChar(250), data.beschreibung);
      updates.push('Beschreibung = @beschreibung');
    }
    if (data.bezahltAm !== undefined) {
      request.input('bezahltAm', mssql.Date, data.bezahltAm ? new Date(data.bezahltAm) : null);
      updates.push('BezahltAm = @bezahltAm');
    }

    await request.query(`
      UPDATE [Finanz].[MitgliedForderung]
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Map row to Forderung
  private mapToForderung(row: any): MitgliedForderung {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      mitgliedId: row.MitgliedId,
      zahlungTypId: row.ZahlungTypId,
      forderungsnummer: row.Forderungsnummer,
      betrag: row.Betrag,
      waehrungId: row.WaehrungId,
      jahr: row.Jahr,
      quartal: row.Quartal,
      monat: row.Monat,
      faelligkeit: row.Faelligkeit,
      beschreibung: row.Beschreibung,
      statusId: row.StatusId,
      bezahltAm: row.BezahltAm,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      mitgliedName: row.MitgliedName,
      zahlungTypName: row.ZahlungTypName,
      statusName: row.StatusName,
      bezahltBetrag: row.BezahltBetrag || 0,
      offenerBetrag: (row.Betrag || 0) - (row.BezahltBetrag || 0),
    };
  }
}

// Singleton instance
export const forderungRepository = new ForderungRepository();

