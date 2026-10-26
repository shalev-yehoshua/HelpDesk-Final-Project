import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Dialog } from "radix-ui";
import { updateTicket } from "../services/ticketsApi";
import type { Ticket, TicketPriority, TicketStatus } from "../types/ticket";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "../types/ticket";
import ErrorMessage from "./ErrorMessage";

interface UpdateTicketDialogProps {
    ticket: Ticket;
    token: string;
    onTicketUpdated: (ticket: Ticket) => void;
}

export default function UpdateTicketDialog({ ticket, token, onTicketUpdated }: UpdateTicketDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [status, setStatus] = useState<TicketStatus>(ticket.status);
    const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = (nextOpen: boolean): void => {
        setOpen(nextOpen);
        setError(null);

        if (nextOpen) {
            setStatus(ticket.status);
            setPriority(ticket.priority);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setIsUpdating(true);
        setError(null);

        try {
            const updatedTicket = await updateTicket(ticket.id, { status, priority }, token);
            onTicketUpdated(updatedTicket);
            setOpen(false);
        } catch (updateError: unknown) {
            setError(updateError instanceof Error ? updateError.message : "Failed to update ticket");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        setStatus(event.target.value as TicketStatus);
    };

    const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        setPriority(event.target.value as TicketPriority);
    };

    const selectClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">Update</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
                    <Dialog.Title className="text-2xl font-bold text-slate-950">Update ticket</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-slate-500">Only status and priority can be changed.</Dialog.Description>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                            Status
                            <select value={status} onChange={handleStatusChange} className={selectClass}>
                                {TICKET_STATUSES.map((value) => <option key={value}>{value}</option>)}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                            Priority
                            <select value={priority} onChange={handlePriorityChange} className={selectClass}>
                                {TICKET_PRIORITIES.map((value) => <option key={value}>{value}</option>)}
                            </select>
                        </label>

                        {error !== null && <ErrorMessage message={error} />}

                        <div className="flex justify-end gap-3 pt-2">
                            <Dialog.Close type="button" className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100">Cancel</Dialog.Close>
                            <button type="submit" disabled={isUpdating} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300">
                                {isUpdating ? "Updating..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

