import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className, id, required, ...props }, ref) => {
    return (
      <div className={cn("flex w-full flex-col gap-1.5", className)}>
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none text-slate-900"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <input
          id={id}
          className={cn(
            "flex h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
