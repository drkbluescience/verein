/**
 * Authentication Service
 * Handles JWT tokens and password operations
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories';
import { User, LoginRequest, LoginResponse, RegisterRequest, UserDto, JwtPayload, ChangePasswordRequest } from '../models';
import config from '../config';

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = config.jwtExpiresIn || '24h';
const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

export class AuthService {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT token
  generateToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      vorname: user.vorname,
      nachname: user.nachname,
      roles: (user.userRoles || []).map(r => ({
        vereinId: r.vereinId,
        rolle: r.rolle,
      })),
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
  }

  // Verify JWT token
  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }

  // Login
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request;

    // Find user with roles
    const user = await userRepository.findByEmailWithRoles(email);
    if (!user) {
      throw new Error('Ungültige E-Mail oder Passwort');
    }

    // Check if account is locked
    if (user.lockoutEnd && new Date(user.lockoutEnd) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(user.lockoutEnd).getTime() - Date.now()) / 60000);
      throw new Error(`Konto gesperrt. Bitte versuchen Sie es in ${remainingMinutes} Minuten erneut.`);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Konto ist deaktiviert');
    }

    // Verify password
    if (!user.passwordHash) {
      throw new Error('Ungültige E-Mail oder Passwort');
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      // Increment failed attempts
      const attempts = await userRepository.incrementFailedAttempts(user.id);
      
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutEnd = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60000);
        await userRepository.lockAccount(user.id, lockoutEnd);
        throw new Error(`Zu viele fehlgeschlagene Versuche. Konto für ${LOCKOUT_DURATION_MINUTES} Minuten gesperrt.`);
      }
      
      throw new Error('Ungültige E-Mail oder Passwort');
    }

    // Update last login
    await userRepository.updateLastLogin(user.id);

    // Generate token
    const token = this.generateToken(user);

    return {
      token,
      expiresIn: this.getExpiresInSeconds(),
      user: this.toUserDto(user),
    };
  }

  // Register new user
  async register(request: RegisterRequest): Promise<UserDto> {
    const { email, password, vorname, nachname } = request;

    // Check if email exists
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error('E-Mail-Adresse wird bereits verwendet');
    }

    // Validate password
    if (password.length < 8) {
      throw new Error('Passwort muss mindestens 8 Zeichen lang sein');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await userRepository.create({ email, password, vorname, nachname }, passwordHash);

    return this.toUserDto(user);
  }

  // Change password
  async changePassword(userId: number, request: ChangePasswordRequest): Promise<void> {
    const { currentPassword, newPassword } = request;

    const user = await userRepository.findById(userId);
    if (!user || !user.passwordHash) {
      throw new Error('Benutzer nicht gefunden');
    }

    // Verify current password
    const isValid = await this.verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error('Aktuelles Passwort ist falsch');
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('Neues Passwort muss mindestens 8 Zeichen lang sein');
    }

    // Hash and update
    const passwordHash = await this.hashPassword(newPassword);
    await userRepository.updatePassword(userId, passwordHash);
  }

  // Get current user
  async getCurrentUser(userId: number): Promise<UserDto | null> {
    const user = await userRepository.findByIdWithRoles(userId);
    return user ? this.toUserDto(user) : null;
  }

  // Convert User to UserDto
  private toUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      vorname: user.vorname,
      nachname: user.nachname,
      isActive: user.isActive,
      emailConfirmed: user.emailConfirmed,
      lastLogin: user.lastLogin?.toISOString() || null,
      roles: (user.userRoles || []).map(r => ({ vereinId: r.vereinId, rolle: r.rolle })),
    };
  }

  // Get expires in seconds from config
  private getExpiresInSeconds(): number {
    const match = JWT_EXPIRES_IN.match(/^(\d+)([hmd])$/);
    if (!match) return 86400; // default 24h
    const [, num, unit] = match;
    const multipliers: Record<string, number> = { h: 3600, d: 86400, m: 60 };
    return parseInt(num) * (multipliers[unit] || 3600);
  }
}

// Singleton instance
export const authService = new AuthService();

