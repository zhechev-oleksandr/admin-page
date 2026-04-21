import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '@shared/ui';

type Variant = 'primary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-accent hover:bg-accent-hover text-fg-on-accent',
  danger: 'bg-danger hover:bg-danger-hover text-fg-on-accent',
  ghost: 'bg-transparent hover:bg-bg-subtle text-fg-base',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-[0.9375rem]',
  lg: 'px-5 py-3 text-base',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-semibold rounded-lg border-none',
        'transition-colors duration-150 cursor-pointer',
        'disabled:opacity-55 disabled:cursor-not-allowed',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
    >
      {loading && <Spinner/>}
      {children}
    </button>
  );
};
