import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[0.8125rem] font-medium text-fg-muted tracking-wide"
          >
            {label}
          </label>
        )}

        <input
          {...props}
          ref={ref}
          id={inputId}
          className={[
            "w-full px-3.5 py-2.5 text-[0.9375rem]",
            "text-fg-base bg-bg-surface rounded-lg",
            "border outline-none",
            "transition-colors duration-150",
            "placeholder:text-fg-subtle",
            error
              ? "border-danger-fg focus:border-danger-fg"
              : "border-border-strong focus:border-accent-fg",
            className,
          ].join(" ")}
        />

        {error && <span className="text-[0.8125rem] text-danger-fg">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
