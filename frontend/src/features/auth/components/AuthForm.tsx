import { useState } from "react";
import { Input, FileDropzone, Button, Spinner } from "@shared/ui";
import { useAuth } from "../hooks";
import { generateIdentifier } from "../lib/generateIdentifier";

const IDENTIFIER = generateIdentifier();

interface AuthForm {
  libStatus: "idle" | "loading" | "ready" | "error";
  libError: string | null;
  signData: (keyFile: File, password: string, identifier: string) => Promise<string>;
}

export const AuthForm = ({ libStatus, libError, signData }: AuthForm) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ file?: string; password?: string }>({});
  const [isSigning, setIsSigning] = useState(false);

  const { mutate, isPending, error: authError, data } = useAuth();
  const hasAuthError = data?.success === 0;
  const isLoading = isSigning || isPending;

  const buttonLabel = isSigning ? "Підписування…" : isPending ? "Перевірка…" : "Увійти";

  function validate(): boolean {
    const next: typeof errors = {};
    if (!file) next.file = "Оберіть файл ключа";
    if (!password.trim()) next.password = "Введіть пароль ключа";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !file) return;

    try {
      setIsSigning(true);
      const signature = await signData(file, password, IDENTIFIER);
      setIsSigning(false);
      mutate({ signature, identifier: IDENTIFIER });
    } catch (err) {
      setIsSigning(false);
      setErrors((prev) => ({
        ...prev,
        password: err instanceof Error ? err.message : "Помилка підпису",
      }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {libStatus === "error" && (
        <div className="px-4 py-3 rounded-lg text-sm text-danger-fg bg-danger-subtle border border-danger-fg">
          {libError ?? "Не вдалося ініціалізувати бібліотеку підпису."}
        </div>
      )}

      <FileDropzone
        label="Файл ключа (.p12, .jks, .pfx, .zs2)"
        accept=".p12,.jks,.pfx,.pk8,.zs2,.dat"
        value={file}
        onChange={(f) => {
          setFile(f);
          if (f) setErrors((p) => ({ ...p, file: undefined }));
        }}
        error={errors.file}
      />

      <Input
        label="Пароль захисту ключа"
        type="password"
        placeholder="••••••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (e.target.value) setErrors((p) => ({ ...p, password: undefined }));
        }}
        error={errors.password}
        required
      />

      {(authError || hasAuthError) && (
        <div className="px-4 py-3 rounded-lg text-sm text-danger-fg bg-danger-subtle border border-danger-fg">
          {hasAuthError
            ? "Доступ заборонено. Перевірте ваші облікові дані."
            : "Сталася помилка. Спробуйте ще раз."}
        </div>
      )}

      {isSigning && (
        <div className="px-4 py-3 rounded-lg text-sm text-fg-muted bg-bg-subtle border border-border-base flex items-center gap-2">
          <Spinner />
          Зверніться до серверів ЦСК для перевірки підпису…
        </div>
      )}

      <Button
        type="submit"
        loading={isLoading}
        disabled={!file || libStatus !== "ready" || isLoading}
        className="w-full mt-1"
      >
        {buttonLabel}
      </Button>
    </form>
  );
};
