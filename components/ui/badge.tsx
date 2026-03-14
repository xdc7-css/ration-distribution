import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "destructive" | "secondary";
};

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-violet-100 text-violet-700 border-violet-200",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    destructive: "bg-red-100 text-red-700 border-red-200",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
}