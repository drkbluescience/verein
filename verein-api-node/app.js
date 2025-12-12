// cPanel Passenger Entry Point
// This file is required by cPanel's Passenger to start the Node.js application

// Load environment variables FIRST
require('dotenv').config();

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the application
try {
  require('./dist/index.js');
} catch (error) {
  console.error('Failed to start application:', error);
}

