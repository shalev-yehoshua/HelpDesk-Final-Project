import type { AdminLoginInput, AdminLoginResult } from "../types/admin";
import { sendRequest } from "./api";

export async function loginAdmin(input: AdminLoginInput): Promise<AdminLoginResult> {
    return sendRequest<AdminLoginResult>("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });
}

export async function logoutAdmin(token: string): Promise<void> {
    await sendRequest<{ loggedOut: boolean }>("/admin/logout", { method: "POST" }, token);
}

