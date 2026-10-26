import type { Ticket } from "../types/ticket";
import DeleteTicketDialog from "./DeleteTicketDialog";
import TicketDetailsDialog from "./TicketDetailsDialog";
import UpdateTicketDialog from "./UpdateTicketDialog";

interface TicketCardProps {
    ticket: Ticket;
    token: string;
    onTicketUpdated: (ticket: Ticket) => void;
    onTicketDeleted: (id: string) => void;
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

export default function TicketCard({ ticket, token, onTicketUpdated, onTicketDeleted }: TicketCardProps) {
    const statusClass = ticket.status === "Resolved"
        ? "bg-emerald-100 text-emerald-800"
        : ticket.status === "In Progress"
            ? "bg-amber-100 text-amber-800"
            : "bg-sky-100 text-sky-800";

    const priorityClass = ticket.priority === "High"
        ? "bg-red-100 text-red-800"
        : ticket.priority === "Medium"
            ? "bg-orange-100 text-orange-800"
            : "bg-slate-100 text-slate-700";

    return (
        <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass}`}>{ticket.status}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${priorityClass}`}>{ticket.priority}</span>
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-800">{ticket.category}</span>
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-950">{ticket.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{ticket.customerName}</p>
            <p className="text-sm text-slate-500">{ticket.email}</p>
            <p className="mt-4 text-xs text-slate-500">Created {formatDate(ticket.createdAt)}</p>

            <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <TicketDetailsDialog ticketId={ticket.id} token={token} />
                <UpdateTicketDialog ticket={ticket} token={token} onTicketUpdated={onTicketUpdated} />
                <DeleteTicketDialog ticket={ticket} token={token} onTicketDeleted={onTicketDeleted} />
            </div>
        </article>
    );
}

