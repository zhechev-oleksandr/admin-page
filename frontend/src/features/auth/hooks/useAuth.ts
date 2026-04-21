import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "../store";

export interface AuthInput {
  file: File;
  text: string;
  hiddenText: string;
}

// Placeholder function
const processCredentials = async (
  file: File,
  text: string,
  hiddenText: string
): Promise<string> => {
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);
  const filePart = Array.from(fileBytes)
  .map((b) => String.fromCharCode(b))
  .join("");

  const combined = `${text}:${hiddenText}:${filePart}`;
  return btoa(combined);
}

export const useAuth = () => {
  const setToken = useAuthStore((s) => s.setAccessToken);

  return useMutation({
    mutationFn: async ({ file, text, hiddenText }: AuthInput) => {
      const base64Payload = await processCredentials(file, text, hiddenText);
      return authApi.authenticate(base64Payload);
    },
    onSuccess: (data) => {
      if (data.success === 1) {
        setToken(data.access_token);
      }
    },
  });
}