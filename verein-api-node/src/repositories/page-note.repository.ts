/**
 * PageNote Repository
 * User notes on pages for development feedback
 */

import { getPool, mssql } from '../config/database';
import { PageNote, CreatePageNoteDto, UpdatePageNoteDto, PageNoteStatistics } from '../models/page-note.model';

export class PageNoteRepository {
  // Find all
  async findAll(): Promise<PageNote[]> {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT * FROM [Web].[PageNote]
      WHERE Aktiv = 1
      ORDER BY Created DESC
    `);
    return result.recordset.map(this.mapToPageNote);
  }

  // Find by ID
  async findById(id: number): Promise<PageNote | null> {
    const pool = await getPool();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    const result = await request.query(`SELECT * FROM [Web].[PageNote] WHERE Id = @id`);
    return result.recordset.length > 0 ? this.mapToPageNote(result.recordset[0]) : null;
  }

  // Find by user email
  async findByUserEmail(userEmail: string): Promise<PageNote[]> {
    const pool = await getPool();
    const request = pool.request();
    request.input('userEmail', mssql.NVarChar(256), userEmail);
    const result = await request.query(`
      SELECT * FROM [Web].[PageNote]
      WHERE UserEmail = @userEmail AND Aktiv = 1
      ORDER BY Created DESC
    `);
    return result.recordset.map(this.mapToPageNote);
  }

  // Find by page URL
  async findByPageUrl(pageUrl: string): Promise<PageNote[]> {
    const pool = await getPool();
    const request = pool.request();
    request.input('pageUrl', mssql.NVarChar(500), pageUrl);
    const result = await request.query(`
      SELECT * FROM [Web].[PageNote]
      WHERE PageUrl = @pageUrl AND Aktiv = 1
      ORDER BY Created DESC
    `);
    return result.recordset.map(this.mapToPageNote);
  }

  // Find by entity
  async findByEntity(entityType: string, entityId: number): Promise<PageNote[]> {
    const pool = await getPool();
    const request = pool.request();
    request.input('entityType', mssql.NVarChar(50), entityType);
    request.input('entityId', mssql.Int, entityId);
    const result = await request.query(`
      SELECT * FROM [Web].[PageNote]
      WHERE EntityType = @entityType AND EntityId = @entityId AND Aktiv = 1
      ORDER BY Created DESC
    `);
    return result.recordset.map(this.mapToPageNote);
  }

  // Find by status
  async findByStatus(status: string): Promise<PageNote[]> {
    const pool = await getPool();
    const request = pool.request();
    request.input('status', mssql.NVarChar(20), status);
    const result = await request.query(`
      SELECT * FROM [Web].[PageNote]
      WHERE Status = @status AND Aktiv = 1
      ORDER BY Created DESC
    `);
    return result.recordset.map(this.mapToPageNote);
  }

  // Create
  async create(data: CreatePageNoteDto, userEmail: string, userName?: string): Promise<PageNote> {
    const pool = await getPool();
    const request = pool.request();
    request.input('pageUrl', mssql.NVarChar(500), data.pageUrl);
    request.input('pageTitle', mssql.NVarChar(200), data.pageTitle || null);
    request.input('entityType', mssql.NVarChar(50), data.entityType || null);
    request.input('entityId', mssql.Int, data.entityId || null);
    request.input('title', mssql.NVarChar(200), data.title);
    request.input('content', mssql.NVarChar(mssql.MAX), data.content);
    request.input('category', mssql.NVarChar(20), data.category || 'General');
    request.input('priority', mssql.NVarChar(20), data.priority || 'Medium');
    request.input('userEmail', mssql.NVarChar(256), userEmail);
    request.input('userName', mssql.NVarChar(200), userName || null);
    request.input('created', mssql.DateTime, new Date());
    request.input('createdBy', mssql.NVarChar(256), userEmail);

    const result = await request.query(`
      INSERT INTO [Web].[PageNote] (
        PageUrl, PageTitle, EntityType, EntityId, Title, Content,
        Category, Priority, UserEmail, UserName, Status, Aktiv, Created, CreatedBy
      )
      OUTPUT INSERTED.*
      VALUES (
        @pageUrl, @pageTitle, @entityType, @entityId, @title, @content,
        @category, @priority, @userEmail, @userName, 'Pending', 1, @created, @createdBy
      )
    `);
    return this.mapToPageNote(result.recordset[0]);
  }

  // Get statistics
  async getStatistics(): Promise<PageNoteStatistics> {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        COUNT(*) as TotalNotes,
        SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) as PendingCount,
        SUM(CASE WHEN Status = 'InProgress' THEN 1 ELSE 0 END) as InProgressCount,
        SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) as CompletedCount,
        SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) as RejectedCount
      FROM [Web].[PageNote] WHERE Aktiv = 1
    `);
    const row = result.recordset[0];
    return {
      totalNotes: row.TotalNotes,
      pendingCount: row.PendingCount,
      inProgressCount: row.InProgressCount,
      completedCount: row.CompletedCount,
      rejectedCount: row.RejectedCount,
      byCategory: {},
      byPriority: {},
    };
  }

  // Map row to PageNote
  private mapToPageNote(row: any): PageNote {
    return {
      id: row.Id, pageUrl: row.PageUrl, pageTitle: row.PageTitle,
      entityType: row.EntityType, entityId: row.EntityId,
      title: row.Title, content: row.Content, category: row.Category,
      priority: row.Priority, userEmail: row.UserEmail, userName: row.UserName,
      status: row.Status, completedBy: row.CompletedBy, completedAt: row.CompletedAt,
      adminNotes: row.AdminNotes, aktiv: row.Aktiv, created: row.Created,
      createdBy: row.CreatedBy, modified: row.Modified, modifiedBy: row.ModifiedBy,
    };
  }
}

export const pageNoteRepository = new PageNoteRepository();

