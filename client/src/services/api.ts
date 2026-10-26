import type { ApiResponse } from "../types/api";

const API_URL: string = import.meta.env.VITE_API_URL;

export async function sendRequest<T>(
    path: string,
    options: RequestInit = {},
    token?: string
): Promise<T> {
    const headers = new Headers(options.headers);

    if (token !== undefined) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers
    });
    const body = await response.json() as ApiResponse<T>;

    if (!body.success) {
        throw new Error(body.error);
    }

    return body.data;
}

export function getApiUrl(): string {
    return API_URL;
}

