import axios from "axios";
import { useAuthStore } from "@features/auth/store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const is401 = err.response?.status === 401;
    const skipRedirect = err.config?.headers?.["x-skip-auth-redirect"] === "true";

    if (is401 && !skipRedirect) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(err);
  }
);
