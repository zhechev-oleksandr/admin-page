import { useLogout, useAuthStore } from "@features/auth";
import { Button } from "@shared/ui/Button";
import { useState } from "react";
import { SendNotificationModal } from "@features/notifications";

export const MainPage = () => {
  const { mutate: logout, isPending } = useLogout();
  const name = useAuthStore((s) => s.name);
  const drfoCode = useAuthStore((s) => s.drfoCode);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-bg-base">
      <header className="flex items-center justify-between px-8 py-4 border-b border-border-base bg-bg-surface">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-fg-base">{name || "—"}</span>
          <span className="text-xs text-fg-subtle">РНОКПП: {drfoCode || "—"}</span>
        </div>
        <Button variant="ghost" size="sm" loading={isPending} onClick={() => logout()}>
          Вийти
        </Button>
      </header>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] gap-2">
        <h2 className="text-fg-base">Ласкаво просимо</h2>
        <p className="text-fg-muted text-sm">Ви успішно увійшли до системи.</p>
        <Button onClick={() => setModalOpen(true)}>Надіслати повідомлення</Button>
      </div>
      <SendNotificationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
};
