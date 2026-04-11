"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

export interface TelInputProps {
  label: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const TelInput = forwardRef<HTMLInputElement, TelInputProps>(
  (
    {
      label,
      error,
      value,
      onChange,
      onBlur,
      name,
      id,
      required,
      placeholder,
      className,
    },
    ref,
  ) => {
    return (
      <div className={cn("flex w-full flex-col gap-1.5", className)}>
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none text-slate-900"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <IMaskInput
          mask="+380 (00) 000-00-00"
          value={value}
          unmask={true} // return unmasked value
          onAccept={(value: string) => onChange?.(value)}
          onBlur={onBlur}
          inputRef={(el) => {
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          name={name}
          id={id}
          placeholder={placeholder || "+380 (__) ___-__-__"}
          className={cn(
            "flex h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
          )}
        />
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      </div>
    );
  },
);

TelInput.displayName = "TelInput";
