"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
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
      <div className="mx-auto flex max-w-md flex-col items-center gap-2 rounded border border-green-300 bg-green-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-green-800">Thank you</h2>
        <p className="text-sm text-green-700">Your information has been submitted to staff.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
      <h1 className="text-xl font-semibold text-slate-900">Patient Intake Form</h1>
      <ReconnectBanner connected={connected} />

      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <legend className="font-medium text-slate-800">Name</legend>
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
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <legend className="font-medium text-slate-800">Personal Details</legend>
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
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <legend className="font-medium text-slate-800">Contact</legend>
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
      </fieldset>

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
        <p className="rounded bg-red-100 px-4 py-2 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {sessionId && <p className="text-center text-xs text-slate-400">Session: {sessionId}</p>}
    </form>
  );
}
