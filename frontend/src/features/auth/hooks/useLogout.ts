import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuthStore } from "../store";
import { queryClient } from "@core/queryClient";

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: () => {
      logout();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
};
