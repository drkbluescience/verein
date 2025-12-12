/**
 * Nachricht Repository
 * Sent Messages operations
 */

import { getPool, mssql } from '../config/database';
import { Nachricht } from '../models';

export class NachrichtRepository {
  // Find by Mitglied ID (inbox)
  async findByMitgliedId(mitgliedId: number): Promise<Nachricht[]> {
    const pool = await getPool();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);

    const result = await request.query(`
      SELECT n.*, v.Name as VereinName
      FROM [Brief].[Nachricht] n
      LEFT JOIN [Verein].[Verein] v ON n.VereinId = v.Id
      WHERE n.MitgliedId = @mitgliedId AND n.DeletedFlag = 0
      ORDER BY n.GesendetDatum DESC
    `);

    return result.recordset.map(this.mapToNachricht);
  }

  // Find by Brief ID
  async findByBriefId(briefId: number): Promise<Nachricht[]> {
    const pool = await getPool();
    const request = pool.request();
    request.input('briefId', mssql.Int, briefId);

    const result = await request.query(`
      SELECT n.*, m.Vorname + ' ' + m.Nachname as MitgliedName
      FROM [Brief].[Nachricht] n
      LEFT JOIN [Mitglied].[Mitglied] m ON n.MitgliedId = m.Id
      WHERE n.BriefId = @briefId AND n.DeletedFlag = 0
      ORDER BY n.GesendetDatum DESC
    `);

    return result.recordset.map(this.mapToNachricht);
  }

  // Find by ID
  async findById(id: number): Promise<Nachricht | null> {
    const pool = await getPool();
    const request = pool.request();
    request.input('id', mssql.Int, id);

    const result = await request.query(`
      SELECT n.*, v.Name as VereinName, m.Vorname + ' ' + m.Nachname as MitgliedName
      FROM [Brief].[Nachricht] n
      LEFT JOIN [Verein].[Verein] v ON n.VereinId = v.Id
      LEFT JOIN [Mitglied].[Mitglied] m ON n.MitgliedId = m.Id
      WHERE n.Id = @id AND n.DeletedFlag = 0
    `);

    if (result.recordset.length === 0) return null;
    return this.mapToNachricht(result.recordset[0]);
  }

  // Get unread count for Mitglied
  async getUnreadCount(mitgliedId: number): Promise<number> {
    const pool = await getPool();
    const request = pool.request();
    request.input('mitgliedId', mssql.Int, mitgliedId);

    const result = await request.query(`
      SELECT COUNT(*) as Count
      FROM [Brief].[Nachricht]
      WHERE MitgliedId = @mitgliedId AND DeletedFlag = 0 AND IstGelesen = 0
    `);

    return result.recordset[0]?.Count || 0;
  }

  // Mark as read
  async markAsRead(id: number): Promise<boolean> {
    const pool = await getPool();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('gelesenDatum', mssql.DateTime, new Date());

    const result = await request.query(`
      UPDATE [Brief].[Nachricht]
      SET IstGelesen = 1, GelesenDatum = @gelesenDatum
      WHERE Id = @id AND DeletedFlag = 0
    `);

    return (result.rowsAffected[0] || 0) > 0;
  }

  // Create Nachricht (for sending letters)
  async create(data: {
    briefId: number;
    vereinId: number;
    mitgliedId: number;
    betreff: string;
    inhalt: string;
    logoUrl?: string;
  }): Promise<Nachricht> {
    const pool = await getPool();
    const request = pool.request();

    request.input('briefId', mssql.Int, data.briefId);
    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('mitgliedId', mssql.Int, data.mitgliedId);
    request.input('betreff', mssql.NVarChar(200), data.betreff);
    request.input('inhalt', mssql.NVarChar(mssql.MAX), data.inhalt);
    request.input('logoUrl', mssql.NVarChar(500), data.logoUrl || null);
    request.input('gesendetDatum', mssql.DateTime, new Date());

    const result = await request.query(`
      INSERT INTO [Brief].[Nachricht] (
        BriefId, VereinId, MitgliedId, Betreff, Inhalt, LogoUrl,
        IstGelesen, GesendetDatum, DeletedFlag
      )
      OUTPUT INSERTED.*
      VALUES (
        @briefId, @vereinId, @mitgliedId, @betreff, @inhalt, @logoUrl,
        0, @gesendetDatum, 0
      )
    `);

    return this.mapToNachricht(result.recordset[0]);
  }

  // Soft delete
  async softDelete(id: number): Promise<boolean> {
    const pool = await getPool();
    const request = pool.request();
    request.input('id', mssql.Int, id);

    const result = await request.query(`
      UPDATE [Brief].[Nachricht]
      SET DeletedFlag = 1
      WHERE Id = @id
    `);

    return (result.rowsAffected[0] || 0) > 0;
  }

  // Map row to Nachricht
  private mapToNachricht(row: any): Nachricht {
    return {
      id: row.Id,
      briefId: row.BriefId,
      vereinId: row.VereinId,
      mitgliedId: row.MitgliedId,
      betreff: row.Betreff,
      inhalt: row.Inhalt,
      logoUrl: row.LogoUrl,
      istGelesen: row.IstGelesen || false,
      gelesenDatum: row.GelesenDatum,
      gesendetDatum: row.GesendetDatum,
      deletedFlag: row.DeletedFlag || false,
      mitgliedName: row.MitgliedName,
      vereinName: row.VereinName,
    };
  }
}

// Singleton instance
export const nachrichtRepository = new NachrichtRepository();

