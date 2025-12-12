import { Request, Response } from 'express';
import { query } from '../config/database';
import { sendSuccess, sendServerError } from '../utils/response';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    latency?: number;
  };
}

// GET /api/health
export async function getHealth(_req: Request, res: Response): Promise<void> {
  const startTime = Date.now();

  try {
    // Test database connection
    await query('SELECT 1 as test');
    const dbLatency = Date.now() - startTime;

    const health: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      database: {
        status: 'connected',
        latency: dbLatency,
      },
    };

    sendSuccess(res, health, 'API is healthy');
  } catch (error) {
    const health: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      database: {
        status: 'disconnected',
      },
    };

    sendServerError(res, 'Database connection failed');
  }
}

// GET /api/health/ping
export function ping(_req: Request, res: Response): void {
  sendSuccess(res, { pong: true, timestamp: new Date().toISOString() }, 'pong');
}

