import { useState, useEffect, useRef } from "react";
import { Button, Input } from "@shared/ui";
import { useSendNotification } from "../hooks/useSendNotification";

interface SendNotificationModalProps {
  open: boolean;
  onClose: () => void;
}

export const SendNotificationModal = ({ open, onClose }: SendNotificationModalProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [success, setSuccess] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate, isPending, error, reset } = useSendNotification();

  useEffect(() => {
    if (open) {
      setTitle("");
      setBody("");
      setSuccess(false);
      reset();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [open, reset]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleBodyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    mutate(
      { title, body },
      {
        onSuccess: () => setSuccess(true),
      }
    );
  }

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl p-8 bg-bg-surface border border-border-base shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-fg-base font-semibold text-lg">Надіслати повідомлення</h3>
            <p className="text-fg-muted text-sm mt-0.5">
              Push-повідомлення буде відправлено всім користувачам
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-fg-subtle hover:text-fg-base bg-transparent border-none cursor-pointer text-lg leading-none ml-4 mt-0.5 transition-colors"
            aria-label="Закрити"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success-subtle">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-success-fg"
              >
                <path d="M5 13L9 17L19 7" />
              </svg>
            </div>
            <p className="text-fg-base font-medium">Повідомлення надіслано!</p>
            <Button variant="ghost" size="sm" onClick={onClose} className="mt-2">
              Закрити
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Заголовок повідомлення"
              type="text"
              placeholder="Введіть заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Textarea field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8125rem] font-medium text-fg-muted tracking-wide">
                Текст повідомлення
              </label>
              <textarea
                ref={textareaRef}
                placeholder="Введіть текст повідомлення"
                value={body}
                onChange={handleBodyChange}
                rows={3}
                required
                className="
                  w-full px-3.5 py-2.5 text-[0.9375rem]
                  text-fg-base bg-bg-surface rounded-lg
                  border border-border-strong
                  outline-none resize-none overflow-hidden
                  transition-colors duration-150
                  placeholder:text-fg-subtle
                  focus:border-accent-fg
                  min-h-20
                "
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg text-sm text-danger-fg bg-danger-subtle border border-danger-fg">
                Помилка при відправці. Спробуйте ще раз.
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
                disabled={isPending}
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                loading={isPending}
                disabled={!title.trim() || !body.trim()}
                className="flex-1"
              >
                {isPending ? "Надсилання…" : "Надіслати"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
