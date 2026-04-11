"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
  error?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({
  label,
  options,
  value = [],
  onChange,
  error,
  required,
  className,
  placeholder = "Оберіть варіанти...",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const removeOption = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== optionValue));
  };

  const selectedOptions = options.filter((o) => value.includes(o.value));

  return (
    <div
      className={cn("relative flex w-full flex-col gap-1.5", className)}
      ref={containerRef}
    >
      <label className="text-sm font-medium leading-none text-slate-900">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div
        className={cn(
          "flex min-h-[3rem] w-full cursor-pointer flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 transition-colors focus-within:border-slate-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-200",
          error && "border-red-500",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {option.label}
                <X
                  className="h-3 w-3 cursor-pointer text-slate-500 transition hover:text-slate-900"
                  onClick={(e) => removeOption(e, option.value)}
                />
              </span>
            ))
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-60 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="max-h-60 overflow-auto p-1">
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-xl py-2 pl-10 pr-3 text-sm text-slate-800 transition hover:bg-slate-100",
                    isSelected && "bg-slate-100 font-medium",
                  )}
                  onClick={() => toggleOption(option.value)}
                >
                  <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
                    {isSelected && <Check className="h-4 w-4 text-slate-900" />}
                  </span>
                  {option.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
