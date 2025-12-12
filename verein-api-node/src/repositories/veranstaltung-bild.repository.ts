/**
 * VeranstaltungBild Repository
 * Event Image operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { VeranstaltungBild, CreateVeranstaltungBildDto, UpdateVeranstaltungBildDto } from '../models';

export class VeranstaltungBildRepository extends BaseRepository<VeranstaltungBild> {
  constructor() {
    super({ schema: 'dbo', table: 'VeranstaltungBild' });
  }

  // Find by Veranstaltung ID
  async findByVeranstaltungId(veranstaltungId: number): Promise<VeranstaltungBild[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('veranstaltungId', mssql.Int, veranstaltungId);

    const result = await request.query(`
      SELECT vb.*, v.Titel as VeranstaltungTitel
      FROM [dbo].[VeranstaltungBild] vb
      LEFT JOIN [dbo].[Veranstaltung] v ON vb.VeranstaltungId = v.Id
      WHERE vb.VeranstaltungId = @veranstaltungId
        AND (vb.DeletedFlag IS NULL OR vb.DeletedFlag = 0)
      ORDER BY vb.Reihenfolge ASC
    `);

    return result.recordset.map(this.mapToBild);
  }

  // Create image record
  async create(data: CreateVeranstaltungBildDto, userId?: number): Promise<VeranstaltungBild> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('veranstaltungId', mssql.Int, data.veranstaltungId);
    request.input('bildPfad', mssql.NVarChar(500), data.bildPfad);
    request.input('bildName', mssql.NVarChar(255), data.bildName || null);
    request.input('bildTyp', mssql.NVarChar(50), data.bildTyp || null);
    request.input('bildGroesse', mssql.Int, data.bildGroesse || null);
    request.input('titel', mssql.NVarChar(200), data.titel || null);
    request.input('reihenfolge', mssql.Int, data.reihenfolge || 1);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [dbo].[VeranstaltungBild] (
        VeranstaltungId, BildPfad, BildName, BildTyp, BildGroesse, Titel, Reihenfolge, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @veranstaltungId, @bildPfad, @bildName, @bildTyp, @bildGroesse, @titel, @reihenfolge, @created, @createdBy
      )
    `);

    return this.mapToBild(result.recordset[0]);
  }

  // Update image
  async update(id: number, data: UpdateVeranstaltungBildDto, userId?: number): Promise<VeranstaltungBild | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];

    if (data.titel !== undefined) {
      request.input('titel', mssql.NVarChar(200), data.titel);
      updates.push('Titel = @titel');
    }
    if (data.reihenfolge !== undefined) {
      request.input('reihenfolge', mssql.Int, data.reihenfolge);
      updates.push('Reihenfolge = @reihenfolge');
    }

    await request.query(`
      UPDATE [dbo].[VeranstaltungBild]
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Map row to VeranstaltungBild
  private mapToBild(row: any): VeranstaltungBild {
    return {
      id: row.Id,
      veranstaltungId: row.VeranstaltungId,
      bildPfad: row.BildPfad,
      bildName: row.BildName,
      bildTyp: row.BildTyp,
      bildGroesse: row.BildGroesse,
      titel: row.Titel,
      reihenfolge: row.Reihenfolge,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      veranstaltungTitel: row.VeranstaltungTitel,
    };
  }
}

export const veranstaltungBildRepository = new VeranstaltungBildRepository();

