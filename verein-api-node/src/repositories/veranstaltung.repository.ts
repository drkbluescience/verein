/**
 * Veranstaltung Repository
 * Event operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { Veranstaltung, CreateVeranstaltungDto, UpdateVeranstaltungDto } from '../models';

export class VeranstaltungRepository extends BaseRepository<Veranstaltung> {
  constructor() {
    super({ schema: 'dbo', table: 'Veranstaltung' });
  }

  // Find by Verein ID
  async findByVereinId(vereinId: number): Promise<Veranstaltung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);

    const result = await request.query(`
      SELECT v.*, vr.Name as VereinName,
        (SELECT COUNT(*) FROM dbo.VeranstaltungAnmeldung va WHERE va.VeranstaltungId = v.Id AND va.Storniert = 0) as AnmeldungenCount
      FROM dbo.Veranstaltung v
      LEFT JOIN [Verein].[Verein] vr ON v.VereinId = vr.Id
      WHERE v.VereinId = @vereinId AND (v.DeletedFlag IS NULL OR v.DeletedFlag = 0)
      ORDER BY v.Beginn DESC
    `);

    return result.recordset.map(this.mapToVeranstaltung);
  }

  // Find upcoming events
  async findUpcoming(vereinId?: number): Promise<Veranstaltung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('now', mssql.DateTime, new Date());

    let whereClause = 'v.Beginn >= @now AND (v.DeletedFlag IS NULL OR v.DeletedFlag = 0)';
    if (vereinId) {
      request.input('vereinId', mssql.Int, vereinId);
      whereClause += ' AND v.VereinId = @vereinId';
    }

    const result = await request.query(`
      SELECT v.*, vr.Name as VereinName,
        (SELECT COUNT(*) FROM dbo.VeranstaltungAnmeldung va WHERE va.VeranstaltungId = v.Id AND va.Storniert = 0) as AnmeldungenCount
      FROM dbo.Veranstaltung v
      LEFT JOIN [Verein].[Verein] vr ON v.VereinId = vr.Id
      WHERE ${whereClause}
      ORDER BY v.Beginn ASC
    `);

    return result.recordset.map(this.mapToVeranstaltung);
  }

  // Find by date range
  async findByDateRange(startDate: Date, endDate: Date, vereinId?: number): Promise<Veranstaltung[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('startDate', mssql.DateTime, startDate);
    request.input('endDate', mssql.DateTime, endDate);

    let whereClause = 'v.Beginn >= @startDate AND v.Beginn <= @endDate AND (v.DeletedFlag IS NULL OR v.DeletedFlag = 0)';
    if (vereinId) {
      request.input('vereinId', mssql.Int, vereinId);
      whereClause += ' AND v.VereinId = @vereinId';
    }

    const result = await request.query(`
      SELECT v.*, vr.Name as VereinName,
        (SELECT COUNT(*) FROM dbo.VeranstaltungAnmeldung va WHERE va.VeranstaltungId = v.Id AND va.Storniert = 0) as AnmeldungenCount
      FROM dbo.Veranstaltung v
      LEFT JOIN [Verein].[Verein] vr ON v.VereinId = vr.Id
      WHERE ${whereClause}
      ORDER BY v.Beginn ASC
    `);

    return result.recordset.map(this.mapToVeranstaltung);
  }

  // Create Veranstaltung
  async create(data: CreateVeranstaltungDto, userId?: number): Promise<Veranstaltung> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('titel', mssql.NVarChar(200), data.titel);
    request.input('beschreibung', mssql.NVarChar(1000), data.beschreibung || null);
    request.input('beginn', mssql.DateTime, new Date(data.startdatum));
    request.input('ende', mssql.DateTime, data.enddatum ? new Date(data.enddatum) : null);
    request.input('preis', mssql.Decimal(18, 2), data.preis || null);
    request.input('waehrungId', mssql.Int, data.waehrungId || null);
    request.input('ort', mssql.NVarChar(250), data.ort || null);
    request.input('nurFuerMitglieder', mssql.Bit, data.nurFuerMitglieder || false);
    request.input('maxTeilnehmer', mssql.Int, data.maxTeilnehmer || null);
    request.input('anmeldeErforderlich', mssql.Bit, data.anmeldeErforderlich || false);
    request.input('istWiederholend', mssql.Bit, data.istWiederholend || false);
    request.input('wiederholungTyp', mssql.NVarChar(20), data.wiederholungTyp || null);
    request.input('wiederholungInterval', mssql.Int, data.wiederholungInterval || null);
    request.input('wiederholungEnde', mssql.Date, data.wiederholungEnde ? new Date(data.wiederholungEnde) : null);
    request.input('wiederholungTage', mssql.NVarChar(50), data.wiederholungTage || null);
    request.input('wiederholungMonatTag', mssql.Int, data.wiederholungMonatTag || null);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);

    const result = await request.query(`
      INSERT INTO dbo.Veranstaltung (
        VereinId, Titel, Beschreibung, Beginn, Ende, Preis, WaehrungId, Ort,
        NurFuerMitglieder, MaxTeilnehmer, AnmeldeErforderlich, IstWiederholend,
        WiederholungTyp, WiederholungInterval, WiederholungEnde, WiederholungTage, WiederholungMonatTag,
        Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @titel, @beschreibung, @beginn, @ende, @preis, @waehrungId, @ort,
        @nurFuerMitglieder, @maxTeilnehmer, @anmeldeErforderlich, @istWiederholend,
        @wiederholungTyp, @wiederholungInterval, @wiederholungEnde, @wiederholungTage, @wiederholungMonatTag,
        @created, @createdBy
      )
    `);

    return this.mapToVeranstaltung(result.recordset[0]);
  }

  // Update Veranstaltung
  async update(id: number, data: UpdateVeranstaltungDto, userId?: number): Promise<Veranstaltung | null> {
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
    if (data.beschreibung !== undefined) {
      request.input('beschreibung', mssql.NVarChar(1000), data.beschreibung);
      updates.push('Beschreibung = @beschreibung');
    }
    if (data.startdatum !== undefined) {
      request.input('beginn', mssql.DateTime, new Date(data.startdatum));
      updates.push('Beginn = @beginn');
    }
    if (data.enddatum !== undefined) {
      request.input('ende', mssql.DateTime, data.enddatum ? new Date(data.enddatum) : null);
      updates.push('Ende = @ende');
    }
    if (data.ort !== undefined) {
      request.input('ort', mssql.NVarChar(250), data.ort);
      updates.push('Ort = @ort');
    }

    await request.query(`
      UPDATE dbo.Veranstaltung
      SET ${updates.join(', ')}
      WHERE Id = @id
    `);

    return this.findById(id);
  }

  // Map row to Veranstaltung
  private mapToVeranstaltung(row: any): Veranstaltung {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      titel: row.Titel,
      beschreibung: row.Beschreibung,
      startdatum: row.Beginn,
      enddatum: row.Ende,
      preis: row.Preis,
      waehrungId: row.WaehrungId,
      ort: row.Ort,
      nurFuerMitglieder: row.NurFuerMitglieder || false,
      maxTeilnehmer: row.MaxTeilnehmer,
      anmeldeErforderlich: row.AnmeldeErforderlich || false,
      istWiederholend: row.IstWiederholend,
      wiederholungTyp: row.WiederholungTyp,
      wiederholungInterval: row.WiederholungInterval,
      wiederholungEnde: row.WiederholungEnde,
      wiederholungTage: row.WiederholungTage,
      wiederholungMonatTag: row.WiederholungMonatTag,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      vereinName: row.VereinName,
      anmeldungenCount: row.AnmeldungenCount,
    };
  }
}

export const veranstaltungRepository = new VeranstaltungRepository();

