import * as React from "react";

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
type SectionProps = React.HTMLAttributes<HTMLTableSectionElement>;
type RowProps = React.HTMLAttributes<HTMLTableRowElement>;
type CellProps = React.ThHTMLAttributes<HTMLTableCellElement>;
type TDProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export function Table({ className = "", ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-[24px] border border-slate-200/70 bg-white">
      <table className={`w-full min-w-[760px] text-sm ${className}`} {...props} />
    </div>
  );
}

export function THead({ className = "", ...props }: SectionProps) {
  return <thead className={`bg-slate-50 ${className}`} {...props} />;
}

export function TBody({ className = "", ...props }: SectionProps) {
  return <tbody className={className} {...props} />;
}

export function TR({ className = "", ...props }: RowProps) {
  return (
    <tr
      className={`border-b border-slate-200 last:border-b-0 ${className}`}
      {...props}
    />
  );
}

export function TH({ className = "", ...props }: CellProps) {
  return (
    <th
      className={`px-4 py-4 text-right font-semibold text-slate-600 ${className}`}
      {...props}
    />
  );
}

export function TD({ className = "", ...props }: TDProps) {
  return (
    <td
      className={`px-4 py-4 align-middle text-slate-700 ${className}`}
      {...props}
    />
  );
}