import type { WithId } from "mongodb";

export const TICKET_CATEGORIES = [
    "Hardware",
    "Software",
    "Network",
    "Account",
    "Other"
] as const;

export const TICKET_PRIORITIES = ["Low", "Medium", "High"] as const;
export const TICKET_STATUSES = ["Open", "In Progress", "Resolved"] as const;

export type TicketCategory = typeof TICKET_CATEGORIES[number];
export type TicketPriority = typeof TICKET_PRIORITIES[number];
export type TicketStatus = typeof TICKET_STATUSES[number];

export interface CreateTicketInput {
    customerName: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
}

export interface TicketDocument extends CreateTicketInput {
    status: TicketStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type MongoTicket = WithId<TicketDocument>;

export interface Ticket extends CreateTicketInput {
    id: string;
    status: TicketStatus;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateTicketInput {
    status?: TicketStatus;
    priority?: TicketPriority;
}

export interface TicketIdParams {
    id: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isFilledString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export function isTicketCategory(value: unknown): value is TicketCategory {
    return typeof value === "string" && TICKET_CATEGORIES.some((category) => category === value);
}

export function isTicketPriority(value: unknown): value is TicketPriority {
    return typeof value === "string" && TICKET_PRIORITIES.some((priority) => priority === value);
}

export function isTicketStatus(value: unknown): value is TicketStatus {
    return typeof value === "string" && TICKET_STATUSES.some((status) => status === value);
}

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
    const digits = value.replace(/\D/g, "");
    return /^[0-9+()\-\s]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
}

export function parseCreateTicketInput(value: unknown): CreateTicketInput | null {
    if (!isRecord(value)) {
        return null;
    }

    const {
        customerName,
        email,
        phone,
        title,
        description,
        category,
        priority
    } = value;

    if (
        !isFilledString(customerName) ||
        !isFilledString(email) ||
        !isFilledString(phone) ||
        !isFilledString(title) ||
        !isFilledString(description) ||
        !isTicketCategory(category) ||
        !isTicketPriority(priority)
    ) {
        return null;
    }

    const cleanCustomerName = customerName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (
        !isValidEmail(cleanEmail) ||
        !isValidPhone(cleanPhone) ||
        cleanTitle.length < 2 ||
        cleanDescription.length < 10
    ) {
        return null;
    }

    return {
        customerName: cleanCustomerName,
        email: cleanEmail,
        phone: cleanPhone,
        title: cleanTitle,
        description: cleanDescription,
        category,
        priority
    };
}

export function parseUpdateTicketInput(value: unknown): UpdateTicketInput | null {
    if (!isRecord(value)) {
        return null;
    }

    const { status, priority } = value;
    const hasStatus = status !== undefined;
    const hasPriority = priority !== undefined;

    if (!hasStatus && !hasPriority) {
        return null;
    }

    if (hasStatus && !isTicketStatus(status)) {
        return null;
    }

    if (hasPriority && !isTicketPriority(priority)) {
        return null;
    }

    return {
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority })
    };
}

