import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createTicket } from "../services/ticketsApi";
import type {
    CreateTicketInput,
    Ticket,
    TicketCategory,
    TicketFormErrors,
    TicketPriority
} from "../types/ticket";
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from "../types/ticket";
import ErrorMessage from "./ErrorMessage";

interface TicketFormProps {
    onTicketCreated: (ticket: Ticket) => void;
}

const EMPTY_FORM: CreateTicketInput = {
    customerName: "",
    email: "",
    phone: "",
    title: "",
    description: "",
    category: "Hardware",
    priority: "Medium"
};

function validateForm(form: CreateTicketInput): TicketFormErrors {
    const errors: TicketFormErrors = {};
    const phoneDigits = form.phone.replace(/\D/g, "");

    if (form.customerName.trim().length === 0) {
        errors.customerName = "Full name is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = "Please enter a valid email address";
    }

    if (!/^[0-9+()\-\s]+$/.test(form.phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
        errors.phone = "Please enter a valid phone number";
    }

    if (form.title.trim().length < 2) {
        errors.title = "Please enter a meaningful title";
    }

    if (form.description.trim().length < 10) {
        errors.description = "Description must contain at least 10 characters";
    }

    return errors;
}

export default function TicketForm({ onTicketCreated }: TicketFormProps) {
    const [form, setForm] = useState<CreateTicketInput>(EMPTY_FORM);
    const [errors, setErrors] = useState<TicketFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        setForm((previous) => ({ ...previous, category: event.target.value as TicketCategory }));
    };

    const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        setForm((previous) => ({ ...previous, priority: event.target.value as TicketPriority }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const nextErrors = validateForm(form);
        setErrors(nextErrors);
        setSubmitError(null);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            const ticket = await createTicket(form);
            setForm(EMPTY_FORM);
            onTicketCreated(ticket);
        } catch (error: unknown) {
            setSubmitError(error instanceof Error ? error.message : "Failed to submit ticket");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
    const labelClass = "flex flex-col gap-1.5 text-sm font-semibold text-slate-700";
    const errorClass = "text-xs font-normal text-red-600";

    return (
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                    Full name
                    <input name="customerName" value={form.customerName} onChange={handleInputChange} className={inputClass} />
                    {errors.customerName && <span className={errorClass}>{errors.customerName}</span>}
                </label>

                <label className={labelClass}>
                    Email
                    <input name="email" type="email" value={form.email} onChange={handleInputChange} className={inputClass} />
                    {errors.email && <span className={errorClass}>{errors.email}</span>}
                </label>

                <label className={labelClass}>
                    Phone
                    <input name="phone" type="tel" value={form.phone} onChange={handleInputChange} className={inputClass} />
                    {errors.phone && <span className={errorClass}>{errors.phone}</span>}
                </label>

                <label className={labelClass}>
                    Title
                    <input name="title" value={form.title} onChange={handleInputChange} className={inputClass} />
                    {errors.title && <span className={errorClass}>{errors.title}</span>}
                </label>

                <label className={labelClass}>
                    Category
                    <select value={form.category} onChange={handleCategoryChange} className={inputClass}>
                        {TICKET_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                    </select>
                </label>

                <label className={labelClass}>
                    Priority
                    <select value={form.priority} onChange={handlePriorityChange} className={inputClass}>
                        {TICKET_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
                    </select>
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                    Description
                    <textarea name="description" rows={6} value={form.description} onChange={handleInputChange} className={inputClass} />
                    {errors.description && <span className={errorClass}>{errors.description}</span>}
                </label>
            </div>

            {submitError !== null && <div className="mt-5"><ErrorMessage message={submitError} /></div>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
                {isSubmitting ? "Submitting ticket..." : "Submit support ticket"}
            </button>
        </form>
    );
}

