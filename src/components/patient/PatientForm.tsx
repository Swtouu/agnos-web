"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { FormSection } from "@/components/ui/FormSection";
import { AddressFields } from "./AddressFields";
import { EmergencyContactFields } from "./EmergencyContactFields";
import { ReconnectBanner } from "./ReconnectBanner";
import { useSessionId } from "@/lib/socket/use-session-id";
import { usePatientSession } from "@/lib/socket/use-patient-session";
import { useTranslations, useOptionLabel } from "@/lib/i18n/LocaleProvider";
import {
  GENDER_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
  RELIGION_OPTIONS,
  patientFormSchema,
  type PatientFormValues,
} from "@/lib/validation/patient-form";
import { COUNTRY_NAMES } from "@/lib/data/countries";
import type { PatientField } from "@/types/session";

export function PatientForm() {
  const t = useTranslations();
  const getOptionLabel = useOptionLabel();
  const sessionId = useSessionId("/patient");
  const { connected, emitFieldUpdate, submit } = usePatientSession(sessionId);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      middleName: "",
    },
  });

  const syncField = useCallback(
    (field: PatientField) => emitFieldUpdate(field, getValues(field)),
    [emitFieldUpdate, getValues]
  );

  async function onValid(data: PatientFormValues) {
    setSubmitError(null);
    const ack = await submit(data);
    if (ack.ok) {
      setSubmitted(true);
    } else {
      setSubmitError(ack.error ? t(ack.error) : t("patientForm.submitFailedFallback"));
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success-fg">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h2 className="text-lg font-semibold text-foreground">{t("patientForm.thankYouTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("patientForm.thankYouBody")}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("patientForm.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("patientForm.subtitle")}</p>
      </div>

      <ReconnectBanner connected={connected} />

      <FormSection title={t("patientForm.sections.name")} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField
          label={t("patientForm.fields.firstName")}
          error={errors.firstName?.message}
          {...register("firstName", { onChange: () => syncField("firstName") })}
        />
        <TextField
          label={t("patientForm.fields.middleName")}
          optional
          error={errors.middleName?.message}
          {...register("middleName", { onChange: () => syncField("middleName") })}
        />
        <TextField
          label={t("patientForm.fields.lastName")}
          error={errors.lastName?.message}
          {...register("lastName", { onChange: () => syncField("lastName") })}
        />
      </FormSection>

      <FormSection title={t("patientForm.sections.personalDetails")}>
        <TextField
          type="date"
          label={t("patientForm.fields.dateOfBirth")}
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth", { onChange: () => syncField("dateOfBirth") })}
        />
        <SelectField
          label={t("patientForm.fields.gender")}
          options={GENDER_OPTIONS}
          getOptionLabel={(value) => getOptionLabel("gender", value)}
          error={errors.gender?.message}
          {...register("gender", { onChange: () => syncField("gender") })}
        />
        <SelectField
          label={t("patientForm.fields.nationality")}
          options={COUNTRY_NAMES}
          error={errors.nationality?.message}
          {...register("nationality", { onChange: () => syncField("nationality") })}
        />
        <SelectField
          label={t("patientForm.fields.preferredLanguage")}
          options={PREFERRED_LANGUAGE_OPTIONS}
          getOptionLabel={(value) => getOptionLabel("preferredLanguage", value)}
          error={errors.preferredLanguage?.message}
          {...register("preferredLanguage", { onChange: () => syncField("preferredLanguage") })}
        />
        <SelectField
          label={t("patientForm.fields.religion")}
          optional
          options={RELIGION_OPTIONS}
          getOptionLabel={(value) => getOptionLabel("religion", value)}
          error={errors.religion?.message}
          {...register("religion", { onChange: () => syncField("religion") })}
        />
      </FormSection>

      <FormSection title={t("patientForm.sections.contact")}>
        <TextField
          type="tel"
          label={t("patientForm.fields.phoneNumber")}
          placeholder="0812345678"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber", { onChange: () => syncField("phoneNumber") })}
        />
        <TextField
          type="email"
          label={t("patientForm.fields.email")}
          error={errors.email?.message}
          {...register("email", { onChange: () => syncField("email") })}
        />
      </FormSection>

      <AddressFields
        register={register}
        setValue={setValue}
        watch={watch}
        errors={errors}
        onFieldChange={() => syncField("address")}
      />

      <EmergencyContactFields
        register={register}
        errors={errors}
        onFieldChange={() => syncField("emergencyContact")}
      />

      {submitError && (
        <p className="rounded-lg bg-danger-bg px-4 py-2 text-sm text-danger-fg" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t("patientForm.submitting") : t("patientForm.submit")}
      </button>

      {sessionId && (
        <p className="text-center text-xs text-muted-foreground">
          {t("patientForm.sessionLabel")}: {sessionId}
        </p>
      )}
    </form>
  );
}
