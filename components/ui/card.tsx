import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: DivProps) {
  return (
    <div
      className={`rounded-[28px] border border-slate-200/70 bg-white/85 shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: DivProps) {
  return <div className={`p-5 sm:p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: DivProps) {
  return (
    <h3
      className={`text-lg font-bold text-slate-900 sm:text-xl ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }: DivProps) {
  return (
    <p
      className={`mt-1 text-sm text-slate-500 ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={`px-5 pb-5 sm:px-6 sm:pb-6 ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }: DivProps) {
  return <div className={`p-5 pt-0 sm:p-6 sm:pt-0 ${className}`} {...props} />;
}