import { adminsCollection } from "./index";
import type { AdminDocument, MongoAdmin } from "../type/admin";

export async function getAdminByUsername(username: string): Promise<MongoAdmin | null> {
    return adminsCollection.findOne({ username });
}

export async function createAdmin(document: AdminDocument): Promise<void> {
    const result = await adminsCollection.insertOne(document);

    if (!result.acknowledged) {
        throw new Error("Failed to create admin");
    }
}

