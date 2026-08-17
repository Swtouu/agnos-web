import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { RELATIONSHIP_OPTIONS, type PatientFormValues } from "@/lib/validation/patient-form";

interface EmergencyContactFieldsProps {
  register: UseFormRegister<PatientFormValues>;
  errors: FieldErrors<PatientFormValues>;
  onFieldChange: () => void;
}

export function EmergencyContactFields({ register, errors, onFieldChange }: EmergencyContactFieldsProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="font-medium text-slate-800">Emergency Contact (optional)</legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          label="Name"
          optional
          error={errors.emergencyContact?.name?.message}
          {...register("emergencyContact.name", { onChange: onFieldChange })}
        />
        <SelectField
          label="Relationship"
          optional
          options={RELATIONSHIP_OPTIONS}
          error={errors.emergencyContact?.relationship?.message}
          {...register("emergencyContact.relationship", { onChange: onFieldChange })}
        />
      </div>
    </fieldset>
  );
}
