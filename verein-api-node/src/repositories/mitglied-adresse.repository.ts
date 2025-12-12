/**
 * MitgliedAdresse Repository
 * Member Address operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { MitgliedAdresse, CreateMitgliedAdresseDto, UpdateMitgliedAdresseDto } from '../models';

export class MitgliedAdresseRepository extends BaseRepository<MitgliedAdresse> {
  constructor() {
    super({ schema: 'Mitglied', table: 'MitgliedAdresse' });
  }

  // Find by Mitglied ID
  async findByMitgliedId(mitgliedId: number, includeDeleted = false): Promise<MitgliedAdresse[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);

    let whereClause = 'ma.MitgliedId = @mitgliedId';
    if (!includeDeleted) {
      whereClause += ' AND (ma.DeletedFlag IS NULL OR ma.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT ma.*, at.Name as AdresseTypName
      FROM [Mitglied].[MitgliedAdresse] ma
      LEFT JOIN [Keytable].[AdresseTyp] at ON ma.AdresseTypId = at.Id
      WHERE ${whereClause}
      ORDER BY ma.IstStandard DESC, ma.Created DESC
    `);

    return result.recordset.map(this.mapToAdresse);
  }

  // Get standard address
  async getStandardAddress(mitgliedId: number): Promise<MitgliedAdresse | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);

    const result = await request.query(`
      SELECT TOP 1 ma.*, at.Name as AdresseTypName
      FROM [Mitglied].[MitgliedAdresse] ma
      LEFT JOIN [Keytable].[AdresseTyp] at ON ma.AdresseTypId = at.Id
      WHERE ma.MitgliedId = @mitgliedId
        AND ma.IstStandard = 1
        AND (ma.DeletedFlag IS NULL OR ma.DeletedFlag = 0)
    `);

    return result.recordset.length > 0 ? this.mapToAdresse(result.recordset[0]) : null;
  }

  // Create Address
  async create(data: CreateMitgliedAdresseDto, userId?: number): Promise<MitgliedAdresse> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('mitgliedId', mssql.Int, data.mitgliedId);
    request.input('adresseTypId', mssql.Int, data.adresseTypId);
    request.input('strasse', mssql.NVarChar(100), data.strasse || null);
    request.input('hausnummer', mssql.NVarChar(10), data.hausnummer || null);
    request.input('adresszusatz', mssql.NVarChar(100), data.adresszusatz || null);
    request.input('plz', mssql.NVarChar(10), data.plz || null);
    request.input('ort', mssql.NVarChar(100), data.ort || null);
    request.input('stadtteil', mssql.NVarChar(50), data.stadtteil || null);
    request.input('bundesland', mssql.NVarChar(50), data.bundesland || null);
    request.input('land', mssql.NVarChar(50), data.land || null);
    request.input('postfach', mssql.NVarChar(30), data.postfach || null);
    request.input('telefonnummer', mssql.NVarChar(30), data.telefonnummer || null);
    request.input('email', mssql.NVarChar(100), data.email || null);
    request.input('hinweis', mssql.NVarChar(250), data.hinweis || null);
    request.input('latitude', mssql.Float, data.latitude || null);
    request.input('longitude', mssql.Float, data.longitude || null);
    request.input('gueltigVon', mssql.Date, data.gueltigVon ? new Date(data.gueltigVon) : null);
    request.input('gueltigBis', mssql.Date, data.gueltigBis ? new Date(data.gueltigBis) : null);
    request.input('istStandard', mssql.Bit, data.istStandard || false);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Mitglied].[MitgliedAdresse] (
        MitgliedId, AdresseTypId, Strasse, Hausnummer, Adresszusatz, PLZ, Ort,
        Stadtteil, Bundesland, Land, Postfach, Telefonnummer, EMail, Hinweis,
        Latitude, Longitude, GueltigVon, GueltigBis, IstStandard, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @mitgliedId, @adresseTypId, @strasse, @hausnummer, @adresszusatz, @plz, @ort,
        @stadtteil, @bundesland, @land, @postfach, @telefonnummer, @email, @hinweis,
        @latitude, @longitude, @gueltigVon, @gueltigBis, @istStandard, @created, @createdBy
      )
    `);

    return this.mapToAdresse(result.recordset[0]);
  }

  // Update Address
  async update(id: number, data: UpdateMitgliedAdresseDto, userId?: number): Promise<MitgliedAdresse | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];

    if (data.strasse !== undefined) {
      request.input('strasse', mssql.NVarChar(100), data.strasse);
      updates.push('Strasse = @strasse');
    }
    if (data.ort !== undefined) {
      request.input('ort', mssql.NVarChar(100), data.ort);
      updates.push('Ort = @ort');
    }
    if (data.plz !== undefined) {
      request.input('plz', mssql.NVarChar(10), data.plz);
      updates.push('PLZ = @plz');
    }
    if (data.istStandard !== undefined) {
      request.input('istStandard', mssql.Bit, data.istStandard);
      updates.push('IstStandard = @istStandard');
    }

    await request.query(`
      UPDATE [Mitglied].[MitgliedAdresse]
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Set as standard address
  async setAsStandard(mitgliedId: number, addressId: number): Promise<boolean> {
    const pool = await this.getDb();
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Clear existing standard
      await transaction.request()
        .input('mitgliedId', mssql.Int, mitgliedId)
        .query(`UPDATE [Mitglied].[MitgliedAdresse] SET IstStandard = 0 WHERE MitgliedId = @mitgliedId`);

      // Set new standard
      await transaction.request()
        .input('addressId', mssql.Int, addressId)
        .query(`UPDATE [Mitglied].[MitgliedAdresse] SET IstStandard = 1 WHERE Id = @addressId`);

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Map row to MitgliedAdresse
  private mapToAdresse(row: any): MitgliedAdresse {
    return {
      id: row.Id,
      mitgliedId: row.MitgliedId,
      adresseTypId: row.AdresseTypId,
      strasse: row.Strasse,
      hausnummer: row.Hausnummer,
      adresszusatz: row.Adresszusatz,
      plz: row.PLZ,
      ort: row.Ort,
      stadtteil: row.Stadtteil,
      bundesland: row.Bundesland,
      land: row.Land,
      postfach: row.Postfach,
      telefonnummer: row.Telefonnummer,
      email: row.EMail,
      hinweis: row.Hinweis,
      latitude: row.Latitude,
      longitude: row.Longitude,
      gueltigVon: row.GueltigVon,
      gueltigBis: row.GueltigBis,
      istStandard: row.IstStandard,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      adresseTypName: row.AdresseTypName,
    };
  }
}

export const mitgliedAdresseRepository = new MitgliedAdresseRepository();
