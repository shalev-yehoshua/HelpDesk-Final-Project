import { createAdmin, getAdminByUsername } from "../db/adminActions";
import { hashPassword } from "./password";

export async function ensureAdminExists(): Promise<void> {
    const username = process.env.ADMIN_USERNAME?.trim();
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are required");
    }

    const existingAdmin = await getAdminByUsername(username);

    if (existingAdmin !== null) {
        return;
    }

    const { passwordHash, passwordSalt } = await hashPassword(password);
    await createAdmin({ username, passwordHash, passwordSalt });
    console.log("Initial admin created");
}

