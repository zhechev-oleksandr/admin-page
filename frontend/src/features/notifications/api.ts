import { api } from "@core/api";

export const notificationsApi = {
  send: (title: string, body: string) =>
    api.post<{ success: boolean }>("/notifications/send", { title, body }),
};
