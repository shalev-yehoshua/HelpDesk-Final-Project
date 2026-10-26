import { Link, useParams } from "react-router-dom";

interface ConfirmationParams {
    id: string;
}

export default function ConfirmationPage() {
    const { id } = useParams<keyof ConfirmationParams>();

    return (
        <main className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-12">
            <section className="w-full rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
                <h1 className="mt-5 text-3xl font-bold text-slate-950">Ticket submitted successfully</h1>
                <p className="mt-3 text-slate-600">Your support request was saved and received by the Help Desk team.</p>
                {id !== undefined && (
                    <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                        Ticket ID: <span className="font-mono font-semibold text-slate-900">{id}</span>
                    </p>
                )}
                <Link to="/" className="mt-7 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                    Open another ticket
                </Link>
            </section>
        </main>
    );
}

