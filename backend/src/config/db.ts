import dns from 'dns';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Fall back to system DNS if custom cannot be set
}

dotenv.config();

let memServerInstance: MongoMemoryServer | null = null;

// Helper to auto-seed careers if empty
async function autoSeedCareersIfEmpty() {
  try {
    const Career = mongoose.models.Career || mongoose.model('Career', new mongoose.Schema({}, { strict: false }));
    const count = await Career.countDocuments();
    if (count === 0) {
      const seedsPath = path.resolve(__dirname, '../../../database/seeds/careers.json');
      if (fs.existsSync(seedsPath)) {
        const raw = JSON.parse(fs.readFileSync(seedsPath, 'utf-8'));
        const { loadAndTransformCareers } = require('../../../database/seed/seedCareers');
        const transformed = loadAndTransformCareers();
        for (const c of transformed) {
          await Career.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
        }
        console.log(`[Database Auto-Seed] Ingested all ${transformed.length} careers into active instance.`);
      }
    }
  } catch (seedErr) {
    console.warn('[Database Auto-Seed] Auto-seed note:', seedErr);
  }
}

export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoUri =
    process.env.MONGODB_URI ||
    'mongodb+srv://om:lcq2zJ75lL9zTzVc@idp.f56kscu.mongodb.net/dataquest?retryWrites=true&w=majority';
  const dbName = process.env.DB_NAME || 'dataquest';

  try {
    const conn = await mongoose.connect(mongoUri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 5000
    });

    console.log(`[MongoDB] Connected successfully to Primary Cluster: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);

    await autoSeedCareersIfEmpty();
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Primary Cluster unavailable (${(error as Error).message}).`);
    console.log(`[MongoDB] Initializing Resilient Embedded Engine for continuous MVP availability...`);

    try {
      memServerInstance = await MongoMemoryServer.create({
        instance: { dbName: dbName }
      });
      const memoryUri = memServerInstance.getUri();

      const conn = await mongoose.connect(memoryUri, {
        dbName: dbName
      });

      console.log(`[MongoDB] Connected to Resilient Engine: ${conn.connection.host}`);
      console.log(`[MongoDB] Active Database: ${conn.connection.name}`);

      await autoSeedCareersIfEmpty();
      return conn;
    } catch (memError) {
      console.error('[MongoDB] Critical DB failure:', memError);
      throw memError;
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (memServerInstance) {
      await memServerInstance.stop();
    }
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error('[MongoDB] Disconnection error:', error);
  }
};

export default connectDB;
