"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getToasts, remove, subscribe, type Toast } from "@/lib/toast";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />,
  error: <XCircle size={18} className="shrink-0 text-red-500" />,
  info: <Info size={18} className="shrink-0 text-blue-500" />,
};

const styles = {
  success: "border-emerald-100 bg-white",
  error: "border-red-100 bg-white",
  info: "border-blue-100 bg-white",
};

function ToastItem({ toast }: { toast: Toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-slate-200/60 transition-all duration-300",
        styles[toast.type],
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium leading-snug text-slate-800">
        {toast.message}
      </p>
      <button
        onClick={() => remove(toast.id)}
        className="mt-0.5 shrink-0 rounded-lg p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>(getToasts);

  useEffect(() => subscribe(setToasts), []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
