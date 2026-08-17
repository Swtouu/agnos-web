import { forwardRef, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, optional, className, readOnly, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">
          {label} {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
        </span>
        <input
          ref={ref}
          readOnly={readOnly}
          className={`rounded-lg border px-3 py-2 text-foreground outline-none transition-colors ${
            readOnly ? "border-border bg-surface-muted text-muted-foreground" : "bg-surface"
          } ${
            error
              ? "border-danger-fg focus:ring-2 focus:ring-danger-fg/40"
              : "border-border focus:border-ring focus:ring-2 focus:ring-ring/30"
          } ${className ?? ""}`}
          {...props}
        />
        {error && <span className="text-xs text-danger-fg">{error}</span>}
      </label>
    );
  }
);
TextField.displayName = "TextField";
