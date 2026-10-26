import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardCards from "../components/DashboardCards";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { getTickets } from "../services/ticketsApi";
import type { Ticket } from "../types/ticket";

interface DashboardPageProps {
    token: string;
}

export default function DashboardPage({ token }: DashboardPageProps) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
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
                    setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard");
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

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Admin overview</p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-950">Dashboard</h1>
                    <p className="mt-2 text-slate-600">A current summary of all support tickets.</p>
                </div>
                <Link to="/admin/tickets" className="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800">Manage tickets</Link>
            </div>

            <div className="mt-8">
                {isLoading && <Loading text="Loading dashboard..." />}
                {error !== null && <ErrorMessage message={error} />}
                {!isLoading && error === null && <DashboardCards tickets={tickets} />}
            </div>
        </main>
    );
}

