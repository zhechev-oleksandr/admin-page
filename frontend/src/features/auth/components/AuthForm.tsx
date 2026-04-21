import React, { useState } from 'react';
import { useAuth } from "@features/auth";
import { Button, FileDropzone, Input } from '@shared/ui';

export const AuthForm = ()=> {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [hiddenText, setHiddenText] = useState("");

  const { mutate, isPending, error, data } = useAuth();

  const hasAuthError = data?.success === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    mutate({ file, text, hiddenText });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FileDropzone
        label="Ключовий файл"
        value={file}
        onChange={setFile}
      />

      <Input
        label="Ідентифікатор"
        type="text"
        placeholder="Введіть ідентифікатор"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />

      <Input
        label="Пароль"
        type="password"
        placeholder="••••••••••••"
        value={hiddenText}
        onChange={(e) => setHiddenText(e.target.value)}
        required
      />

      {(error || hasAuthError) && (
        <div className="px-4 py-3 rounded-lg text-sm text-danger-fg bg-danger-subtle border border-danger-fg">
          {hasAuthError
            ? "Access denied. Check your credentials and try again."
            : "Something went wrong. Please try again."}
        </div>
      )}

      <Button
        type="submit"
        loading={isPending}
        disabled={!file}
        className="w-full mt-1"
      >
        {isPending ? "Обробка…" : "Вхід"}
      </Button>
    </form>
  );
}