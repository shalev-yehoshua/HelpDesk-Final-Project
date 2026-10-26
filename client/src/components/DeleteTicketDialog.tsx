import { useState } from "react";
import { AlertDialog } from "radix-ui";
import { deleteTicket } from "../services/ticketsApi";
import type { Ticket } from "../types/ticket";
import ErrorMessage from "./ErrorMessage";

interface DeleteTicketDialogProps {
    ticket: Ticket;
    token: string;
    onTicketDeleted: (id: string) => void;
}

export default function DeleteTicketDialog({ ticket, token, onTicketDeleted }: DeleteTicketDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (): Promise<void> => {
        setIsDeleting(true);
        setError(null);

        try {
            await deleteTicket(ticket.id, token);
            onTicketDeleted(ticket.id);
            setOpen(false);
        } catch (deleteError: unknown) {
            setError(deleteError instanceof Error ? deleteError.message : "Failed to delete ticket");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Delete</AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-40 bg-slate-950/50" />
                <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
                    <AlertDialog.Title className="text-xl font-bold text-slate-950">Delete support ticket?</AlertDialog.Title>
                    <AlertDialog.Description className="mt-2 text-slate-600">
                        The ticket “{ticket.title}” will be permanently removed from the database.
                    </AlertDialog.Description>

                    {error !== null && <div className="mt-4"><ErrorMessage message={error} /></div>}

                    <div className="mt-6 flex justify-end gap-3">
                        <AlertDialog.Cancel className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100">Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action
                            onClick={(event) => {
                                event.preventDefault();
                                void handleDelete();
                            }}
                            disabled={isDeleting}
                            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:bg-slate-300"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}

