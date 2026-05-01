import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage, MainPage } from "@/pages";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import {} from "@features/auth/api";
import { useEffect, useState } from "react";
import { useAuthStore, authApi } from "@features/auth";

export const AppRouter = () => {
  const [checking, setChecking] = useState(true);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  useEffect(() => {
    authApi
      .me()
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, [setAuthenticated]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <span className="text-fg-subtle text-sm">Завантаження…</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
