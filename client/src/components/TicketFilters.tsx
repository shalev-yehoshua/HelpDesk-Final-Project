import type { ChangeEvent } from "react";
import type { TicketCategory, TicketPriority, TicketStatus } from "../types/ticket";
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from "../types/ticket";

export interface TicketFiltersValue {
    search: string;
    status: "All" | TicketStatus;
    priority: "All" | TicketPriority;
    category: "All" | TicketCategory;
}

interface TicketFiltersProps {
    value: TicketFiltersValue;
    onChange: (value: TicketFiltersValue) => void;
}

export default function TicketFilters({ value, onChange }: TicketFiltersProps) {
    const selectClass = "rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        onChange({ ...value, status: event.target.value as TicketFiltersValue["status"] });
    };

    const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        onChange({ ...value, priority: event.target.value as TicketFiltersValue["priority"] });
    };

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        onChange({ ...value, category: event.target.value as TicketFiltersValue["category"] });
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_repeat(3,auto)]">
                <input
                    type="search"
                    value={value.search}
                    onChange={(event) => onChange({ ...value, search: event.target.value })}
                    placeholder="Search by title, customer, or email"
                    aria-label="Search tickets"
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <select value={value.status} onChange={handleStatusChange} className={selectClass} aria-label="Filter by status">
                    <option>All</option>
                    {TICKET_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>

                <select value={value.priority} onChange={handlePriorityChange} className={selectClass} aria-label="Filter by priority">
                    <option>All</option>
                    {TICKET_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
                </select>

                <select value={value.category} onChange={handleCategoryChange} className={selectClass} aria-label="Filter by category">
                    <option>All</option>
                    {TICKET_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                </select>
            </div>
        </section>
    );
}

