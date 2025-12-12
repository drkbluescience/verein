/**
 * MitgliedFamilie Repository
 * Member Family Relationships operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { MitgliedFamilie, CreateMitgliedFamilieDto, UpdateMitgliedFamilieDto } from '../models';

export class MitgliedFamilieRepository extends BaseRepository<MitgliedFamilie> {
  constructor() {
    super({ schema: 'Mitglied', table: 'MitgliedFamilie' });
  }

  // Find by Mitglied ID (as child)
  async findByMitgliedId(mitgliedId: number, includeDeleted = false): Promise<MitgliedFamilie[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);

    let whereClause = 'mf.MitgliedId = @mitgliedId';
    if (!includeDeleted) {
      whereClause += ' AND (mf.DeletedFlag IS NULL OR mf.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT mf.*,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        CONCAT(pm.Vorname, ' ', pm.Nachname) as ParentMitgliedName,
        fbt.Name as BeziehungTypName,
        mfs.Name as StatusName
      FROM [Mitglied].[MitgliedFamilie] mf
      LEFT JOIN [Mitglied].[Mitglied] m ON mf.MitgliedId = m.Id
      LEFT JOIN [Mitglied].[Mitglied] pm ON mf.ParentMitgliedId = pm.Id
      LEFT JOIN [Keytable].[FamilienbeziehungTyp] fbt ON mf.FamilienbeziehungTypId = fbt.Id
      LEFT JOIN [Keytable].[MitgliedFamilieStatus] mfs ON mf.MitgliedFamilieStatusId = mfs.Id
      WHERE ${whereClause}
      ORDER BY mf.Created DESC
    `);

    return result.recordset.map(this.mapToFamilie);
  }

  // Get children of a member
  async getChildren(parentMitgliedId: number): Promise<MitgliedFamilie[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('parentMitgliedId', mssql.Int, parentMitgliedId);

    const result = await request.query(`
      SELECT mf.*,
        CONCAT(m.Vorname, ' ', m.Nachname) as MitgliedName,
        CONCAT(pm.Vorname, ' ', pm.Nachname) as ParentMitgliedName,
        fbt.Name as BeziehungTypName,
        mfs.Name as StatusName
      FROM [Mitglied].[MitgliedFamilie] mf
      LEFT JOIN [Mitglied].[Mitglied] m ON mf.MitgliedId = m.Id
      LEFT JOIN [Mitglied].[Mitglied] pm ON mf.ParentMitgliedId = pm.Id
      LEFT JOIN [Keytable].[FamilienbeziehungTyp] fbt ON mf.FamilienbeziehungTypId = fbt.Id
      LEFT JOIN [Keytable].[MitgliedFamilieStatus] mfs ON mf.MitgliedFamilieStatusId = mfs.Id
      WHERE mf.ParentMitgliedId = @parentMitgliedId
        AND (mf.DeletedFlag IS NULL OR mf.DeletedFlag = 0)
      ORDER BY m.Geburtsdatum ASC
    `);

    return result.recordset.map(this.mapToFamilie);
  }

  // Create family relationship
  async create(data: CreateMitgliedFamilieDto, userId?: number): Promise<MitgliedFamilie> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('mitgliedId', mssql.Int, data.mitgliedId);
    request.input('parentMitgliedId', mssql.Int, data.parentMitgliedId);
    request.input('familienbeziehungTypId', mssql.Int, data.familienbeziehungTypId);
    request.input('mitgliedFamilieStatusId', mssql.Int, data.mitgliedFamilieStatusId);
    request.input('gueltigVon', mssql.Date, data.gueltigVon ? new Date(data.gueltigVon) : null);
    request.input('gueltigBis', mssql.Date, data.gueltigBis ? new Date(data.gueltigBis) : null);
    request.input('hinweis', mssql.NVarChar(250), data.hinweis || null);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Mitglied].[MitgliedFamilie] (
        VereinId, MitgliedId, ParentMitgliedId, FamilienbeziehungTypId,
        MitgliedFamilieStatusId, GueltigVon, GueltigBis, Hinweis, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @mitgliedId, @parentMitgliedId, @familienbeziehungTypId,
        @mitgliedFamilieStatusId, @gueltigVon, @gueltigBis, @hinweis, @created, @createdBy
      )
    `);

    return this.mapToFamilie(result.recordset[0]);
  }

  // Update family relationship
  async update(id: number, data: UpdateMitgliedFamilieDto, userId?: number): Promise<MitgliedFamilie | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];

    if (data.familienbeziehungTypId !== undefined) {
      request.input('familienbeziehungTypId', mssql.Int, data.familienbeziehungTypId);
      updates.push('FamilienbeziehungTypId = @familienbeziehungTypId');
    }
    if (data.mitgliedFamilieStatusId !== undefined) {
      request.input('mitgliedFamilieStatusId', mssql.Int, data.mitgliedFamilieStatusId);
      updates.push('MitgliedFamilieStatusId = @mitgliedFamilieStatusId');
    }
    if (data.hinweis !== undefined) {
      request.input('hinweis', mssql.NVarChar(250), data.hinweis);
      updates.push('Hinweis = @hinweis');
    }

    await request.query(`
      UPDATE [Mitglied].[MitgliedFamilie]
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Map row to MitgliedFamilie
  private mapToFamilie(row: any): MitgliedFamilie {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      mitgliedId: row.MitgliedId,
      parentMitgliedId: row.ParentMitgliedId,
      familienbeziehungTypId: row.FamilienbeziehungTypId,
      mitgliedFamilieStatusId: row.MitgliedFamilieStatusId,
      gueltigVon: row.GueltigVon,
      gueltigBis: row.GueltigBis,
      hinweis: row.Hinweis,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      mitgliedName: row.MitgliedName,
      parentMitgliedName: row.ParentMitgliedName,
      beziehungTypName: row.BeziehungTypName,
      statusName: row.StatusName,
    };
  }
}

export const mitgliedFamilieRepository = new MitgliedFamilieRepository();

