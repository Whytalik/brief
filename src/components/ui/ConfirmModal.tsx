"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Підтвердити",
  cancelLabel = "Скасувати",
  variant = "primary",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in-95 w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl duration-200">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl",
              variant === "danger" ? "bg-red-50" : "bg-slate-100",
            )}
          >
            {variant === "danger" ? (
              <Trash2 size={24} className="text-red-500" />
            ) : (
              <AlertTriangle size={24} className="text-slate-600" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
