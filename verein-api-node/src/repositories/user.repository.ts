/**
 * User Repository
 * Handles User authentication and CRUD operations
 */

import { getPool, mssql } from '../config/database';
import { BaseRepository } from './base.repository';
import { User, UserRole, RegisterRequest } from '../models';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super({ schema: 'Web', table: 'User' });
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('email', mssql.NVarChar(100), email.toLowerCase());

    const result = await request.query(`
      SELECT * FROM [Web].[User]
      WHERE LOWER(Email) = @email AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);

    return result.recordset[0] || null;
  }

  // Find user with roles
  async findByIdWithRoles(id: number): Promise<User | null> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, id);

    const userResult = await request.query(`
      SELECT * FROM [Web].[User]
      WHERE Id = @id AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);

    if (!userResult.recordset[0]) return null;

    const user = userResult.recordset[0] as User;

    // Get roles
    const rolesResult = await request.query(`
      SELECT * FROM [Web].[UserRole]
      WHERE UserId = @id AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);

    user.userRoles = rolesResult.recordset as UserRole[];

    return user;
  }

  // Find user by email with roles
  async findByEmailWithRoles(email: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const pool = await this.getDb();
    const request = pool.request();
    request.input('userId', mssql.Int, user.id);

    const rolesResult = await request.query(`
      SELECT * FROM [Web].[UserRole]
      WHERE UserId = @userId AND (DeletedFlag IS NULL OR DeletedFlag = 0)
    `);

    user.userRoles = rolesResult.recordset as UserRole[];
    return user;
  }

  // Create new user
  async create(data: RegisterRequest, passwordHash: string): Promise<User> {
    const pool = await this.getDb();
    const request = pool.request();

    request.input('email', mssql.NVarChar(100), data.email.toLowerCase());
    request.input('passwordHash', mssql.NVarChar(255), passwordHash);
    request.input('vorname', mssql.NVarChar(100), data.vorname);
    request.input('nachname', mssql.NVarChar(100), data.nachname);
    request.input('isActive', mssql.Bit, true);
    request.input('emailConfirmed', mssql.Bit, false);
    request.input('failedLoginAttempts', mssql.Int, 0);
    request.input('created', mssql.DateTime, new Date());
    request.input('aktiv', mssql.Bit, true);

    const result = await request.query(`
      INSERT INTO [Web].[User] (
        Email, PasswordHash, Vorname, Nachname, IsActive, EmailConfirmed,
        FailedLoginAttempts, Created, Aktiv
      )
      OUTPUT INSERTED.*
      VALUES (
        @email, @passwordHash, @vorname, @nachname, @isActive, @emailConfirmed,
        @failedLoginAttempts, @created, @aktiv
      )
    `);

    return result.recordset[0];
  }

  // Update last login
  async updateLastLogin(userId: number): Promise<void> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, userId);
    request.input('lastLogin', mssql.DateTime, new Date());

    await request.query(`
      UPDATE [Web].[User]
      SET LastLogin = @lastLogin, FailedLoginAttempts = 0
      WHERE Id = @id
    `);
  }

  // Increment failed login attempts
  async incrementFailedAttempts(userId: number): Promise<number> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, userId);

    const result = await request.query(`
      UPDATE [Web].[User]
      SET FailedLoginAttempts = FailedLoginAttempts + 1
      OUTPUT INSERTED.FailedLoginAttempts
      WHERE Id = @id
    `);

    return result.recordset[0]?.FailedLoginAttempts || 0;
  }

  // Lock user account
  async lockAccount(userId: number, lockoutEnd: Date): Promise<void> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, userId);
    request.input('lockoutEnd', mssql.DateTime, lockoutEnd);

    await request.query(`
      UPDATE [Web].[User]
      SET LockoutEnd = @lockoutEnd
      WHERE Id = @id
    `);
  }

  // Update password
  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    const pool = await this.getDb();
    const request = pool.request();
    request.input('id', mssql.Int, userId);
    request.input('passwordHash', mssql.NVarChar(255), passwordHash);
    request.input('modified', mssql.DateTime, new Date());

    await request.query(`
      UPDATE [Web].[User]
      SET PasswordHash = @passwordHash, Modified = @modified
      WHERE Id = @id
    `);
  }
}

// Singleton instance
export const userRepository = new UserRepository();

