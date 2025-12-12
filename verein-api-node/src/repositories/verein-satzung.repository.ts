/**
 * VereinSatzung Repository
 * Association Statutes/Bylaws operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { VereinSatzung, UpdateVereinSatzungDto } from '../models/verein.model';

export class VereinSatzungRepository extends BaseRepository<VereinSatzung> {
  constructor() {
    super({ schema: 'Verein', table: 'VereinSatzung' });
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number): Promise<VereinSatzung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    const result = await request.query(`
      SELECT * FROM [Verein].[VereinSatzung]
      WHERE VereinId = @vereinId AND (DeletedFlag IS NULL OR DeletedFlag = 0)
      ORDER BY SatzungVom DESC
    `);

    return result.recordset.map(this.mapToSatzung);
  }

  // Find active Satzung by Verein ID
  async findActiveByVereinId(vereinId: number): Promise<VereinSatzung | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    const result = await request.query(`
      SELECT * FROM [Verein].[VereinSatzung]
      WHERE VereinId = @vereinId 
        AND (DeletedFlag IS NULL OR DeletedFlag = 0)
        AND Aktiv = 1
    `);

    if (result.recordset.length === 0) return null;
    return this.mapToSatzung(result.recordset[0]);
  }

  // Create Satzung (file upload handled separately)
  async create(data: {
    vereinId: number;
    dosyaPfad: string;
    dosyaAdi: string;
    dosyaBoyutu: number;
    satzungVom: string;
    bemerkung?: string;
    setAsActive?: boolean;
  }, userId?: number): Promise<VereinSatzung> {
    const pool = await this.getDb();

    // If setAsActive, deactivate other satzungen first
    if (data.setAsActive !== false) {
      const deactivateRequest = pool.request();
      deactivateRequest.input('vereinId', mssql.Int, data.vereinId);
      await deactivateRequest.query(`
        UPDATE [Verein].[VereinSatzung]
        SET Aktiv = 0
        WHERE VereinId = @vereinId
      `);
    }

    const request = pool.request();
    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('dosyaPfad', mssql.NVarChar(500), data.dosyaPfad);
    request.input('dosyaAdi', mssql.NVarChar(200), data.dosyaAdi);
    request.input('dosyaBoyutu', mssql.BigInt, data.dosyaBoyutu);
    request.input('satzungVom', mssql.Date, new Date(data.satzungVom));
    request.input('aktiv', mssql.Bit, data.setAsActive !== false);
    request.input('bemerkung', mssql.NVarChar(500), data.bemerkung || null);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO [Verein].[VereinSatzung] (
        VereinId, DosyaPfad, DosyaAdi, DosyaBoyutu, SatzungVom, Aktiv, Bemerkung, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @dosyaPfad, @dosyaAdi, @dosyaBoyutu, @satzungVom, @aktiv, @bemerkung, @created, @createdBy
      )
    `);

    return this.mapToSatzung(result.recordset[0]);
  }

  // Update Satzung
  async update(id: number, data: UpdateVereinSatzungDto, userId?: number): Promise<VereinSatzung | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];

    if (data.satzungVom !== undefined) {
      request.input('satzungVom', mssql.Date, new Date(data.satzungVom));
      updates.push('SatzungVom = @satzungVom');
    }
    if (data.bemerkung !== undefined) {
      request.input('bemerkung', mssql.NVarChar(500), data.bemerkung);
      updates.push('Bemerkung = @bemerkung');
    }
    if (data.aktiv !== undefined) {
      request.input('aktiv', mssql.Bit, data.aktiv);
      updates.push('Aktiv = @aktiv');
    }

    await request.query(`
      UPDATE [Verein].[VereinSatzung]
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Set as active (deactivate others)
  async setActive(id: number): Promise<boolean> {
    const satzung = await this.findById(id);
    if (!satzung) return false;

    const pool = await this.getDb();

    // Deactivate all others for this verein
    const deactivateRequest = pool.request();
    deactivateRequest.input('vereinId', mssql.Int, satzung.vereinId);
    await deactivateRequest.query(`
      UPDATE [Verein].[VereinSatzung]
      SET Aktiv = 0
      WHERE VereinId = @vereinId
    `);

    // Activate this one
    const activateRequest = pool.request();
    activateRequest.input('id', mssql.Int, id);
    await activateRequest.query(`
      UPDATE [Verein].[VereinSatzung]
      SET Aktiv = 1
      WHERE Id = @id
    `);

    return true;
  }

  // Map row to VereinSatzung
  private mapToSatzung(row: any): VereinSatzung {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      dosyaPfad: row.DosyaPfad,
      satzungVom: row.SatzungVom,
      aktiv: row.Aktiv || false,
      bemerkung: row.Bemerkung,
      dosyaAdi: row.DosyaAdi,
      dosyaBoyutu: row.DosyaBoyutu,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
    };
  }
}

export const vereinSatzungRepository = new VereinSatzungRepository();

