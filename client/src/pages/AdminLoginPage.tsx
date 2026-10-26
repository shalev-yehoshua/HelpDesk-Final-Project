import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authApi";
import type { AdminLoginResult } from "../types/admin";
import ErrorMessage from "../components/ErrorMessage";

interface AdminLoginPageProps {
    isAuthenticated: boolean;
    onLogin: (admin: AdminLoginResult) => void;
}

export default function AdminLoginPage({ isAuthenticated, onLogin }: AdminLoginPageProps) {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setError(null);

        if (username.trim().length === 0 || password.length === 0) {
            setError("Username and password are required");
            return;
        }

        setIsLoading(true);

        try {
            const admin = await loginAdmin({ username, password });
            onLogin(admin);
            navigate("/admin/dashboard", { replace: true });
        } catch (loginError: unknown) {
            setError(loginError instanceof Error ? loginError.message : "Failed to log in");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    return (
        <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12">
            <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Admin area</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-950">Welcome back</h1>
                <p className="mt-2 text-slate-500">Log in to manage support tickets.</p>

                <label className="mt-7 flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                    Username
                    <input value={username} onChange={(event) => setUsername(event.target.value)} className={inputClass} />
                </label>

                <label className="mt-4 flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                    Password
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
                </label>

                {error !== null && <div className="mt-5"><ErrorMessage message={error} /></div>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    );
}

