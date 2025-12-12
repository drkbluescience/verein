import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import config from './config';
import { connectDatabase, disconnectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

// Create Express app
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.origins,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use(config.api.prefix, routes);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Verein API - Node.js',
    version: '1.0.0',
    docs: `${config.api.prefix}/docs`,
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Global error handler
app.use(errorHandler);

// Start server
async function startServer(): Promise<void> {
  try {
    console.log('🚀 Starting Verein API...');
    console.log('📍 Environment:', config.nodeEnv);
    console.log('🔗 CORS Origins:', config.cors.origins);

    // Connect to database
    await connectDatabase();

    // Start listening
    const server = app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    VEREIN API - Node.js                   ║
╠═══════════════════════════════════════════════════════════╣
║  🚀 Server running on port ${config.port.toString().padEnd(27)}  ║
║  📍 Environment: ${config.nodeEnv.padEnd(36)}  ║
║  🔗 API Prefix: ${config.api.prefix.padEnd(38)}  ║
║  📅 Started at: ${new Date().toISOString().padEnd(38)}  ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    // In production, don't exit - let Passenger handle restarts
    if (config.nodeEnv !== 'production') {
      process.exit(1);
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

// Start the server
startServer();

export default app;

