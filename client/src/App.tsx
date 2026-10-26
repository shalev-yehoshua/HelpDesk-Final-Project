import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTicketPage from "./pages/CreateTicketPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import DashboardPage from "./pages/DashboardPage";
import TicketsPage from "./pages/TicketsPage";
import { logoutAdmin } from "./services/authApi";
import { clearStoredAdmin, getStoredAdmin, storeAdmin } from "./services/authStorage";
import type { AdminLoginResult } from "./types/admin";

export default function App() {
    const [admin, setAdmin] = useState<AdminLoginResult | null>(() => getStoredAdmin());

    const handleLogin = (loggedInAdmin: AdminLoginResult): void => {
        storeAdmin(loggedInAdmin);
        setAdmin(loggedInAdmin);
    };

    const handleLogout = async (): Promise<void> => {
        try {
            if (admin !== null) {
                await logoutAdmin(admin.token);
            }
        } finally {
            clearStoredAdmin();
            setAdmin(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navigation username={admin?.username ?? null} onLogout={handleLogout} />

            <Routes>
                <Route path="/" element={<CreateTicketPage />} />
                <Route path="/confirmation/:id" element={<ConfirmationPage />} />
                <Route
                    path="/admin/login"
                    element={<AdminLoginPage isAuthenticated={admin !== null} onLogin={handleLogin} />}
                />

                <Route element={<ProtectedRoute isAuthenticated={admin !== null} />}>
                    <Route path="/admin/dashboard" element={<DashboardPage token={admin?.token ?? ""} />} />
                    <Route path="/admin/tickets" element={<TicketsPage token={admin?.token ?? ""} />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}
