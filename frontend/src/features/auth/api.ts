import { api } from "@core/api";

interface AuthResponse {
  success: 0 | 1;
  access_token: string;
}

export const authApi = {
  authenticate: (base64Payload: string) =>
    api
    .post<AuthResponse>("/auth/login", { payload: base64Payload })
    .then((r) => r.data),
};