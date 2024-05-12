import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;
const MONGO_DB = process.env.MONGO_DB;

if (!MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable inside .env.local');
}

let cached = global.mongo;

if (!cached) cached = global.mongo = { client: null, db: null };

export async function connectToDatabase() {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  const client = await MongoClient.connect(MONGO_URL);

  const db = await client.db(MONGO_DB);

  cached.client = client;
  cached.db = db;

  return { client: cached.client, db: cached.db };
}