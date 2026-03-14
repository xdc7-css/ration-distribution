import * as React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";