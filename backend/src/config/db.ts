import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Use reliable DNS resolvers for MongoDB SRV records (especially on Windows local networks)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if custom DNS cannot be set in restricted environments
}

dotenv.config();

export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoUri =
    process.env.MONGODB_URI ||
    'mongodb+srv://om:lcq2zJ75lL9zTzVc@idp.f56kscu.mongodb.net/dataquest?retryWrites=true&w=majority';
  const dbName = process.env.DB_NAME || 'dataquest';

  try {
    const conn = await mongoose.connect(mongoUri, {
      dbName: dbName
    });

    console.log(`[MongoDB] Connected successfully to Atlas Cluster: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error('[MongoDB] Disconnection error:', error);
  }
};

export default connectDB;
