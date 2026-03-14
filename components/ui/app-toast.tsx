"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type AppToastProps = {
  open: boolean;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export function AppToast({
  open,
  title,
  description,
  type = "info",
  onClose,
}: AppToastProps) {
  if (!open) return null;

  const styles =
    type === "success"
      ? {
          wrap: "border-emerald-200 bg-emerald-50",
          icon: "text-emerald-600",
          title: "text-emerald-800",
          desc: "text-emerald-700",
        }
      : type === "error"
      ? {
          wrap: "border-red-200 bg-red-50",
          icon: "text-red-600",
          title: "text-red-800",
          desc: "text-red-700",
        }
      : {
          wrap: "border-violet-200 bg-violet-50",
          icon: "text-violet-600",
          title: "text-violet-800",
          desc: "text-violet-700",
        };

  return (
    <div className="fixed left-4 top-4 z-[110] w-full max-w-sm">
      <div
        className={`rounded-[24px] border px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur ${styles.wrap}`}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${styles.icon}`}>
            {type === "success" ? (
              <CheckCircle2 className="size-5" />
            ) : type === "error" ? (
              <AlertCircle className="size-5" />
            ) : (
              <Info className="size-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className={`text-sm font-extrabold ${styles.title}`}>{title}</p>
            {description ? (
              <p className={`mt-1 text-sm leading-6 ${styles.desc}`}>
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-white/70 hover:text-slate-800"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}