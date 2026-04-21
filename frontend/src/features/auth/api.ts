import { api } from "@core/api";
import { authResponseSchema, AuthResponse } from "shared/schemas/auth.schema";

export const authApi = {
  login: async (file: File, text: string, hiddenText: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    formData.append("hiddenText", hiddenText);

    const res = await api.post<AuthResponse>("/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const parsed = authResponseSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Unexpected response from server");

    return parsed.data;
  },
};
