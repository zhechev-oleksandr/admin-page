import { useLogout } from "@features/auth/hooks/useLogout";
import { Button } from "@shared/ui/Button";

export const MainPage = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <main className="min-h-screen bg-bg-base">
      <header className="flex items-center justify-between px-8 py-4 border-b border-border-base bg-bg-surface">
        <span className="text-sm font-semibold text-fg-base">Admin Panel</span>
        <Button variant="ghost" size="sm" loading={isPending} onClick={() => logout()}>
          Вийти
        </Button>
      </header>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] gap-2">
        <h2 className="text-fg-base">Ласкаво просимо</h2>
        <p className="text-fg-muted text-sm">Ви успішно увійшли до системи.</p>
      </div>
    </main>
  );
};
