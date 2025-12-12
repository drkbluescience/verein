/**
 * Brief Repository
 * Letter Drafts operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { Brief, CreateBriefDto, UpdateBriefDto, BriefStatistics } from '../models';

export class BriefRepository extends BaseRepository<Brief> {
  constructor() {
    super({ schema: 'Brief', table: 'Brief' });
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number, includeDeleted = false): Promise<Brief[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    let whereClause = 'b.VereinId = @vereinId';
    if (!includeDeleted) {
      whereClause += ' AND (b.DeletedFlag IS NULL OR b.DeletedFlag = 0)';
    }

    const result = await request.query(`
      SELECT b.*, v.Name as VorlageName
      FROM [Brief].[Brief] b
      LEFT JOIN [Brief].[BriefVorlage] v ON b.VorlageId = v.Id
      WHERE ${whereClause}
      ORDER BY b.Created DESC
    `);

    return result.recordset.map(this.mapToBrief);
  }

  // Find drafts (Entwurf) by Verein ID
  async findDraftsByVereinId(vereinId: number): Promise<Brief[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    const result = await request.query(`
      SELECT b.*, v.Name as VorlageName
      FROM [Brief].[Brief] b
      LEFT JOIN [Brief].[BriefVorlage] v ON b.VorlageId = v.Id
      WHERE b.VereinId = @vereinId
        AND (b.DeletedFlag IS NULL OR b.DeletedFlag = 0)
        AND b.Status = 'Entwurf'
      ORDER BY b.Created DESC
    `);

    return result.recordset.map(this.mapToBrief);
  }

  // Find sent letters by Verein ID
  async findSentByVereinId(vereinId: number): Promise<Brief[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    const result = await request.query(`
      SELECT b.*, v.Name as VorlageName
      FROM [Brief].[Brief] b
      LEFT JOIN [Brief].[BriefVorlage] v ON b.VorlageId = v.Id
      WHERE b.VereinId = @vereinId
        AND (b.DeletedFlag IS NULL OR b.DeletedFlag = 0)
        AND b.Status = 'Gesendet'
      ORDER BY b.Created DESC
    `);

    return result.recordset.map(this.mapToBrief);
  }

  // Get statistics
  async getStatistics(vereinId: number): Promise<BriefStatistics> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    const result = await request.query(`
      SELECT
        COUNT(*) as TotalBriefe,
        SUM(CASE WHEN Status = 'Entwurf' THEN 1 ELSE 0 END) as TotalEntwuerfe,
        SUM(CASE WHEN Status = 'Gesendet' THEN 1 ELSE 0 END) as TotalGesendet
      FROM [Brief].[Brief]
      WHERE VereinId = @vereinId AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);

    const nachrichtenResult = await request.query(`
      SELECT
        COUNT(*) as TotalNachrichten,
        SUM(CASE WHEN IstGelesen = 1 THEN 1 ELSE 0 END) as TotalGelesen
      FROM [Brief].[Nachricht]
      WHERE VereinId = @vereinId AND DeletedFlag = 0
    `);

    const row = result.recordset[0];
    const nRow = nachrichtenResult.recordset[0];
    const totalNachrichten = nRow?.TotalNachrichten || 0;
    const totalGelesen = nRow?.TotalGelesen || 0;

    return {
      totalBriefe: row?.TotalBriefe || 0,
      totalEntwuerfe: row?.TotalEntwuerfe || 0,
      totalGesendet: row?.TotalGesendet || 0,
      totalNachrichten,
      totalGelesen,
      leseQuote: totalNachrichten > 0 ? (totalGelesen / totalNachrichten) * 100 : 0,
    };
  }

  // Create Brief
  async create(data: CreateBriefDto, userId?: number): Promise<Brief> {
    const pool = await this.getDb();
    const request = pool.request();

    const selectedIds = data.selectedMitgliedIds ? JSON.stringify(data.selectedMitgliedIds) : null;

    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('vorlageId', mssql.Int, data.vorlageId || null);
    request.input('titel', mssql.NVarChar(200), data.titel);
    request.input('betreff', mssql.NVarChar(200), data.betreff);
    request.input('inhalt', mssql.NVarChar(mssql.MAX), data.inhalt);
    request.input('logoUrl', mssql.NVarChar(500), data.logoUrl || null);
    request.input('logoPosition', mssql.NVarChar(20), data.logoPosition || 'top');
    request.input('schriftart', mssql.NVarChar(50), data.schriftart || 'Arial');
    request.input('schriftgroesse', mssql.Int, data.schriftgroesse || 14);
    request.input('status', mssql.NVarChar(20), 'Entwurf');
    request.input('selectedMitgliedIds', mssql.NVarChar(mssql.MAX), selectedIds);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Brief].[Brief] (
        VereinId, VorlageId, Titel, Betreff, Inhalt, LogoUrl,
        LogoPosition, Schriftart, Schriftgroesse, Status, SelectedMitgliedIds, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @vorlageId, @titel, @betreff, @inhalt, @logoUrl,
        @logoPosition, @schriftart, @schriftgroesse, @status, @selectedMitgliedIds, @created, @createdBy
      )
    `);

    return this.mapToBrief(result.recordset[0]);
  }

  // Update Brief
  async update(id: number, data: UpdateBriefDto, userId?: number): Promise<Brief | null> {
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
    if (data.betreff !== undefined) {
      request.input('betreff', mssql.NVarChar(200), data.betreff);
      updates.push('Betreff = @betreff');
    }
    if (data.inhalt !== undefined) {
      request.input('inhalt', mssql.NVarChar(mssql.MAX), data.inhalt);
      updates.push('Inhalt = @inhalt');
    }
    if (data.status !== undefined) {
      request.input('status', mssql.NVarChar(20), data.status);
      updates.push('Status = @status');
    }
    if (data.selectedMitgliedIds !== undefined) {
      const selectedIds = data.selectedMitgliedIds ? JSON.stringify(data.selectedMitgliedIds) : null;
      request.input('selectedMitgliedIds', mssql.NVarChar(mssql.MAX), selectedIds);
      updates.push('SelectedMitgliedIds = @selectedMitgliedIds');
    }

    await request.query(`
      UPDATE [Brief].[Brief]
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Map row to Brief
  private mapToBrief(row: any): Brief {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      vorlageId: row.VorlageId,
      titel: row.Titel,
      betreff: row.Betreff,
      inhalt: row.Inhalt,
      logoUrl: row.LogoUrl,
      logoPosition: row.LogoPosition || 'top',
      schriftart: row.Schriftart || 'Arial',
      schriftgroesse: row.Schriftgroesse || 14,
      status: row.Status || 'Entwurf',
      selectedMitgliedIds: row.SelectedMitgliedIds,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      vorlageName: row.VorlageName,
    };
  }
}

// Singleton instance
export const briefRepository = new BriefRepository();

