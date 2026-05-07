import { api } from "@core/api";
import { authResponseSchema } from "shared/schemas/auth.schema";

export const authApi = {
  login: async (signature: string, identifier: string, fullName: string, drfoCode: string) => {
    const res = await api.post("/auth/login", {
      signature,
      identifier,
      fullName,
      drfoCode,
    });
    const parsed = authResponseSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Unexpected response from server");
    return parsed.data;
  },

  logout: () => api.post("/auth/logout"),

  me: async (): Promise<{ authenticated: boolean; name: string; drfoCode: string }> => {
    const res = await api.get<{ authenticated: boolean; name: string; drfoCode: string }>(
      "/auth/me"
    );
    return res.data;
  },
};
