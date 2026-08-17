import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { FormSection } from "@/components/ui/FormSection";
import { RELATIONSHIP_OPTIONS, type PatientFormValues } from "@/lib/validation/patient-form";

interface EmergencyContactFieldsProps {
  register: UseFormRegister<PatientFormValues>;
  errors: FieldErrors<PatientFormValues>;
  onFieldChange: () => void;
}

export function EmergencyContactFields({ register, errors, onFieldChange }: EmergencyContactFieldsProps) {
  return (
    <FormSection title="Emergency Contact (optional)">
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
    </FormSection>
  );
}
