/**
 * Bankkonto Repository
 * Bank Account operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { Bankkonto, CreateBankkontoDto, UpdateBankkontoDto } from '../models/bank.model';

export class BankkontoRepository extends BaseRepository<Bankkonto> {
  constructor() {
    super({ schema: 'dbo', table: 'Bankkonto' });
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number, includeDeleted = false): Promise<Bankkonto[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    let whereClause = 'bk.VereinId = @vereinId';
    if (!includeDeleted) {
      whereClause += ' AND (bk.DeletedFlag IS NULL OR bk.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT bk.*, v.Name as VereinName
      FROM [dbo].[Bankkonto] bk
      LEFT JOIN [Verein].[Verein] v ON bk.VereinId = v.Id
      WHERE ${whereClause}
      ORDER BY bk.IstStandard DESC, bk.Created DESC
    `);

    return result.recordset.map(this.mapToBankkonto);
  }

  // Find by IBAN
  async findByIban(iban: string): Promise<Bankkonto | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('iban', mssql.NVarChar(34), iban);

    const result = await request.query(`
      SELECT bk.*, v.Name as VereinName
      FROM [dbo].[Bankkonto] bk
      LEFT JOIN [Verein].[Verein] v ON bk.VereinId = v.Id
      WHERE bk.IBAN = @iban AND (bk.DeletedFlag IS NULL OR bk.DeletedFlag = 0)
    `);

    return result.recordset.length > 0 ? this.mapToBankkonto(result.recordset[0]) : null;
  }

  // Get standard account for Verein
  async getStandardAccount(vereinId: number): Promise<Bankkonto | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    const result = await request.query(`
      SELECT TOP 1 bk.*, v.Name as VereinName
      FROM [dbo].[Bankkonto] bk
      LEFT JOIN [Verein].[Verein] v ON bk.VereinId = v.Id
      WHERE bk.VereinId = @vereinId AND bk.IstStandard = 1
        AND (bk.DeletedFlag IS NULL OR bk.DeletedFlag = 0)
    `);

    return result.recordset.length > 0 ? this.mapToBankkonto(result.recordset[0]) : null;
  }

  // Create bank account
  async create(data: CreateBankkontoDto, userId?: number): Promise<Bankkonto> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('kontotypId', mssql.Int, data.kontotypId || null);
    request.input('iban', mssql.NVarChar(34), data.iban);
    request.input('bic', mssql.NVarChar(20), data.bic || null);
    request.input('kontoinhaber', mssql.NVarChar(100), data.kontoinhaber || null);
    request.input('bankname', mssql.NVarChar(100), data.bankname || null);
    request.input('kontoNr', mssql.NVarChar(30), data.kontoNr || null);
    request.input('blz', mssql.NVarChar(15), data.blz || null);
    request.input('beschreibung', mssql.NVarChar(250), data.beschreibung || null);
    request.input('gueltigVon', mssql.Date, data.gueltigVon ? new Date(data.gueltigVon) : null);
    request.input('gueltigBis', mssql.Date, data.gueltigBis ? new Date(data.gueltigBis) : null);
    request.input('istStandard', mssql.Bit, data.istStandard || false);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [dbo].[Bankkonto] (
        VereinId, KontotypId, IBAN, BIC, Kontoinhaber, Bankname,
        KontoNr, BLZ, Beschreibung, GueltigVon, GueltigBis, IstStandard,
        Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @kontotypId, @iban, @bic, @kontoinhaber, @bankname,
        @kontoNr, @blz, @beschreibung, @gueltigVon, @gueltigBis, @istStandard,
        @created, @createdBy
      )
    `);

    return this.mapToBankkonto(result.recordset[0]);
  }

  // Update bank account
  async update(id: number, data: UpdateBankkontoDto, userId?: number): Promise<Bankkonto | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];

    if (data.kontotypId !== undefined) {
      request.input('kontotypId', mssql.Int, data.kontotypId);
      updates.push('KontotypId = @kontotypId');
    }
    if (data.iban !== undefined) {
      request.input('iban', mssql.NVarChar(34), data.iban);
      updates.push('IBAN = @iban');
    }
    if (data.bic !== undefined) {
      request.input('bic', mssql.NVarChar(20), data.bic);
      updates.push('BIC = @bic');
    }
    if (data.kontoinhaber !== undefined) {
      request.input('kontoinhaber', mssql.NVarChar(100), data.kontoinhaber);
      updates.push('Kontoinhaber = @kontoinhaber');
    }
    if (data.bankname !== undefined) {
      request.input('bankname', mssql.NVarChar(100), data.bankname);
      updates.push('Bankname = @bankname');
    }
    if (data.beschreibung !== undefined) {
      request.input('beschreibung', mssql.NVarChar(250), data.beschreibung);
      updates.push('Beschreibung = @beschreibung');
    }

    await request.query(`
      UPDATE [dbo].[Bankkonto]
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Set as standard account
  async setAsStandard(vereinId: number, bankkontoId: number): Promise<void> {
    const pool = await this.getDb();
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Remove standard from all accounts
      await transaction.request()
        .input('vereinId', mssql.Int, vereinId)
        .query(`UPDATE [dbo].[Bankkonto] SET IstStandard = 0 WHERE VereinId = @vereinId`);

      // Set new standard
      await transaction.request()
        .input('id', mssql.Int, bankkontoId)
        .query(`UPDATE [dbo].[Bankkonto] SET IstStandard = 1 WHERE Id = @id`);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Validate IBAN format
  isValidIban(iban: string): boolean {
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/.test(cleanIban);
  }

  // Map row to Bankkonto
  private mapToBankkonto(row: any): Bankkonto {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      kontotypId: row.KontotypId,
      iban: row.IBAN,
      bic: row.BIC,
      kontoinhaber: row.Kontoinhaber,
      bankname: row.Bankname,
      kontoNr: row.KontoNr,
      blz: row.BLZ,
      beschreibung: row.Beschreibung,
      gueltigVon: row.GueltigVon,
      gueltigBis: row.GueltigBis,
      istStandard: row.IstStandard,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      vereinName: row.VereinName,
    };
  }
}

export const bankkontoRepository = new BankkontoRepository();

