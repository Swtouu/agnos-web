"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { FormSection } from "@/components/ui/FormSection";
import { useTranslations, useOptionLabel } from "@/lib/i18n/LocaleProvider";
import { RELATIONSHIP_OPTIONS, type PatientFormValues } from "@/lib/validation/patient-form";

interface EmergencyContactFieldsProps {
  register: UseFormRegister<PatientFormValues>;
  errors: FieldErrors<PatientFormValues>;
  onFieldChange: () => void;
}

export function EmergencyContactFields({ register, errors, onFieldChange }: EmergencyContactFieldsProps) {
  const t = useTranslations();
  const getOptionLabel = useOptionLabel();

  return (
    <FormSection title={t("patientForm.sections.emergencyContact")}>
      <TextField
        label={t("patientForm.fields.emergencyContactName")}
        optional
        error={errors.emergencyContact?.name?.message}
        {...register("emergencyContact.name", { onChange: onFieldChange })}
      />
      <SelectField
        label={t("patientForm.fields.emergencyContactRelationship")}
        optional
        options={RELATIONSHIP_OPTIONS}
        getOptionLabel={(value) => getOptionLabel("relationship", value)}
        error={errors.emergencyContact?.relationship?.message}
        {...register("emergencyContact.relationship", { onChange: onFieldChange })}
      />
    </FormSection>
  );
}
