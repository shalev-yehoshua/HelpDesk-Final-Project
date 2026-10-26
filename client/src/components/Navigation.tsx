import { Link, NavLink } from "react-router-dom";

interface NavigationProps {
    username: string | null;
    onLogout: () => Promise<void>;
}

export default function Navigation({ username, onLogout }: NavigationProps) {
    const linkClass = ({ isActive }: { isActive: boolean }): string =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${
            isActive ? "bg-blue-100 text-blue-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`;

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
                <Link to="/" className="flex items-center gap-3 text-slate-900">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-lg font-bold text-white">HD</span>
                    <span>
                        <span className="block font-bold">Help Desk</span>
                        <span className="block text-xs text-slate-500">Support Ticket System</span>
                    </span>
                </Link>

                <nav className="flex flex-wrap items-center gap-1">
                    <NavLink to="/" end className={linkClass}>Open Ticket</NavLink>
                    {username === null ? (
                        <NavLink to="/admin/login" className={linkClass}>Admin Login</NavLink>
                    ) : (
                        <>
                            <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
                            <NavLink to="/admin/tickets" className={linkClass}>Tickets</NavLink>
                            <span className="px-2 text-sm text-slate-500">{username}</span>
                            <button
                                type="button"
                                onClick={() => void onLogout()}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

