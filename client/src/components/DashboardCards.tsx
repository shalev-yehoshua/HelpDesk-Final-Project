import type { Ticket } from "../types/ticket";

interface DashboardCardsProps {
    tickets: Ticket[];
}

export default function DashboardCards({ tickets }: DashboardCardsProps) {
    const cards = [
        { label: "Total Tickets", value: tickets.length, color: "border-blue-200 bg-blue-50 text-blue-800" },
        { label: "Open", value: tickets.filter((ticket) => ticket.status === "Open").length, color: "border-sky-200 bg-sky-50 text-sky-800" },
        { label: "In Progress", value: tickets.filter((ticket) => ticket.status === "In Progress").length, color: "border-amber-200 bg-amber-50 text-amber-800" },
        { label: "Resolved", value: tickets.filter((ticket) => ticket.status === "Resolved").length, color: "border-emerald-200 bg-emerald-50 text-emerald-800" },
        { label: "High Priority", value: tickets.filter((ticket) => ticket.priority === "High").length, color: "border-red-200 bg-red-50 text-red-800" }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((card) => (
                <article key={card.label} className={`rounded-2xl border p-5 ${card.color}`}>
                    <p className="text-sm font-semibold">{card.label}</p>
                    <p className="mt-2 text-3xl font-bold">{card.value}</p>
                </article>
            ))}
        </div>
    );
}

