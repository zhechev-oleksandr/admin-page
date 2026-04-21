import { useAuthStore } from "@features/auth";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const token = useAuthStore((s) => s.accessToken);
  return token ? <Navigate to="/" replace /> : <Outlet />;
};
