import dotenv from 'dotenv';
dotenv.config();

import { connectDB, disconnectDB } from './config/db';
import { createApp } from './app';

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // 1. Connect to Database (MongoDB Atlas)
    await connectDB();

    // 2. Initialize Express Application
    const app = createApp();

    // 3. Start Listening
    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 ALIGNX API Server running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`===============================================`);
    });

    // Graceful Shutdown
    const handleShutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        console.log('[Server] HTTP server closed.');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    return { app, server };
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

// Start if executed directly
if (require.main === module || !process.env.TEST_MODE) {
  startServer();
}

export default startServer;
