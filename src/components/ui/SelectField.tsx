import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  optional?: boolean;
  options: readonly string[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, optional, options, placeholder, className, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">
          {label} {optional && <span className="font-normal text-slate-400">(optional)</span>}
        </span>
        <select
          ref={ref}
          className={`rounded border bg-white px-3 py-2 ${error ? "border-red-500" : "border-slate-300"} ${className ?? ""}`}
          {...props}
        >
          <option value="">{placeholder ?? "Select..."}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </label>
    );
  }
);
SelectField.displayName = "SelectField";
