import type { Ticket } from "../types/ticket";
import TicketCard from "./TicketCard";

interface TicketListProps {
    tickets: Ticket[];
    token: string;
    emptyMessage: string;
    onTicketUpdated: (ticket: Ticket) => void;
    onTicketDeleted: (id: string) => void;
}

export default function TicketList({
    tickets,
    token,
    emptyMessage,
    onTicketUpdated,
    onTicketDeleted
}: TicketListProps) {
    if (tickets.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tickets.map((ticket) => (
                <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    token={token}
                    onTicketUpdated={onTicketUpdated}
                    onTicketDeleted={onTicketDeleted}
                />
            ))}
        </div>
    );
}

