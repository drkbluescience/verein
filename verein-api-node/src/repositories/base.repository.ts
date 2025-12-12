/**
 * Base Repository
 * Provides common CRUD operations for all entities
 */

import { getPool, mssql } from '../config/database';
import { AuditableEntity, PaginatedResponse, PaginationRequest } from '../models';

export interface BaseRepositoryOptions {
  schema: string;
  table: string;
  primaryKey?: string;
}

export class BaseRepository<T extends AuditableEntity> {
  protected schema: string;
  protected table: string;
  protected primaryKey: string;
  protected fullTableName: string;

  constructor(options: BaseRepositoryOptions) {
    this.schema = options.schema;
    this.table = options.table;
    this.primaryKey = options.primaryKey || 'Id';
    this.fullTableName = `[${this.schema}].[${this.table}]`;
  }

  // Get database pool
  protected async getDb() {
    return getPool();
  }

  // Find all (with soft delete filter)
  async findAll(includeDeleted = false): Promise<T[]> {
    const pool = await this.getDb();
    const whereClause = includeDeleted ? '' : 'WHERE (DeletedFlag IS NULL OR DeletedFlag = 0)';
    const result = await pool.request().query(`SELECT * FROM ${this.fullTableName} ${whereClause}`);
    return result.recordset;
  }

  // Find by ID
  async findById(id: number, includeDeleted = false): Promise<T | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    
    let query = `SELECT * FROM ${this.fullTableName} WHERE ${this.primaryKey} = @id`;
    if (!includeDeleted) {
      query += ' AND (DeletedFlag IS NULL OR DeletedFlag = 0)';
    }
    
    const result = await request.query(query);
    return result.recordset[0] || null;
  }

  // Find with pagination
  async findPaginated(params: PaginationRequest, whereClause = '', whereParams: Record<string, unknown> = {}): Promise<PaginatedResponse<T>> {
    const pool = await this.getDb();
    const { page = 1, pageSize = 10, sortBy = this.primaryKey, sortOrder = 'asc' } = params;
    const offset = (page - 1) * pageSize;

    // Build base where clause
    let baseWhere = '(DeletedFlag IS NULL OR DeletedFlag = 0)';
    if (whereClause) {
      baseWhere += ` AND ${whereClause}`;
    }

    // Count query
    const countRequest = pool.request();
    for (const [key, value] of Object.entries(whereParams)) {
      countRequest.input(key, value);
    }
    const countResult = await countRequest.query(`SELECT COUNT(*) as total FROM ${this.fullTableName} WHERE ${baseWhere}`);
    const totalCount = countResult.recordset[0].total;

    // Data query
    const dataRequest = pool.request();
    dataRequest.input('offset', mssql.Int, offset);
    dataRequest.input('pageSize', mssql.Int, pageSize);
    for (const [key, value] of Object.entries(whereParams)) {
      dataRequest.input(key, value);
    }

    const validSortBy = this.sanitizeColumnName(sortBy);
    const validSortOrder = sortOrder === 'desc' ? 'DESC' : 'ASC';

    const dataQuery = `
      SELECT * FROM ${this.fullTableName}
      WHERE ${baseWhere}
      ORDER BY ${validSortBy} ${validSortOrder}
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;
    const dataResult = await dataRequest.query(dataQuery);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items: dataResult.recordset,
      totalCount,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  // Soft delete
  async softDelete(id: number, userId?: number): Promise<boolean> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);
    request.input('modifiedBy', mssql.Int, userId || null);
    request.input('modified', mssql.DateTime, new Date());

    const result = await request.query(`
      UPDATE ${this.fullTableName}
      SET DeletedFlag = 1, Modified = @modified, ModifiedBy = @modifiedBy
      WHERE ${this.primaryKey} = @id
    `);
    return (result.rowsAffected[0] || 0) > 0;
  }

  // Sanitize column name to prevent SQL injection
  protected sanitizeColumnName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, '');
  }
}

