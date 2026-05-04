import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "default" | "secondary" | "success" | "warning" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-950 text-white",
  secondary: "bg-blue-50 text-blue-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  outline: "border border-slate-200 bg-white text-slate-700",
};

export function Badge({
  children,
  className = "",
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
