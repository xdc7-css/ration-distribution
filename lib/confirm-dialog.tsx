"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "delete" | "freeze" | "edit";
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "edit",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClass =
    variant === "delete"
      ? "bg-red-600 hover:bg-red-700"
      : variant === "freeze"
      ? "bg-sky-600 hover:bg-sky-700"
      : "bg-amber-500 hover:bg-amber-600";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold text-white transition ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}