import { api } from "@core/api";
import { authResponseSchema } from "shared/schemas/auth.schema";

export const authApi = {
  getChallenge: async (): Promise<string> => {
    const res = await api.get<{ nonce: string }>("/auth/challenge");
    return res.data.nonce;
  },

  login: async (signature: string, identifier: string) => {
    const res = await api.post("/auth/login", {
      signature,
      nonce: identifier,
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
