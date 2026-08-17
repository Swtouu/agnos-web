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
      setSubmitError(ack.error ?? "Submission failed — please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success-fg">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h2 className="text-lg font-semibold text-foreground">Thank you</h2>
          <p className="text-sm text-muted-foreground">Your information has been submitted to staff.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Patient Intake Form</h1>
        <p className="text-sm text-muted-foreground">Your answers sync to the front desk as you type.</p>
      </div>

      <ReconnectBanner connected={connected} />

      <FormSection title="Name" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField
          label="First Name"
          error={errors.firstName?.message}
          {...register("firstName", { onChange: () => syncField("firstName") })}
        />
        <TextField
          label="Middle Name"
          optional
          error={errors.middleName?.message}
          {...register("middleName", { onChange: () => syncField("middleName") })}
        />
        <TextField
          label="Last Name"
          error={errors.lastName?.message}
          {...register("lastName", { onChange: () => syncField("lastName") })}
        />
      </FormSection>

      <FormSection title="Personal Details">
        <TextField
          type="date"
          label="Date of Birth"
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth", { onChange: () => syncField("dateOfBirth") })}
        />
        <SelectField
          label="Gender"
          options={GENDER_OPTIONS}
          error={errors.gender?.message}
          {...register("gender", { onChange: () => syncField("gender") })}
        />
        <SelectField
          label="Nationality"
          options={COUNTRY_NAMES}
          error={errors.nationality?.message}
          {...register("nationality", { onChange: () => syncField("nationality") })}
        />
        <SelectField
          label="Preferred Language"
          options={PREFERRED_LANGUAGE_OPTIONS}
          error={errors.preferredLanguage?.message}
          {...register("preferredLanguage", { onChange: () => syncField("preferredLanguage") })}
        />
        <SelectField
          label="Religion"
          optional
          options={RELIGION_OPTIONS}
          error={errors.religion?.message}
          {...register("religion", { onChange: () => syncField("religion") })}
        />
      </FormSection>

      <FormSection title="Contact">
        <TextField
          type="tel"
          label="Phone Number"
          placeholder="0812345678"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber", { onChange: () => syncField("phoneNumber") })}
        />
        <TextField
          type="email"
          label="Email"
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
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {sessionId && <p className="text-center text-xs text-muted-foreground">Session: {sessionId}</p>}
    </form>
  );
}
