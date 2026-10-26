import type { AdminLoginResult } from "../types/admin";

const STORAGE_KEY = "help-desk-admin";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function getStoredAdmin(): AdminLoginResult | null {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored === null) {
        return null;
    }

    try {
        const value: unknown = JSON.parse(stored);

        if (
            isRecord(value) &&
            typeof value.username === "string" &&
            typeof value.token === "string"
        ) {
            return { username: value.username, token: value.token };
        }
    } catch {
        sessionStorage.removeItem(STORAGE_KEY);
    }

    return null;
}

export function storeAdmin(admin: AdminLoginResult): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
}

export function clearStoredAdmin(): void {
    sessionStorage.removeItem(STORAGE_KEY);
}

