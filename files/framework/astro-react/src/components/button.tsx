import './button.css';
import type { MouseEventHandler, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link';

type ButtonProps = {
  variant?: ButtonVariant;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: MouseEventHandler;
  children: ReactNode;
};

export function Button({
  variant = 'secondary',
  href,
  type = 'button',
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  const className = `btn btn-${variant}`;

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={className}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
}
