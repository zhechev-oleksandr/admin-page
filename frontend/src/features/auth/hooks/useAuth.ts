import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "../store";

export interface AuthInput {
  file: File;
  text: string;
  hiddenText: string;
}

export const useAuth = () => {
  const setToken = useAuthStore((s) => s.setAccessToken);

  return useMutation({
    mutationFn: ({ file, text, hiddenText }: AuthInput) =>
      authApi.login(file, text, hiddenText),
    onSuccess: (data) => {
      if (data.success === 1) setToken(data.access_token);
    },
  });
}