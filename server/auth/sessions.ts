import { randomBytes } from "node:crypto";

interface AdminSession {
    username: string;
    expiresAt: number;
}

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const sessions = new Map<string, AdminSession>();

export function createSession(username: string): string {
    const token = randomBytes(32).toString("hex");

    sessions.set(token, {
        username,
        expiresAt: Date.now() + SESSION_DURATION_MS
    });

    return token;
}

export function isSessionValid(token: string): boolean {
    const session = sessions.get(token);

    if (!session) {
        return false;
    }

    if (session.expiresAt <= Date.now()) {
        sessions.delete(token);
        return false;
    }

    return true;
}

export function deleteSession(token: string): void {
    sessions.delete(token);
}

