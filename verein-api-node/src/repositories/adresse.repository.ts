/**
 * Adresse Repository
 * Address operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { Adresse, CreateAdresseDto } from '../models';

export class AdresseRepository extends BaseRepository<Adresse> {
  constructor() {
    super({ schema: 'dbo', table: 'Adresse' });
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number): Promise<Adresse[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);
    const result = await request.query(`
      SELECT * FROM [dbo].[Adresse]
      WHERE VereinId = @vereinId AND (DeletedFlag IS NULL OR DeletedFlag = 0)
      ORDER BY IstStandard DESC, Id DESC
    `);
    return result.recordset.map(this.mapToAdresse);
  }

  // Create
  async create(data: CreateAdresseDto, userId?: number): Promise<Adresse> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, data.vereinId || null);
    request.input('adressTypId', mssql.Int, data.adressTypId || null);
    request.input('strasse', mssql.NVarChar(200), data.strasse || null);
    request.input('hausnummer', mssql.NVarChar(20), data.hausnummer || null);
    request.input('plz', mssql.NVarChar(10), data.plz || null);
    request.input('ort', mssql.NVarChar(100), data.ort || null);
    request.input('landId', mssql.Int, data.landId || null);
    request.input('istStandard', mssql.Bit, data.istStandard || false);
    request.input('beschreibung', mssql.NVarChar(250), data.beschreibung || null);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [dbo].[Adresse] (
        VereinId, AdressTypId, Strasse, Hausnummer, PLZ, Ort, LandId,
        IstStandard, Beschreibung, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @adressTypId, @strasse, @hausnummer, @plz, @ort, @landId,
        @istStandard, @beschreibung, @created, @createdBy
      )
    `);
    return this.mapToAdresse(result.recordset[0]);
  }

  // Set as standard
  async setAsStandard(vereinId: number, adresseId: number): Promise<boolean> {
    const pool = await this.getDb();
    const transaction = pool.transaction();
    await transaction.begin();
    try {
      await transaction.request()
        .input('vereinId', mssql.Int, vereinId)
        .query(`UPDATE [dbo].[Adresse] SET IstStandard = 0 WHERE VereinId = @vereinId`);
      
      await transaction.request()
        .input('id', mssql.Int, adresseId)
        .query(`UPDATE [dbo].[Adresse] SET IstStandard = 1 WHERE Id = @id`);
      
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Map row
  private mapToAdresse(row: any): Adresse {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      adresseTypId: row.AdressTypId,
      strasse: row.Strasse,
      hausnummer: row.Hausnummer,
      plz: row.PLZ,
      ort: row.Ort,
      landId: row.LandId,
      istStandard: row.IstStandard,
      beschreibung: row.Beschreibung,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
    };
  }
}

export const adresseRepository = new AdresseRepository();

