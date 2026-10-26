import type { WithId } from "mongodb";

export interface AdminDocument {
    username: string;
    passwordHash: string;
    passwordSalt: string;
}

export type MongoAdmin = WithId<AdminDocument>;

export interface AdminLoginInput {
    username: string;
    password: string;
}

export interface AdminLoginResult {
    username: string;
    token: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function parseAdminLoginInput(value: unknown): AdminLoginInput | null {
    if (!isRecord(value)) {
        return null;
    }

    const { username, password } = value;

    if (
        typeof username !== "string" ||
        username.trim().length === 0 ||
        typeof password !== "string" ||
        password.length === 0
    ) {
        return null;
    }

    return {
        username: username.trim(),
        password
    };
}

