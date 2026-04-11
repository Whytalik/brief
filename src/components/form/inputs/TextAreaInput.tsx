import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextAreaInputProps
>(({ label, error, className, id, required, ...props }, ref) => {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
});

TextAreaInput.displayName = "TextAreaInput";
