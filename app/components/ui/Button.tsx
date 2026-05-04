import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "secondary" | "outline" | "success" | "destructive";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-slate-950 text-white hover:bg-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.16)]",
  secondary:
    "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_10px_24px_rgba(37,99,235,0.18)]",
  outline:
    "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_10px_24px_rgba(5,150,105,0.18)]",
  destructive:
    "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_10px_24px_rgba(245,158,11,0.18)]",
};

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
