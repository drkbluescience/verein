/**
 * BankBuchung Repository
 * Bank Transaction operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { BankBuchung, CreateBankBuchungDto, UpdateBankBuchungDto } from '../models/bank.model';

export class BankBuchungRepository extends BaseRepository<BankBuchung> {
  constructor() {
    super({ schema: 'Finanz', table: 'BankBuchung' });
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number, includeDeleted = false): Promise<BankBuchung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    let whereClause = 'bb.VereinId = @vereinId';
    if (!includeDeleted) {
      whereClause += ' AND (bb.DeletedFlag IS NULL OR bb.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT bb.*, bk.IBAN as BankkontoIban, w.Code as WaehrungCode, s.Name as StatusName
      FROM [Finanz].[BankBuchung] bb
      LEFT JOIN [dbo].[Bankkonto] bk ON bb.BankKontoId = bk.Id
      LEFT JOIN [Keytable].[Waehrung] w ON bb.WaehrungId = w.Id
      LEFT JOIN [Keytable].[Status] s ON bb.StatusId = s.Id
      WHERE ${whereClause}
      ORDER BY bb.Buchungsdatum DESC
    `);

    return result.recordset.map(this.mapToBuchung);
  }

  // Find by BankKonto ID
  async findByBankKontoId(bankKontoId: number, includeDeleted = false): Promise<BankBuchung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('bankKontoId', mssql.Int, bankKontoId);

    let whereClause = 'bb.BankKontoId = @bankKontoId';
    if (!includeDeleted) {
      whereClause += ' AND (bb.DeletedFlag IS NULL OR bb.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT bb.*, bk.IBAN as BankkontoIban, w.Code as WaehrungCode, s.Name as StatusName
      FROM [Finanz].[BankBuchung] bb
      LEFT JOIN [dbo].[Bankkonto] bk ON bb.BankKontoId = bk.Id
      LEFT JOIN [Keytable].[Waehrung] w ON bb.WaehrungId = w.Id
      LEFT JOIN [Keytable].[Status] s ON bb.StatusId = s.Id
      WHERE ${whereClause}
      ORDER BY bb.Buchungsdatum DESC
    `);

    return result.recordset.map(this.mapToBuchung);
  }

  // Find by date range
  async findByDateRange(fromDate: Date, toDate: Date, bankKontoId?: number): Promise<BankBuchung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('fromDate', mssql.Date, fromDate);
    request.input('toDate', mssql.Date, toDate);

    let whereClause = 'bb.Buchungsdatum BETWEEN @fromDate AND @toDate AND (bb.DeletedFlag IS NULL OR bb.DeletedFlag = 0)';
    if (bankKontoId) {
      request.input('bankKontoId', mssql.Int, bankKontoId);
      whereClause += ' AND bb.BankKontoId = @bankKontoId';
    }

    const result = await request.query(`
      SELECT bb.*, bk.IBAN as BankkontoIban, w.Code as WaehrungCode, s.Name as StatusName
      FROM [Finanz].[BankBuchung] bb
      LEFT JOIN [dbo].[Bankkonto] bk ON bb.BankKontoId = bk.Id
      LEFT JOIN [Keytable].[Waehrung] w ON bb.WaehrungId = w.Id
      LEFT JOIN [Keytable].[Status] s ON bb.StatusId = s.Id
      WHERE ${whereClause}
      ORDER BY bb.Buchungsdatum DESC
    `);

    return result.recordset.map(this.mapToBuchung);
  }

  // Get total amount for bank account
  async getTotalAmount(bankKontoId: number, fromDate?: Date, toDate?: Date): Promise<number> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('bankKontoId', mssql.Int, bankKontoId);

    let whereClause = 'BankKontoId = @bankKontoId AND (DeletedFlag IS NULL OR DeletedFlag = 0)';
    if (fromDate) {
      request.input('fromDate', mssql.Date, fromDate);
      whereClause += ' AND Buchungsdatum >= @fromDate';
    }
    if (toDate) {
      request.input('toDate', mssql.Date, toDate);
      whereClause += ' AND Buchungsdatum <= @toDate';
    }

    const result = await request.query(`
      SELECT ISNULL(SUM(Betrag), 0) as Total
      FROM [Finanz].[BankBuchung]
      WHERE ${whereClause}
    `);

    return result.recordset[0].Total;
  }

  // Create bank transaction
  async create(data: CreateBankBuchungDto, userId?: number): Promise<BankBuchung> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('bankKontoId', mssql.Int, data.bankKontoId);
    request.input('buchungsdatum', mssql.Date, new Date(data.buchungsdatum));
    request.input('betrag', mssql.Decimal(18, 2), data.betrag);
    request.input('waehrungId', mssql.Int, data.waehrungId);
    request.input('empfaenger', mssql.NVarChar(100), data.empfaenger || null);
    request.input('verwendungszweck', mssql.NVarChar(250), data.verwendungszweck || null);
    request.input('referenz', mssql.NVarChar(100), data.referenz || null);
    request.input('statusId', mssql.Int, data.statusId);
    request.input('angelegtAm', mssql.DateTime, new Date());
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Finanz].[BankBuchung] (
        VereinId, BankKontoId, Buchungsdatum, Betrag, WaehrungId,
        Empfaenger, Verwendungszweck, Referenz, StatusId, AngelegtAm, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @bankKontoId, @buchungsdatum, @betrag, @waehrungId,
        @empfaenger, @verwendungszweck, @referenz, @statusId, @angelegtAm, @created, @createdBy
      )
    `);

    return this.mapToBuchung(result.recordset[0]);
  }

  // Map row to BankBuchung
  private mapToBuchung(row: any): BankBuchung {
    return {
      id: row.Id, vereinId: row.VereinId, bankKontoId: row.BankKontoId,
      buchungsdatum: row.Buchungsdatum, betrag: row.Betrag, waehrungId: row.WaehrungId,
      empfaenger: row.Empfaenger, verwendungszweck: row.Verwendungszweck, referenz: row.Referenz,
      statusId: row.StatusId, angelegtAm: row.AngelegtAm, created: row.Created, createdBy: row.CreatedBy,
      modified: row.Modified, modifiedBy: row.ModifiedBy, deletedFlag: row.DeletedFlag,
      bankkontoIban: row.BankkontoIban, waehrungCode: row.WaehrungCode, statusName: row.StatusName,
    };
  }
}

export const bankBuchungRepository = new BankBuchungRepository();

