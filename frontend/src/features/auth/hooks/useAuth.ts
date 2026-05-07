import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";

export interface AuthInput {
  signature: string;
  identifier: string;
}

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ signature, identifier }: AuthInput) => authApi.login(signature, identifier),
    onSuccess: (data) => {
      if (data.success === 1) {
        setUser(data.fullName, data.drfoCode)
        setAuthenticated(true);
        navigate("/");
      }
    },
  });
};
