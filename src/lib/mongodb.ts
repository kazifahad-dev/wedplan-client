import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI .env.local not found in file");

const mongoUri: string = uri;

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

function createClient(): MongoClient {
  const newClient = new MongoClient(mongoUri, {
    maxPoolSize: 10,
   
    maxIdleTimeMS: 5000,
    serverSelectionTimeoutMS: 10000,
  });

  
  if (process.env.VERCEL) {
    attachDatabasePool(newClient);
  }

  return newClient;
}


const client: MongoClient =
  globalForMongo._mongoClient ??
  (globalForMongo._mongoClient = createClient());

export default client;