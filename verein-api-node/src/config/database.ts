import * as mssql from 'mssql';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// SQL Server config from environment
const mssqlConfig: mssql.config = {
  server: process.env.DB_SERVER || 'Verein08112025.database.windows.net',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_NAME || 'VereinDB',
  user: process.env.DB_USER || 'vereinsa',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Global connection pool
let pool: mssql.ConnectionPool | null = null;

// Get database connection pool
export async function getPool(): Promise<mssql.ConnectionPool> {
  if (!pool) {
    pool = await new mssql.ConnectionPool(mssqlConfig).connect();
  }
  return pool;
}

// Database connection test
export async function connectDatabase(): Promise<void> {
  try {
    console.log('🔄 Connecting to database...');
    console.log('   Server:', process.env.DB_SERVER);
    console.log('   Database:', process.env.DB_NAME);
    console.log('   User:', process.env.DB_USER);

    const dbPool = await getPool();
    const result = await dbPool.request().query('SELECT 1 as test');
    if (result.recordset[0].test === 1) {
      console.log('✅ Database connected successfully');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    // Don't exit in production - let the app continue and handle errors per-request
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database disconnected');
  }
}

// Helper function for queries
export async function query<T>(sql: string, params?: Record<string, unknown>): Promise<T[]> {
  const dbPool = await getPool();
  const request = dbPool.request();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
  }

  const result = await request.query(sql);
  return result.recordset as T[];
}

// Helper function for single result
export async function queryOne<T>(sql: string, params?: Record<string, unknown>): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}

// Helper function for execute (INSERT, UPDATE, DELETE)
export async function execute(sql: string, params?: Record<string, unknown>): Promise<number> {
  const dbPool = await getPool();
  const request = dbPool.request();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
  }

  const result = await request.query(sql);
  return result.rowsAffected[0] || 0;
}

export { mssql };

