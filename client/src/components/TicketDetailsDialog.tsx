import { useState } from "react";
import { Dialog } from "radix-ui";
import { getTicketById } from "../services/ticketsApi";
import type { Ticket } from "../types/ticket";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

interface TicketDetailsDialogProps {
    ticketId: string;
    token: string;
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

export default function TicketDetailsDialog({ ticketId, token }: TicketDetailsDialogProps) {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadTicket = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            setTicket(await getTicketById(ticketId, token));
        } catch (loadError: unknown) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load ticket");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (open: boolean): void => {
        if (open) {
            void loadTicket();
        } else {
            setTicket(null);
            setError(null);
        }
    };

    return (
        <Dialog.Root onOpenChange={handleOpenChange}>
            <Dialog.Trigger className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                View
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                    <Dialog.Title className="text-2xl font-bold text-slate-950">Ticket details</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-slate-500">Full information loaded from the server by ticket ID.</Dialog.Description>

                    <div className="mt-6">
                        {isLoading && <Loading text="Loading ticket..." />}
                        {error !== null && <ErrorMessage message={error} />}

                        {ticket !== null && (
                            <div className="space-y-5">
                                <div>
                                    <p className="text-sm text-slate-500">Title</p>
                                    <p className="text-xl font-semibold text-slate-950">{ticket.title}</p>
                                </div>

                                <dl className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                                    <div><dt className="text-xs uppercase text-slate-500">Customer</dt><dd>{ticket.customerName}</dd></div>
                                    <div><dt className="text-xs uppercase text-slate-500">Email</dt><dd className="break-all">{ticket.email}</dd></div>
                                    <div><dt className="text-xs uppercase text-slate-500">Phone</dt><dd>{ticket.phone}</dd></div>
                                    <div><dt className="text-xs uppercase text-slate-500">Category</dt><dd>{ticket.category}</dd></div>
                                    <div><dt className="text-xs uppercase text-slate-500">Priority</dt><dd>{ticket.priority}</dd></div>
                                    <div><dt className="text-xs uppercase text-slate-500">Status</dt><dd>{ticket.status}</dd></div>
                                    <div><dt className="text-xs uppercase text-slate-500">Created</dt><dd>{formatDate(ticket.createdAt)}</dd></div>
                                    <div><dt className="text-xs uppercase text-slate-500">Updated</dt><dd>{formatDate(ticket.updatedAt)}</dd></div>
                                </dl>

                                <div>
                                    <p className="text-sm text-slate-500">Description</p>
                                    <p className="mt-1 whitespace-pre-wrap text-slate-800">{ticket.description}</p>
                                </div>

                                <p className="break-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-slate-600">ID: {ticket.id}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-7 flex justify-end">
                        <Dialog.Close className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800">Close</Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

