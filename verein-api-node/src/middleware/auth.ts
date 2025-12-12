import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthenticatedRequest, JwtPayload } from '../types';
import { UnauthorizedError, ForbiddenError } from './errorHandler';

// Verify JWT Token Middleware
export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Keine Autorisierung angegeben');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Ungültiges Autorisierungsformat');
    }

    const token = parts[1];

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Ungültiger Token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token abgelaufen'));
    } else {
      next(error);
    }
  }
}

// Optional authentication (doesn't fail if no token)
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = decoded;

    next();
  } catch {
    // Ignore errors, just continue without user
    next();
  }
}

// Require specific roles
export function requireRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentifizierung erforderlich'));
    }

    const userRoles = req.user.roles || [];
    const hasRole = roles.some((role) =>
      userRoles.some((ur) => ur.rolle === role)
    );

    if (!hasRole) {
      return next(new ForbiddenError('Unzureichende Berechtigungen'));
    }

    next();
  };
}

// Require role for specific Verein
export function requireVereinRole(vereinIdParam: string, ...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentifizierung erforderlich'));
    }

    const vereinId = parseInt(req.params[vereinIdParam], 10);
    if (!vereinId) {
      return next();
    }

    const userRoles = req.user.roles || [];
    const hasRole = roles.some((role) =>
      userRoles.some((ur) => ur.vereinId === vereinId && ur.rolle === role)
    );

    if (!hasRole) {
      return next(new ForbiddenError('Kein Zugriff auf diesen Verein'));
    }

    next();
  };
}

// Check if user has access to Verein (any role)
export function requireVereinAccess(vereinIdParam: string) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentifizierung erforderlich'));
    }

    const vereinId = parseInt(req.params[vereinIdParam], 10);
    if (!vereinId) {
      return next();
    }

    const userRoles = req.user.roles || [];
    const hasAccess = userRoles.some((ur) => ur.vereinId === vereinId);

    if (!hasAccess) {
      return next(new ForbiddenError('Kein Zugriff auf diesen Verein'));
    }

    next();
  };
}

