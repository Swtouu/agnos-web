import { forwardRef, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, optional, className, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">
          {label} {optional && <span className="font-normal text-slate-400">(optional)</span>}
        </span>
        <input
          ref={ref}
          className={`rounded border px-3 py-2 ${error ? "border-red-500" : "border-slate-300"} ${className ?? ""}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </label>
    );
  }
);
TextField.displayName = "TextField";
