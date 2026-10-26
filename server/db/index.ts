import { Collection, Db, MongoClient } from "mongodb";
import type { AdminDocument } from "../type/admin";
import type { TicketDocument } from "../type/ticket";

const uri = process.env.MONGODB_URI?.trim();

if (!uri) {
    throw new Error("MONGODB_URI is required");
}

const client = new MongoClient(uri);
const db: Db = client.db("help_desk");

export const ticketsCollection: Collection<TicketDocument> = db.collection<TicketDocument>("tickets");
export const adminsCollection: Collection<AdminDocument> = db.collection<AdminDocument>("admins");

export async function connectDB(): Promise<void> {
    await client.connect();
    await adminsCollection.createIndex({ username: 1 }, { unique: true });
    console.log("Connected to MongoDB");
}

export async function closeDB(): Promise<void> {
    await client.close();
}
