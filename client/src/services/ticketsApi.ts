import type { ApiResponse } from "../types/api";
import type { CreateTicketInput, Ticket, UpdateTicketInput } from "../types/ticket";
import { getApiUrl, sendRequest } from "./api";

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
    return sendRequest<Ticket>("/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });
}

export async function getTickets(token: string): Promise<Ticket[]> {
    return sendRequest<Ticket[]>("/tickets", {}, token);
}

export async function getTicketById(id: string, token: string): Promise<Ticket> {
    return sendRequest<Ticket>(`/tickets/${id}`, {}, token);
}

export async function updateTicket(
    id: string,
    input: UpdateTicketInput,
    token: string
): Promise<Ticket> {
    return sendRequest<Ticket>(`/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    }, token);
}

export async function deleteTicket(id: string, token: string): Promise<void> {
    await sendRequest<{ id: string }>(`/tickets/${id}`, { method: "DELETE" }, token);
}

export async function exportTicketsCsv(token: string): Promise<void> {
    const response = await fetch(`${getApiUrl()}/tickets/export/csv`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
        const body = await response.json() as ApiResponse<never>;
        throw new Error(body.success ? "Failed to export tickets" : body.error);
    }

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "help-desk-tickets.csv";
    link.click();
    URL.revokeObjectURL(downloadUrl);
}

