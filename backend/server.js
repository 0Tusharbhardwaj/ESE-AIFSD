require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const https = require('https');
const http = require('http');

const PORT = process.env.PORT || 5000;

/**
 * Self-ping keep-alive for Render free tier.
 * Render spins down free instances after 15 min of inactivity.
 * This pings the health endpoint every 14 minutes to stay awake.
 */
const startKeepAlive = (serverUrl) => {
  if (process.env.NODE_ENV !== 'production') return; // Only in production

  const pingInterval = 14 * 60 * 1000; // 14 minutes

  setInterval(() => {
    const url = `${serverUrl}/api/health`;
    const client = url.startsWith('https') ? https : http;

    client
      .get(url, (res) => {
        console.log(`🏓 Keep-alive ping: ${res.statusCode} at ${new Date().toLocaleTimeString()}`);
      })
      .on('error', (err) => {
        console.warn(`⚠️  Keep-alive ping failed: ${err.message}`);
      });
  }, pingInterval);

  console.log(`🏓 Keep-alive started — pinging every 14 minutes`);
};

/**
 * Bootstrap the server:
 * 1. Connect to MongoDB
 * 2. Start Express HTTP server
 * 3. Start keep-alive pinger (production only)
 */
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`\n🚀 EmpAI Server running on port ${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log(`🩺 Health:   http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);

      // Start keep-alive pinger using RENDER_EXTERNAL_URL if available
      const serverUrl =
        process.env.RENDER_EXTERNAL_URL ||
        process.env.BACKEND_URL ||
        `http://localhost:${PORT}`;
      startKeepAlive(serverUrl);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Graceful shutdown on SIGTERM (Render uses this)
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
