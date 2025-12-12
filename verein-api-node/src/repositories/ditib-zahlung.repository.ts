/**
 * VereinDitibZahlung Repository
 * DITIB Payment operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { VereinDitibZahlung, CreateVereinDitibZahlungDto } from '../models';

export class DitibZahlungRepository extends BaseRepository<VereinDitibZahlung> {
  constructor() {
    super({ schema: 'Finanz', table: 'VereinDitibZahlung' });
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number): Promise<VereinDitibZahlung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);
    const result = await request.query(`
      SELECT dz.*, v.Name as VereinName
      FROM [Finanz].[VereinDitibZahlung] dz
      LEFT JOIN [Verein].[Verein] v ON dz.VereinId = v.Id
      WHERE dz.VereinId = @vereinId
        AND (dz.DeletedFlag IS NULL OR dz.DeletedFlag = 0)
      ORDER BY dz.Zahlungsdatum DESC
    `);
    return result.recordset.map(this.mapToZahlung);
  }

  // Find by Zahlungsperiode
  async findByPeriode(zahlungsperiode: string, vereinId?: number): Promise<VereinDitibZahlung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('zahlungsperiode', mssql.NVarChar(7), zahlungsperiode);
    
    let whereClause = `dz.Zahlungsperiode = @zahlungsperiode AND (dz.DeletedFlag IS NULL OR dz.DeletedFlag = 0)`;
    if (vereinId) {
      request.input('vereinId', mssql.Int, vereinId);
      whereClause += ` AND dz.VereinId = @vereinId`;
    }

    const result = await request.query(`
      SELECT dz.*, v.Name as VereinName
      FROM [Finanz].[VereinDitibZahlung] dz
      LEFT JOIN [Verein].[Verein] v ON dz.VereinId = v.Id
      WHERE ${whereClause}
      ORDER BY dz.Zahlungsdatum DESC
    `);
    return result.recordset.map(this.mapToZahlung);
  }

  // Find pending
  async findPending(vereinId?: number): Promise<VereinDitibZahlung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    
    let whereClause = `dz.StatusId = 1 AND (dz.DeletedFlag IS NULL OR dz.DeletedFlag = 0)`;
    if (vereinId) {
      request.input('vereinId', mssql.Int, vereinId);
      whereClause += ` AND dz.VereinId = @vereinId`;
    }

    const result = await request.query(`
      SELECT dz.*, v.Name as VereinName
      FROM [Finanz].[VereinDitibZahlung] dz
      LEFT JOIN [Verein].[Verein] v ON dz.VereinId = v.Id
      WHERE ${whereClause}
      ORDER BY dz.Zahlungsdatum DESC
    `);
    return result.recordset.map(this.mapToZahlung);
  }

  // Create
  async create(data: CreateVereinDitibZahlungDto, userId?: number): Promise<VereinDitibZahlung> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('betrag', mssql.Decimal(18, 2), data.betrag);
    request.input('waehrungId', mssql.Int, data.waehrungId || 1);
    request.input('zahlungsdatum', mssql.Date, new Date(data.zahlungsdatum));
    request.input('zahlungsperiode', mssql.NVarChar(7), data.zahlungsperiode);
    request.input('zahlungsweg', mssql.NVarChar(30), data.zahlungsweg || null);
    request.input('bankkontoId', mssql.Int, data.bankkontoId || null);
    request.input('referenz', mssql.NVarChar(100), data.referenz || null);
    request.input('bemerkung', mssql.NVarChar(250), data.bemerkung || null);
    request.input('statusId', mssql.Int, data.statusId || 1);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Finanz].[VereinDitibZahlung] (
        VereinId, Betrag, WaehrungId, Zahlungsdatum, Zahlungsperiode, Zahlungsweg,
        BankkontoId, Referenz, Bemerkung, StatusId, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @betrag, @waehrungId, @zahlungsdatum, @zahlungsperiode, @zahlungsweg,
        @bankkontoId, @referenz, @bemerkung, @statusId, @created, @createdBy
      )
    `);
    return this.mapToZahlung(result.recordset[0]);
  }

  // Map row
  private mapToZahlung(row: any): VereinDitibZahlung {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      betrag: parseFloat(row.Betrag),
      waehrungId: row.WaehrungId,
      zahlungsdatum: row.Zahlungsdatum,
      zahlungsperiode: row.Zahlungsperiode,
      zahlungsweg: row.Zahlungsweg,
      bankkontoId: row.BankkontoId,
      referenz: row.Referenz,
      bemerkung: row.Bemerkung,
      statusId: row.StatusId,
      bankBuchungId: row.BankBuchungId,
      vereinName: row.VereinName,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
    };
  }
}

export const ditibZahlungRepository = new DitibZahlungRepository();

