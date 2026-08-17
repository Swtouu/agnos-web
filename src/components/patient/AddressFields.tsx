"use client";

import { useMemo, useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { TextField } from "@/components/ui/TextField";
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

// Sub-district drives the cascade — it's the dataset's unique key (postal codes alone
// aren't unique per sub-district in Thailand). District/Province/Postal Code are
// read-only once filled, so the address can't end up internally inconsistent (Q19-20).
export function AddressFields({ register, setValue, watch, errors, onFieldChange }: AddressFieldsProps) {
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
    <fieldset className="flex flex-col gap-3">
      <legend className="font-medium text-slate-800">Address</legend>
      <TextField
        label="House No. / Street"
        error={errors.address?.houseNoStreet?.message}
        {...register("address.houseNoStreet", { onChange: onFieldChange })}
      />

      <div className="relative flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Sub-district (Tambon)</span>
        <input
          type="text"
          className={`rounded border px-3 py-2 ${
            errors.address?.subDistrict ? "border-red-500" : "border-slate-300"
          }`}
          value={subDistrict}
          placeholder="พิมพ์ชื่อตำบล..."
          onChange={(e) => handleSubDistrictChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        {errors.address?.subDistrict && (
          <span className="text-xs text-red-600">{errors.address.subDistrict.message}</span>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full z-10 mt-1 max-h-56 w-full overflow-y-auto rounded border border-slate-300 bg-white shadow-lg">
            {suggestions.map((row, i) => (
              <li key={`${row.subdistrict}-${row.district}-${row.zipcode}-${i}`}>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TextField
          label="District (Amphoe)"
          value={district}
          readOnly
          error={errors.address?.district?.message}
        />
        <TextField
          label="Province (Changwat)"
          value={province}
          readOnly
          error={errors.address?.province?.message}
        />
        <TextField
          label="Postal Code"
          value={postalCode}
          readOnly
          error={errors.address?.postalCode?.message}
        />
      </div>
    </fieldset>
  );
}
