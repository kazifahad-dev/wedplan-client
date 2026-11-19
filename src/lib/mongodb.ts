import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI .env.local ফাইলে নেই");


const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

const client = globalForMongo._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}

export default client;