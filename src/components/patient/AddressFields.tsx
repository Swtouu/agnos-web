"use client";

import { useMemo, useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { TextField } from "@/components/ui/TextField";
import { FormSection } from "@/components/ui/FormSection";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import type { PatientFormValues } from "@/lib/validation/patient-form";
import { THAI_ADDRESS_DATA, type ThaiAddressRow } from "@/lib/data/thai-address";

interface AddressFieldsProps {
  register: UseFormRegister<PatientFormValues>;
  setValue: UseFormSetValue<PatientFormValues>;
  watch: UseFormWatch<PatientFormValues>;
  errors: FieldErrors<PatientFormValues>;
  onFieldChange: () => void;
}

const MAX_SUGGESTIONS = 8;

// Sub-district drives the cascade (unique key — postal codes alone aren't); the other three stay read-only once filled.
export function AddressFields({ register, setValue, watch, errors, onFieldChange }: AddressFieldsProps) {
  const t = useTranslations();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const subDistrict = watch("address.subDistrict") || "";
  const district = watch("address.district") || "";
  const province = watch("address.province") || "";
  const postalCode = watch("address.postalCode") || "";

  const suggestions = useMemo(() => {
    const query = subDistrict.trim();
    if (!query) return [];
    return THAI_ADDRESS_DATA.filter((row) => row.subdistrict.includes(query)).slice(0, MAX_SUGGESTIONS);
  }, [subDistrict]);

  function handleSubDistrictChange(value: string) {
    setValue("address.subDistrict", value, { shouldValidate: true });
    if (district || province || postalCode) {
      setValue("address.district", "");
      setValue("address.province", "");
      setValue("address.postalCode", "");
    }
    setShowSuggestions(true);
    onFieldChange();
  }

  function selectSuggestion(row: ThaiAddressRow) {
    setValue("address.subDistrict", row.subdistrict, { shouldValidate: true });
    setValue("address.district", row.district, { shouldValidate: true });
    setValue("address.province", row.province, { shouldValidate: true });
    setValue("address.postalCode", row.zipcode, { shouldValidate: true });
    setShowSuggestions(false);
    onFieldChange();
  }

  return (
    <FormSection title={t("patientForm.sections.address")}>
      <div className="sm:col-span-2">
        <TextField
          label={t("patientForm.fields.houseNoStreet")}
          error={errors.address?.houseNoStreet?.message}
          {...register("address.houseNoStreet", { onChange: onFieldChange })}
        />
      </div>

      <div className="relative flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">{t("patientForm.fields.subDistrict")}</span>
        <input
          type="text"
          className={`rounded-lg border bg-surface px-3 py-2 text-foreground outline-none transition-colors ${
            errors.address?.subDistrict
              ? "border-danger-fg focus:ring-2 focus:ring-danger-fg/40"
              : "border-border focus:border-ring focus:ring-2 focus:ring-ring/30"
          }`}
          value={subDistrict}
          placeholder={t("patientForm.fields.subDistrictPlaceholder")}
          onChange={(e) => handleSubDistrictChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        {errors.address?.subDistrict && (
          <span className="text-xs text-danger-fg">{t(errors.address.subDistrict.message ?? "")}</span>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
            {suggestions.map((row, i) => (
              <li key={`${row.subdistrict}-${row.district}-${row.zipcode}-${i}`}>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-surface-muted"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(row)}
                >
                  {row.subdistrict} · {row.district} · {row.province} · {row.zipcode}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <TextField
        label={t("patientForm.fields.district")}
        value={district}
        readOnly
        error={errors.address?.district?.message}
      />
      <TextField
        label={t("patientForm.fields.province")}
        value={province}
        readOnly
        error={errors.address?.province?.message}
      />
      <TextField
        label={t("patientForm.fields.postalCode")}
        value={postalCode}
        readOnly
        error={errors.address?.postalCode?.message}
      />
    </FormSection>
  );
}
