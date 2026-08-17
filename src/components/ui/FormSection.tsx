import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <legend className="px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </legend>
      <div className={className ?? "grid grid-cols-1 gap-4 sm:grid-cols-2"}>{children}</div>
    </fieldset>
  );
}
