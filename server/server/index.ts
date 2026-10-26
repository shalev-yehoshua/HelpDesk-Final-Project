import express, { Request, Response } from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { connectDB } from "../db/index";
import {
    createTicket,
    deleteTicket,
    getTicketById,
    getTickets,
    updateTicket
} from "../db/ticketActions";
import { getAdminByUsername } from "../db/adminActions";
import type { ApiResponse } from "../type/api";
import {
    parseCreateTicketInput,
    parseUpdateTicketInput
} from "../type/ticket";
import type {
    Ticket,
    TicketIdParams
} from "../type/ticket";
import { parseAdminLoginInput } from "../type/admin";
import type { AdminLoginResult } from "../type/admin";
import { ensureAdminExists } from "../auth/adminSetup";
import { verifyPassword } from "../auth/password";
import { createSession, deleteSession } from "../auth/sessions";
import { getBearerToken, requireAdmin } from "../auth/middleware";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN?.trim() || "http://localhost:3005";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/", (_request: Request, response: Response): void => {
    response.status(200).send("Help Desk API");
});

app.post("/tickets", async (
    request: Request<Record<string, never>, ApiResponse<Ticket>, unknown>,
    response: Response<ApiResponse<Ticket>>
): Promise<void> => {
    const input = parseCreateTicketInput(request.body);

    if (input === null) {
        response.status(400).json({
            success: false,
            error: "Missing or invalid ticket information"
        });
        return;
    }

    try {
        const ticket = await createTicket(input);
        response.status(201).json({ success: true, data: ticket });
    } catch (error: unknown) {
        console.error("POST /tickets failed", error);
        response.status(500).json({ success: false, error: "Failed to create ticket" });
    }
});

app.post(
    "/admin/login",
    async (
        request: Request<Record<string, never>, ApiResponse<AdminLoginResult>, unknown>,
        response: Response<ApiResponse<AdminLoginResult>>
    ): Promise<void> => {
        const input = parseAdminLoginInput(request.body);

        if (input === null) {
            response.status(400).json({ success: false, error: "Username and password are required" });
            return;
        }

        try {
            const admin = await getAdminByUsername(input.username);
            const isPasswordValid = admin !== null && await verifyPassword(
                input.password,
                admin.passwordHash,
                admin.passwordSalt
            );

            if (admin === null || !isPasswordValid) {
                response.status(401).json({ success: false, error: "Invalid username or password" });
                return;
            }

            const token = createSession(admin.username);
            response.status(200).json({
                success: true,
                data: { username: admin.username, token }
            });
        } catch (error: unknown) {
            console.error("POST /admin/login failed", error);
            response.status(500).json({ success: false, error: "Failed to log in" });
        }
    }
);

app.post(
    "/admin/logout",
    requireAdmin,
    (request: Request, response: Response<ApiResponse<{ loggedOut: boolean }>>): void => {
        const token = getBearerToken(request);

        if (token !== null) {
            deleteSession(token);
        }

        response.status(200).json({ success: true, data: { loggedOut: true } });
    }
);

app.use("/tickets", requireAdmin);

app.get("/tickets", async (_request: Request, response: Response<ApiResponse<Ticket[]>>): Promise<void> => {
    try {
        const tickets = await getTickets();
        response.status(200).json({ success: true, data: tickets });
    } catch (error: unknown) {
        console.error("GET /tickets failed", error);
        response.status(500).json({ success: false, error: "Failed to load tickets" });
    }
});

function escapeCsv(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
}

app.get("/tickets/export/csv", async (_request: Request, response: Response): Promise<void> => {
    try {
        const tickets = await getTickets();
        const header = [
            "Ticket ID",
            "Title",
            "Customer Name",
            "Email",
            "Phone",
            "Category",
            "Priority",
            "Status",
            "Description",
            "Created At",
            "Updated At"
        ];
        const rows = tickets.map((ticket) => [
            ticket.id,
            ticket.title,
            ticket.customerName,
            ticket.email,
            ticket.phone,
            ticket.category,
            ticket.priority,
            ticket.status,
            ticket.description,
            ticket.createdAt,
            ticket.updatedAt
        ].map(escapeCsv).join(","));
        const csv = [header.map(escapeCsv).join(","), ...rows].join("\n");

        response.setHeader("Content-Type", "text/csv; charset=utf-8");
        response.setHeader("Content-Disposition", "attachment; filename=help-desk-tickets.csv");
        response.status(200).send(csv);
    } catch (error: unknown) {
        console.error("GET /tickets/export/csv failed", error);
        response.status(500).json({ success: false, error: "Failed to export tickets" });
    }
});

app.get(
    "/tickets/:id",
    async (
        request: Request<TicketIdParams, ApiResponse<Ticket>, unknown>,
        response: Response<ApiResponse<Ticket>>
    ): Promise<void> => {
        const { id } = request.params;

        if (!ObjectId.isValid(id)) {
            response.status(400).json({ success: false, error: "Invalid ticket id" });
            return;
        }

        try {
            const ticket = await getTicketById(id);

            if (ticket === null) {
                response.status(404).json({ success: false, error: "Ticket not found" });
                return;
            }

            response.status(200).json({ success: true, data: ticket });
        } catch (error: unknown) {
            console.error("GET /tickets/:id failed", error);
            response.status(500).json({ success: false, error: "Failed to load ticket" });
        }
    }
);

app.patch(
    "/tickets/:id",
    async (
        request: Request<TicketIdParams, ApiResponse<Ticket>, unknown>,
        response: Response<ApiResponse<Ticket>>
    ): Promise<void> => {
        const { id } = request.params;

        if (!ObjectId.isValid(id)) {
            response.status(400).json({ success: false, error: "Invalid ticket id" });
            return;
        }

        const input = parseUpdateTicketInput(request.body);

        if (input === null) {
            response.status(400).json({ success: false, error: "Invalid ticket update" });
            return;
        }

        try {
            const ticket = await updateTicket(id, input);

            if (ticket === null) {
                response.status(404).json({ success: false, error: "Ticket not found" });
                return;
            }

            response.status(200).json({ success: true, data: ticket });
        } catch (error: unknown) {
            console.error("PATCH /tickets/:id failed", error);
            response.status(500).json({ success: false, error: "Failed to update ticket" });
        }
    }
);

app.delete(
    "/tickets/:id",
    async (
        request: Request<TicketIdParams>,
        response: Response<ApiResponse<{ id: string }>>
    ): Promise<void> => {
        const { id } = request.params;

        if (!ObjectId.isValid(id)) {
            response.status(400).json({ success: false, error: "Invalid ticket id" });
            return;
        }

        try {
            const isDeleted = await deleteTicket(id);

            if (!isDeleted) {
                response.status(404).json({ success: false, error: "Ticket not found" });
                return;
            }

            response.status(200).json({ success: true, data: { id } });
        } catch (error: unknown) {
            console.error("DELETE /tickets/:id failed", error);
            response.status(500).json({ success: false, error: "Failed to delete ticket" });
        }
    }
);

app.use((_request: Request, response: Response<ApiResponse<never>>): void => {
    response.status(404).json({ success: false, error: "Endpoint not found" });
});

async function start(): Promise<void> {
    await connectDB();
    await ensureAdminExists();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start().catch((error: unknown) => {
    console.error("Failed to start the server", error);
    process.exitCode = 1;
});
