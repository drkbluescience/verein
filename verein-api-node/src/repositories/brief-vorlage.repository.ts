/**
 * BriefVorlage Repository
 * Letter Templates operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { BriefVorlage, CreateBriefVorlageDto, UpdateBriefVorlageDto } from '../models';

export class BriefVorlageRepository extends BaseRepository<BriefVorlage> {
  constructor() {
    super({ schema: 'Brief', table: 'BriefVorlage' });
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number, includeDeleted = false): Promise<BriefVorlage[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    let whereClause = 'VereinId = @vereinId';
    if (!includeDeleted) {
      whereClause += ' AND (DeletedFlag IS NULL OR DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT * FROM [Brief].[BriefVorlage]
      WHERE ${whereClause}
      ORDER BY Name
    `);

    return result.recordset.map(this.mapToVorlage);
  }

  // Find active templates by Verein ID
  async findActiveByVereinId(vereinId: number): Promise<BriefVorlage[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    const result = await request.query(`
      SELECT * FROM [Brief].[BriefVorlage]
      WHERE VereinId = @vereinId
        AND (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND IstAktiv = 1
      ORDER BY Name
    `);

    return result.recordset.map(this.mapToVorlage);
  }

  // Find by category
  async findByCategory(vereinId: number, kategorie: string): Promise<BriefVorlage[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);
    request.input('kategorie', mssql.NVarChar, kategorie);

    const result = await request.query(`
      SELECT * FROM [Brief].[BriefVorlage]
      WHERE VereinId = @vereinId
        AND (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND Kategorie = @kategorie
      ORDER BY Name
    `);

    return result.recordset.map(this.mapToVorlage);
  }

  // Get categories for a Verein
  async getCategories(vereinId: number): Promise<string[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    const result = await request.query(`
      SELECT DISTINCT Kategorie FROM [Brief].[BriefVorlage]
      WHERE VereinId = @vereinId
        AND (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND Kategorie IS NOT NULL
      ORDER BY Kategorie
    `);

    return result.recordset.map((r: any) => r.Kategorie);
  }

  // Create template
  async create(data: CreateBriefVorlageDto, userId?: number): Promise<BriefVorlage> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('name', mssql.NVarChar(150), data.name);
    request.input('beschreibung', mssql.NVarChar(500), data.beschreibung || null);
    request.input('betreff', mssql.NVarChar(200), data.betreff);
    request.input('inhalt', mssql.NVarChar(mssql.MAX), data.inhalt);
    request.input('kategorie', mssql.NVarChar(50), data.kategorie || null);
    request.input('logoPosition', mssql.NVarChar(20), data.logoPosition || 'top');
    request.input('schriftart', mssql.NVarChar(50), data.schriftart || 'Arial');
    request.input('schriftgroesse', mssql.Int, data.schriftgroesse || 14);
    request.input('istSystemvorlage', mssql.Bit, data.istSystemvorlage || false);
    request.input('istAktiv', mssql.Bit, data.istAktiv !== false);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Brief].[BriefVorlage] (
        VereinId, Name, Beschreibung, Betreff, Inhalt, Kategorie,
        LogoPosition, Schriftart, Schriftgroesse, IstSystemvorlage, IstAktiv, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @name, @beschreibung, @betreff, @inhalt, @kategorie,
        @logoPosition, @schriftart, @schriftgroesse, @istSystemvorlage, @istAktiv, @created, @createdBy
      )
    `);

    return this.mapToVorlage(result.recordset[0]);
  }

  // Update template
  async update(id: number, data: UpdateBriefVorlageDto, userId?: number): Promise<BriefVorlage | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];

    if (data.name !== undefined) {
      request.input('name', mssql.NVarChar(150), data.name);
      updates.push('Name = @name');
    }
    if (data.beschreibung !== undefined) {
      request.input('beschreibung', mssql.NVarChar(500), data.beschreibung);
      updates.push('Beschreibung = @beschreibung');
    }
    if (data.betreff !== undefined) {
      request.input('betreff', mssql.NVarChar(200), data.betreff);
      updates.push('Betreff = @betreff');
    }
    if (data.inhalt !== undefined) {
      request.input('inhalt', mssql.NVarChar(mssql.MAX), data.inhalt);
      updates.push('Inhalt = @inhalt');
    }
    if (data.kategorie !== undefined) {
      request.input('kategorie', mssql.NVarChar(50), data.kategorie);
      updates.push('Kategorie = @kategorie');
    }
    if (data.istAktiv !== undefined) {
      request.input('istAktiv', mssql.Bit, data.istAktiv);
      updates.push('IstAktiv = @istAktiv');
    }

    await request.query(`
      UPDATE [Brief].[BriefVorlage]
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Map row to BriefVorlage
  private mapToVorlage(row: any): BriefVorlage {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      name: row.Name,
      beschreibung: row.Beschreibung,
      betreff: row.Betreff,
      inhalt: row.Inhalt,
      kategorie: row.Kategorie,
      logoPosition: row.LogoPosition || 'top',
      schriftart: row.Schriftart || 'Arial',
      schriftgroesse: row.Schriftgroesse || 14,
      istSystemvorlage: row.IstSystemvorlage || false,
      istAktiv: row.IstAktiv !== false,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
    };
  }
}

// Singleton instance
export const briefVorlageRepository = new BriefVorlageRepository();

