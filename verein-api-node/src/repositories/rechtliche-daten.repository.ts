/**
 * RechtlicheDaten Repository
 * Legal Data operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { RechtlicheDaten } from '../models';

export class RechtlicheDatenRepository extends BaseRepository<RechtlicheDaten> {
  constructor() {
    super({ schema: 'Verein', table: 'RechtlicheDaten' });
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number): Promise<RechtlicheDaten | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);
    const result = await request.query(`
      SELECT * FROM [Verein].[RechtlicheDaten]
      WHERE VereinId = @vereinId AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);
    return result.recordset[0] ? this.mapToRechtlicheDaten(result.recordset[0]) : null;
  }

  // Create
  async create(data: Partial<RechtlicheDaten>, userId?: number): Promise<RechtlicheDaten> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('registergerichtName', mssql.NVarChar(200), data.registergerichtName || null);
    request.input('registergerichtNummer', mssql.NVarChar(100), data.registergerichtNummer || null);
    request.input('registergerichtOrt', mssql.NVarChar(100), data.registergerichtOrt || null);
    request.input('registergerichtEintragungsdatum', mssql.Date, data.registergerichtEintragungsdatum || null);
    request.input('finanzamtName', mssql.NVarChar(200), data.finanzamtName || null);
    request.input('finanzamtNummer', mssql.NVarChar(100), data.finanzamtNummer || null);
    request.input('finanzamtOrt', mssql.NVarChar(100), data.finanzamtOrt || null);
    request.input('steuerpflichtig', mssql.Bit, data.steuerpflichtig || false);
    request.input('steuerbefreit', mssql.Bit, data.steuerbefreit || false);
    request.input('gemeinnuetzigAnerkannt', mssql.Bit, data.gemeinnuetzigAnerkannt || false);
    request.input('gemeinnuetzigkeitBis', mssql.Date, data.gemeinnuetzigkeitBis || null);
    request.input('bemerkung', mssql.NVarChar(500), data.bemerkung || null);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Verein].[RechtlicheDaten] (
        VereinId, RegistergerichtName, RegistergerichtNummer, RegistergerichtOrt,
        RegistergerichtEintragungsdatum, FinanzamtName, FinanzamtNummer, FinanzamtOrt,
        Steuerpflichtig, Steuerbefreit, GemeinnuetzigAnerkannt, GemeinnuetzigkeitBis,
        Bemerkung, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @registergerichtName, @registergerichtNummer, @registergerichtOrt,
        @registergerichtEintragungsdatum, @finanzamtName, @finanzamtNummer, @finanzamtOrt,
        @steuerpflichtig, @steuerbefreit, @gemeinnuetzigAnerkannt, @gemeinnuetzigkeitBis,
        @bemerkung, @created, @createdBy
      )
    `);
    return this.mapToRechtlicheDaten(result.recordset[0]);
  }

  // Update
  async update(id: number, data: Partial<RechtlicheDaten>, userId?: number): Promise<RechtlicheDaten | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('registergerichtName', mssql.NVarChar(200), data.registergerichtName || null);
    request.input('registergerichtNummer', mssql.NVarChar(100), data.registergerichtNummer || null);
    request.input('registergerichtOrt', mssql.NVarChar(100), data.registergerichtOrt || null);
    request.input('registergerichtEintragungsdatum', mssql.Date, data.registergerichtEintragungsdatum || null);
    request.input('finanzamtName', mssql.NVarChar(200), data.finanzamtName || null);
    request.input('finanzamtNummer', mssql.NVarChar(100), data.finanzamtNummer || null);
    request.input('finanzamtOrt', mssql.NVarChar(100), data.finanzamtOrt || null);
    request.input('steuerpflichtig', mssql.Bit, data.steuerpflichtig || false);
    request.input('steuerbefreit', mssql.Bit, data.steuerbefreit || false);
    request.input('gemeinnuetzigAnerkannt', mssql.Bit, data.gemeinnuetzigAnerkannt || false);
    request.input('gemeinnuetzigkeitBis', mssql.Date, data.gemeinnuetzigkeitBis || null);
    request.input('bemerkung', mssql.NVarChar(500), data.bemerkung || null);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const result = await request.query(`
      UPDATE [Verein].[RechtlicheDaten] SET
        RegistergerichtName = @registergerichtName,
        RegistergerichtNummer = @registergerichtNummer,
        RegistergerichtOrt = @registergerichtOrt,
        RegistergerichtEintragungsdatum = @registergerichtEintragungsdatum,
        FinanzamtName = @finanzamtName,
        FinanzamtNummer = @finanzamtNummer,
        FinanzamtOrt = @finanzamtOrt,
        Steuerpflichtig = @steuerpflichtig,
        Steuerbefreit = @steuerbefreit,
        GemeinnuetzigAnerkannt = @gemeinnuetzigAnerkannt,
        GemeinnuetzigkeitBis = @gemeinnuetzigkeitBis,
        Bemerkung = @bemerkung,
        Modified = @modified,
        ModifiedBy = @modifiedBy
      OUTPUT INSERTED.*
      WHERE Id = @id AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);
    return result.recordset[0] ? this.mapToRechtlicheDaten(result.recordset[0]) : null;
  }

  // Map row
  private mapToRechtlicheDaten(row: any): RechtlicheDaten {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      registergerichtName: row.RegistergerichtName,
      registergerichtNummer: row.RegistergerichtNummer,
      registergerichtOrt: row.RegistergerichtOrt,
      registergerichtEintragungsdatum: row.RegistergerichtEintragungsdatum,
      finanzamtName: row.FinanzamtName,
      finanzamtNummer: row.FinanzamtNummer,
      finanzamtOrt: row.FinanzamtOrt,
      steuerpflichtig: row.Steuerpflichtig,
      steuerbefreit: row.Steuerbefreit,
      gemeinnuetzigAnerkannt: row.GemeinnuetzigAnerkannt,
      gemeinnuetzigkeitBis: row.GemeinnuetzigkeitBis,
      bemerkung: row.Bemerkung,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
    };
  }
}

export const rechtlicheDatenRepository = new RechtlicheDatenRepository();

