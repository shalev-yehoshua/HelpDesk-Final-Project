import { ObjectId } from "mongodb";
import { ticketsCollection } from "./index";
import type {
    CreateTicketInput,
    MongoTicket,
    Ticket,
    TicketDocument,
    UpdateTicketInput
} from "../type/ticket";

function toTicket(document: MongoTicket): Ticket {
    return {
        id: document._id.toString(),
        customerName: document.customerName,
        email: document.email,
        phone: document.phone,
        title: document.title,
        description: document.description,
        category: document.category,
        priority: document.priority,
        status: document.status,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString()
    };
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
    const now = new Date();
    const document: TicketDocument = {
        ...input,
        status: "Open",
        createdAt: now,
        updatedAt: now
    };

    const result = await ticketsCollection.insertOne(document);

    if (!result.acknowledged) {
        throw new Error("Failed to create ticket");
    }

    return toTicket({ ...document, _id: result.insertedId });
}

export async function getTickets(): Promise<Ticket[]> {
    const documents = await ticketsCollection.find().sort({ createdAt: -1 }).toArray();
    return documents.map(toTicket);
}

export async function getTicketById(id: string): Promise<Ticket | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const document = await ticketsCollection.findOne({ _id: new ObjectId(id) });
    return document === null ? null : toTicket(document);
}

export async function updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const changes: UpdateTicketInput & { updatedAt: Date } = {
        ...input,
        updatedAt: new Date()
    };

    const document = await ticketsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: changes },
        { returnDocument: "after" }
    );

    return document === null ? null : toTicket(document);
}

export async function deleteTicket(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
        return false;
    }

    const result = await ticketsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
}

