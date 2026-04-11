import { cn } from "@/lib/utils";
import React from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "mb-10 space-y-4 border-b border-slate-200 pb-8 last:border-0 last:pb-0",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        )}
      </div>
      <div className="pt-2">{children}</div>
    </section>
  );
}
