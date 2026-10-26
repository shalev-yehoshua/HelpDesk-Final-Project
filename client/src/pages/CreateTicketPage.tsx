import { useNavigate } from "react-router-dom";
import TicketForm from "../components/TicketForm";
import type { Ticket } from "../types/ticket";

export default function CreateTicketPage() {
    const navigate = useNavigate();

    const handleTicketCreated = (ticket: Ticket): void => {
        navigate(`/confirmation/${ticket.id}`);
    };

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
            <div className="mb-8 max-w-2xl">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">Public support form</span>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">How can we help?</h1>
                <p className="mt-3 text-lg text-slate-600">Describe the problem and our support team will review your ticket.</p>
            </div>
            <TicketForm onTicketCreated={handleTicketCreated} />
        </main>
    );
}

