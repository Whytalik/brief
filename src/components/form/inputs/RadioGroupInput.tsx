"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupInputProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export function RadioGroupInput({
  label,
  options,
  value,
  onChange,
  error,
  required,
  className,
}: RadioGroupInputProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label className="text-sm font-medium leading-none text-slate-950">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors duration-150",
                isSelected
                  ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
