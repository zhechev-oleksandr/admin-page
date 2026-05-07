import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";

export interface AuthInput {
  signature: string;
  identifier: string;
  fullName: string;
  drfoCode: string;
}

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ signature, identifier, fullName, drfoCode }: AuthInput) =>
      authApi.login(signature, identifier, fullName, drfoCode),
    onSuccess: (data, variables) => {
      if (data.success === 1) {
        setAuthenticated(true);
        setUser(variables.fullName, variables.drfoCode);
        navigate("/");
      }
    },
  });
};
