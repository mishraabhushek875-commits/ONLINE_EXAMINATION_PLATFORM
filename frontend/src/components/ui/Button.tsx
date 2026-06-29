import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
}

const VARIANTS: Record<string, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary: "bg-violet-500 text-white hover:bg-violet-600",
  outline: "border border-ink-200 text-ink-700 hover:bg-ink-50",
  danger: "bg-rose-500 text-white hover:bg-rose-600",
};

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
