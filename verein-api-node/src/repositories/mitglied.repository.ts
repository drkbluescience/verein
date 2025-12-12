/**
 * Mitglied Repository
 * Handles Member CRUD operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { Mitglied, CreateMitgliedDto, UpdateMitgliedDto, MitgliedFilterParams, MitgliedListResponse } from '../models';

export class MitgliedRepository extends BaseRepository<Mitglied> {
  constructor() {
    super({ schema: 'Mitglied', table: 'Mitglied' });
  }

  // Find members by Verein ID
  async findByVereinId(vereinId: number, activeOnly = true, sprache = 'de'): Promise<Mitglied[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);
    request.input('sprache', mssql.NVarChar, sprache);

    let query = `
      SELECT
        m.*,
        ms.Name as MitgliedStatusName,
        mt.Name as MitgliedTypName,
        g.Name as GeschlechtName
      FROM [Mitglied].[Mitglied] m
      LEFT JOIN [Keytable].[MitgliedStatusUebersetzung] ms ON m.MitgliedStatusId = ms.MitgliedStatusId AND ms.Sprache = @sprache
      LEFT JOIN [Keytable].[MitgliedTypUebersetzung] mt ON m.MitgliedTypId = mt.MitgliedTypId AND mt.Sprache = @sprache
      LEFT JOIN [Keytable].[GeschlechtUebersetzung] g ON m.GeschlechtId = g.GeschlechtId AND g.Sprache = @sprache
      WHERE m.VereinId = @vereinId AND (m.DeletedFlag IS NULL OR m.DeletedFlag = 0)
    `;

    if (activeOnly) {
      query += ' AND m.Aktiv = 1';
    }

    query += ' ORDER BY m.Nachname, m.Vorname';

    const result = await request.query(query);
    return result.recordset.map(this.mapToMitglied);
  }

  // Search members by name
  async searchByName(searchTerm: string, vereinId?: number, sprache = 'de'): Promise<Mitglied[]> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('search', mssql.NVarChar, `%${searchTerm}%`);
    request.input('sprache', mssql.NVarChar, sprache);

    let whereClause = `(m.DeletedFlag IS NULL OR m.DeletedFlag = 0)
      AND (m.Vorname LIKE @search OR m.Nachname LIKE @search OR m.Email LIKE @search OR m.Mitgliedsnummer LIKE @search)`;

    if (vereinId) {
      request.input('vereinId', mssql.Int, vereinId);
      whereClause += ' AND m.VereinId = @vereinId';
    }

    const result = await request.query(`
      SELECT
        m.*,
        ms.Name as MitgliedStatusName,
        mt.Name as MitgliedTypName,
        g.Name as GeschlechtName
      FROM [Mitglied].[Mitglied] m
      LEFT JOIN [Keytable].[MitgliedStatusUebersetzung] ms ON m.MitgliedStatusId = ms.MitgliedStatusId AND ms.Sprache = @sprache
      LEFT JOIN [Keytable].[MitgliedTypUebersetzung] mt ON m.MitgliedTypId = mt.MitgliedTypId AND mt.Sprache = @sprache
      LEFT JOIN [Keytable].[GeschlechtUebersetzung] g ON m.GeschlechtId = g.GeschlechtId AND g.Sprache = @sprache
      WHERE ${whereClause}
      ORDER BY m.Nachname, m.Vorname
    `);

    return result.recordset.map(this.mapToMitglied);
  }

  // Update member
  async update(id: number, data: UpdateMitgliedDto, userId?: number): Promise<Mitglied | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modified', mssql.DateTime, new Date());
    request.input('modifiedBy', mssql.Int, userId || null);

    const updates: string[] = ['Modified = @modified', 'ModifiedBy = @modifiedBy'];

    const fields: Array<{ key: keyof UpdateMitgliedDto; col: string; type: any; maxLen?: number }> = [
      { key: 'mitgliedStatusId', col: 'MitgliedStatusId', type: mssql.Int },
      { key: 'mitgliedTypId', col: 'MitgliedTypId', type: mssql.Int },
      { key: 'vorname', col: 'Vorname', type: mssql.NVarChar, maxLen: 100 },
      { key: 'nachname', col: 'Nachname', type: mssql.NVarChar, maxLen: 100 },
      { key: 'geschlechtId', col: 'GeschlechtId', type: mssql.Int },
      { key: 'geburtsdatum', col: 'Geburtsdatum', type: mssql.Date },
      { key: 'email', col: 'Email', type: mssql.NVarChar, maxLen: 100 },
      { key: 'telefon', col: 'Telefon', type: mssql.NVarChar, maxLen: 30 },
      { key: 'eintrittsdatum', col: 'Eintrittsdatum', type: mssql.Date },
      { key: 'austrittsdatum', col: 'Austrittsdatum', type: mssql.Date },
      { key: 'aktiv', col: 'Aktiv', type: mssql.Bit },
    ];

    for (const f of fields) {
      if (data[f.key] !== undefined) {
        const sqlType = f.maxLen ? f.type(f.maxLen) : f.type;
        const value = f.type === mssql.Date && data[f.key] ? new Date(data[f.key] as string) : data[f.key];
        request.input(f.key, sqlType, value);
        updates.push(`${f.col} = @${f.key}`);
      }
    }

    await request.query(`
      UPDATE [Mitglied].[Mitglied]
      SET ${updates.join(', ')}
      WHERE Id = @id AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);

    return this.findById(id);
  }

  // Find members with filters and pagination
  async findFiltered(params: MitgliedFilterParams, sprache = 'de'): Promise<MitgliedListResponse> {
    const pool = await this.getDb();
    const { vereinId, mitgliedStatusId, mitgliedTypId, search, page = 1, pageSize = 10, sortBy = 'Nachname', sortOrder = 'asc' } = params;

    const request = pool.request();
    const conditions: string[] = ['(m.DeletedFlag IS NULL OR m.DeletedFlag = 0)'];

    if (vereinId) {
      conditions.push('m.VereinId = @vereinId');
      request.input('vereinId', mssql.Int, vereinId);
    }
    if (mitgliedStatusId) {
      conditions.push('m.MitgliedStatusId = @mitgliedStatusId');
      request.input('mitgliedStatusId', mssql.Int, mitgliedStatusId);
    }
    if (mitgliedTypId) {
      conditions.push('m.MitgliedTypId = @mitgliedTypId');
      request.input('mitgliedTypId', mssql.Int, mitgliedTypId);
    }
    if (search) {
      conditions.push('(m.Vorname LIKE @search OR m.Nachname LIKE @search OR m.Mitgliedsnummer LIKE @search OR m.Email LIKE @search)');
      request.input('search', mssql.NVarChar, `%${search}%`);
    }

    request.input('sprache', mssql.NVarChar, sprache);

    const whereClause = conditions.join(' AND ');
    const offset = (page - 1) * pageSize;

    // Count query
    const countResult = await request.query(`SELECT COUNT(*) as total FROM [Mitglied].[Mitglied] m WHERE ${whereClause}`);
    const totalCount = countResult.recordset[0].total;

    // Data query with translations
    const validSortBy = this.sanitizeColumnName(sortBy);
    const validSortOrder = sortOrder === 'desc' ? 'DESC' : 'ASC';

    request.input('offset', mssql.Int, offset);
    request.input('pageSize', mssql.Int, pageSize);

    const dataResult = await request.query(`
      SELECT 
        m.*,
        ms.Name as MitgliedStatusName,
        mt.Name as MitgliedTypName,
        g.Name as GeschlechtName
      FROM [Mitglied].[Mitglied] m
      LEFT JOIN [Keytable].[MitgliedStatusUebersetzung] ms ON m.MitgliedStatusId = ms.MitgliedStatusId AND ms.Sprache = @sprache
      LEFT JOIN [Keytable].[MitgliedTypUebersetzung] mt ON m.MitgliedTypId = mt.MitgliedTypId AND mt.Sprache = @sprache
      LEFT JOIN [Keytable].[GeschlechtUebersetzung] g ON m.GeschlechtId = g.GeschlechtId AND g.Sprache = @sprache
      WHERE ${whereClause}
      ORDER BY m.${validSortBy} ${validSortOrder}
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `);

    return {
      items: dataResult.recordset.map(this.mapToMitglied),
      totalCount,
      page,
      pageSize,
    };
  }

  // Find by ID with translations
  async findByIdWithTranslations(id: number, sprache = 'de'): Promise<Mitglied | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('sprache', mssql.NVarChar, sprache);

    const result = await request.query(`
      SELECT 
        m.*,
        ms.Name as MitgliedStatusName,
        mt.Name as MitgliedTypName,
        g.Name as GeschlechtName
      FROM [Mitglied].[Mitglied] m
      LEFT JOIN [Keytable].[MitgliedStatusUebersetzung] ms ON m.MitgliedStatusId = ms.MitgliedStatusId AND ms.Sprache = @sprache
      LEFT JOIN [Keytable].[MitgliedTypUebersetzung] mt ON m.MitgliedTypId = mt.MitgliedTypId AND mt.Sprache = @sprache
      LEFT JOIN [Keytable].[GeschlechtUebersetzung] g ON m.GeschlechtId = g.GeschlechtId AND g.Sprache = @sprache
      WHERE m.Id = @id AND (m.DeletedFlag IS NULL OR m.DeletedFlag = 0)
    `);

    return result.recordset[0] ? this.mapToMitglied(result.recordset[0]) : null;
  }

  // Create new Mitglied
  async create(data: CreateMitgliedDto, userId?: number): Promise<Mitglied> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('vereinId', mssql.Int, data.vereinId);
    request.input('mitgliedsnummer', mssql.NVarChar(30), data.mitgliedsnummer);
    request.input('mitgliedStatusId', mssql.Int, data.mitgliedStatusId);
    request.input('mitgliedTypId', mssql.Int, data.mitgliedTypId);
    request.input('vorname', mssql.NVarChar(100), data.vorname);
    request.input('nachname', mssql.NVarChar(100), data.nachname);
    request.input('geschlechtId', mssql.Int, data.geschlechtId || null);
    request.input('geburtsdatum', mssql.Date, data.geburtsdatum ? new Date(data.geburtsdatum) : null);
    request.input('email', mssql.NVarChar(100), data.email || null);
    request.input('telefon', mssql.NVarChar(30), data.telefon || null);
    request.input('eintrittsdatum', mssql.Date, data.eintrittsdatum ? new Date(data.eintrittsdatum) : null);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.Int, userId || null);
    request.input('aktiv', mssql.Bit, true);

    const result = await request.query(`
      INSERT INTO [Mitglied].[Mitglied] (
        VereinId, Mitgliedsnummer, MitgliedStatusId, MitgliedTypId, Vorname, Nachname,
        GeschlechtId, Geburtsdatum, Email, Telefon, Eintrittsdatum, Created, CreatedBy, Aktiv
      )
      OUTPUT INSERTED.*
      VALUES (
        @vereinId, @mitgliedsnummer, @mitgliedStatusId, @mitgliedTypId, @vorname, @nachname,
        @geschlechtId, @geburtsdatum, @email, @telefon, @eintrittsdatum, @created, @createdBy, @aktiv
      )
    `);

    return this.mapToMitglied(result.recordset[0]);
  }

  // Map database row to Mitglied model
  private mapToMitglied(row: any): Mitglied {
    return {
      id: row.Id,
      vereinId: row.VereinId,
      mitgliedsnummer: row.Mitgliedsnummer,
      mitgliedStatusId: row.MitgliedStatusId,
      mitgliedTypId: row.MitgliedTypId,
      vorname: row.Vorname,
      nachname: row.Nachname,
      geschlechtId: row.GeschlechtId,
      geburtsdatum: row.Geburtsdatum,
      geburtsort: row.Geburtsort,
      staatsangehoerigkeitId: row.StaatsangehoerigkeitId,
      email: row.Email,
      telefon: row.Telefon,
      mobiltelefon: row.Mobiltelefon,
      eintrittsdatum: row.Eintrittsdatum,
      austrittsdatum: row.Austrittsdatum,
      bemerkung: row.Bemerkung,
      beitragBetrag: row.BeitragBetrag,
      created: row.Created,
      createdBy: row.CreatedBy,
      modified: row.Modified,
      modifiedBy: row.ModifiedBy,
      deletedFlag: row.DeletedFlag,
      aktiv: row.Aktiv,
      mitgliedStatusName: row.MitgliedStatusName,
      mitgliedTypName: row.MitgliedTypName,
      geschlechtName: row.GeschlechtName,
    };
  }

  // Set active status
  async setActiveStatus(id: number, isActive: boolean, userId?: number): Promise<Mitglied | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('aktiv', mssql.Bit, isActive);
    request.input('modifiedBy', mssql.Int, userId || null);

    await request.query(`
      UPDATE [Mitglied].[Mitglied]
      SET Aktiv = @aktiv, Modified = GETUTCDATE(), ModifiedBy = @modifiedBy
      WHERE Id = @id AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);

    return this.findById(id);
  }

  // Get membership statistics for a Verein
  async getMembershipStatistics(vereinId: number): Promise<{
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newMembersThisYear: number;
    byStatus: { status: string; count: number }[];
    byType: { type: string; count: number }[];
    byGender: { gender: string; count: number }[];
  }> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('vereinId', mssql.Int, vereinId);
    request.input('yearStart', mssql.DateTime, new Date(new Date().getFullYear(), 0, 1));

    // Total and active counts
    const countResult = await request.query(`
      SELECT
        COUNT(*) as totalMembers,
        SUM(CASE WHEN Aktiv = 1 THEN 1 ELSE 0 END) as activeMembers,
        SUM(CASE WHEN Aktiv = 0 OR Aktiv IS NULL THEN 1 ELSE 0 END) as inactiveMembers,
        SUM(CASE WHEN Eintrittsdatum >= @yearStart THEN 1 ELSE 0 END) as newMembersThisYear
      FROM [Mitglied].[Mitglied]
      WHERE VereinId = @vereinId AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);

    // By status
    const statusRequest = pool.request();
    statusRequest.input('vereinId', mssql.Int, vereinId);
    statusRequest.input('sprache', mssql.NVarChar, 'de');
    const statusResult = await statusRequest.query(`
      SELECT u.Name as status, COUNT(*) as count
      FROM [Mitglied].[Mitglied] m
      LEFT JOIN [Keytable].[MitgliedStatusUebersetzung] u ON u.MitgliedStatusId = m.MitgliedStatusId AND u.Sprache = @sprache
      WHERE m.VereinId = @vereinId AND (m.DeletedFlag IS NULL OR m.DeletedFlag = 0)
      GROUP BY u.Name
    `);

    // By type
    const typeRequest = pool.request();
    typeRequest.input('vereinId', mssql.Int, vereinId);
    typeRequest.input('sprache', mssql.NVarChar, 'de');
    const typeResult = await typeRequest.query(`
      SELECT u.Name as type, COUNT(*) as count
      FROM [Mitglied].[Mitglied] m
      LEFT JOIN [Keytable].[MitgliedTypUebersetzung] u ON u.MitgliedTypId = m.MitgliedTypId AND u.Sprache = @sprache
      WHERE m.VereinId = @vereinId AND (m.DeletedFlag IS NULL OR m.DeletedFlag = 0)
      GROUP BY u.Name
    `);

    // By gender
    const genderRequest = pool.request();
    genderRequest.input('vereinId', mssql.Int, vereinId);
    genderRequest.input('sprache', mssql.NVarChar, 'de');
    const genderResult = await genderRequest.query(`
      SELECT u.Name as gender, COUNT(*) as count
      FROM [Mitglied].[Mitglied] m
      LEFT JOIN [Keytable].[GeschlechtUebersetzung] u ON u.GeschlechtId = m.GeschlechtId AND u.Sprache = @sprache
      WHERE m.VereinId = @vereinId AND (m.DeletedFlag IS NULL OR m.DeletedFlag = 0)
      GROUP BY u.Name
    `);

    const counts = countResult.recordset[0];
    return {
      totalMembers: counts.totalMembers || 0,
      activeMembers: counts.activeMembers || 0,
      inactiveMembers: counts.inactiveMembers || 0,
      newMembersThisYear: counts.newMembersThisYear || 0,
      byStatus: statusResult.recordset.map(r => ({ status: r.status || 'Unbekannt', count: r.count })),
      byType: typeResult.recordset.map(r => ({ type: r.type || 'Unbekannt', count: r.count })),
      byGender: genderResult.recordset.map(r => ({ gender: r.gender || 'Unbekannt', count: r.count })),
    };
  }
}

// Singleton instance
export const mitgliedRepository = new MitgliedRepository();

