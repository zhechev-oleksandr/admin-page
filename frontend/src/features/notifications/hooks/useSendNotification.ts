import { useMutation } from "@tanstack/react-query";
import { notificationsApi } from "../api";

export function useSendNotification() {
  return useMutation({
    mutationFn: ({ title, body }: { title: string; body: string }) =>
      notificationsApi.send(title, body),
  });
}
