import { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import TicketFilters from "../components/TicketFilters";
import type { TicketFiltersValue } from "../components/TicketFilters";
import TicketList from "../components/TicketList";
import { exportTicketsCsv, getTickets } from "../services/ticketsApi";
import type { Ticket } from "../types/ticket";

interface TicketsPageProps {
    token: string;
}

const INITIAL_FILTERS: TicketFiltersValue = {
    search: "",
    status: "All",
    priority: "All",
    category: "All"
};

export default function TicketsPage({ token }: TicketsPageProps) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filters, setFilters] = useState<TicketFiltersValue>(INITIAL_FILTERS);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const loadTickets = async (): Promise<void> => {
            try {
                const data = await getTickets(token);

                if (isActive) {
                    setTickets(data);
                }
            } catch (loadError: unknown) {
                if (isActive) {
                    setError(loadError instanceof Error ? loadError.message : "Failed to load tickets");
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        void loadTickets();
        return () => {
            isActive = false;
        };
    }, [token]);

    const normalizedSearch = filters.search.trim().toLowerCase();
    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch = normalizedSearch.length === 0 ||
            ticket.title.toLowerCase().includes(normalizedSearch) ||
            ticket.customerName.toLowerCase().includes(normalizedSearch) ||
            ticket.email.toLowerCase().includes(normalizedSearch);
        const matchesStatus = filters.status === "All" || ticket.status === filters.status;
        const matchesPriority = filters.priority === "All" || ticket.priority === filters.priority;
        const matchesCategory = filters.category === "All" || ticket.category === filters.category;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    const handleTicketUpdated = (updatedTicket: Ticket): void => {
        setTickets((current) => current.map((ticket) =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket
        ));
    };

    const handleTicketDeleted = (id: string): void => {
        setTickets((current) => current.filter((ticket) => ticket.id !== id));
    };

    const handleExport = async (): Promise<void> => {
        setIsExporting(true);
        setError(null);

        try {
            await exportTicketsCsv(token);
        } catch (exportError: unknown) {
            setError(exportError instanceof Error ? exportError.message : "Failed to export tickets");
        } finally {
            setIsExporting(false);
        }
    };

    const filtersAreActive = filters.search.trim().length > 0 ||
        filters.status !== "All" || filters.priority !== "All" || filters.category !== "All";

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Admin area</p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-950">Ticket management</h1>
                    <p className="mt-2 text-slate-600">Search, filter, view, update, and delete support tickets.</p>
                </div>
                <button
                    type="button"
                    onClick={() => void handleExport()}
                    disabled={isExporting}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-300"
                >
                    {isExporting ? "Exporting..." : "Export CSV"}
                </button>
            </div>

            <div className="mt-7 space-y-5">
                <TicketFilters value={filters} onChange={setFilters} />
                {error !== null && <ErrorMessage message={error} />}
                {isLoading && <Loading text="Loading tickets..." />}

                {!isLoading && error === null && (
                    <TicketList
                        tickets={filteredTickets}
                        token={token}
                        emptyMessage={
                            tickets.length === 0
                                ? "No support tickets were found"
                                : filtersAreActive
                                    ? "No tickets match the current search and filters"
                                    : "No support tickets were found"
                        }
                        onTicketUpdated={handleTicketUpdated}
                        onTicketDeleted={handleTicketDeleted}
                    />
                )}
            </div>
        </main>
    );
}

