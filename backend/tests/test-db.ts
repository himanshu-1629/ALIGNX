import { connectDB, disconnectDB } from '../src/config/db';

async function testConnection() {
  console.log('Testing MongoDB connection...');
  try {
    const conn = await connectDB();
    const db = conn.connection.db;

    if (db) {
      const collections = await db.listCollections().toArray();
      console.log('Existing collections:', collections.map((c) => c.name));
      const ping = await db.command({ ping: 1 });
      console.log('MongoDB Ping response:', ping);
    }

    console.log('MongoDB Atlas connection verified successfully!');
  } catch (err) {
    console.error('Connection test failed:', err);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

testConnection();
