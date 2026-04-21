import { AuthForm } from "@features/auth";

export const AuthPage = ()=> {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-bg-base">
      <div className="w-full max-w-104 bg-bg-surface border border-border-base rounded-2xl p-10 shadow-lg">

        <div className="mb-8">
          <h2 className="text-fg-base mb-1.5">Вхід</h2>
          <p className="text-[0.9rem] text-fg-muted leading-relaxed">
            Надайте свої облікові дані та ключ-файл, щоб продовжити.
          </p>
        </div>

        <AuthForm />

        <p className="mt-6 text-center text-[0.8125rem] text-fg-subtle">
          Виникли проблеми? Зверніться до системного адміністратора.
        </p>

      </div>
    </main>
  );
}