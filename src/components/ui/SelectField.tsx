import { forwardRef, type SelectHTMLAttributes } from "react";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  optional?: boolean;
  options: readonly string[];
  placeholder?: string;
  // Options are stored/validated as stable English values — this only translates the displayed label.
  getOptionLabel?: (value: string) => string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, optional, options, placeholder, getOptionLabel, className, ...props }, ref) => {
    const t = useTranslations();
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">
          {label} {optional && <span className="font-normal text-muted-foreground">{t("patientForm.optional")}</span>}
        </span>
        <select
          ref={ref}
          className={`rounded-lg border bg-surface px-3 py-2 text-foreground outline-none transition-colors ${
            error
              ? "border-danger-fg focus:ring-2 focus:ring-danger-fg/40"
              : "border-border focus:border-ring focus:ring-2 focus:ring-ring/30"
          } ${className ?? ""}`}
          {...props}
        >
          <option value="">{placeholder ?? t("patientForm.selectPlaceholder")}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {getOptionLabel ? getOptionLabel(option) : option}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-danger-fg">{t(error)}</span>}
      </label>
    );
  }
);
SelectField.displayName = "SelectField";
