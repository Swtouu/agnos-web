"use client";

import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import type { SessionState } from "@/types/session";
import { StatusBadge } from "./StatusBadge";
import { useTranslations, useOptionLabel } from "@/lib/i18n/LocaleProvider";

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

function Group({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      {title && <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

interface SessionDetailProps {
  session: SessionState;
  onBack?: () => void;
}

export function SessionDetail({ session, onBack }: SessionDetailProps) {
  const t = useTranslations();
  const getOptionLabel = useOptionLabel();
  const d = session.data;
  const name = [d.firstName, d.lastName].filter(Boolean).join(" ") || t("staff.unnamedPatient");

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary sm:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("staff.back")}
          </button>
        )}
        <h2 className="hidden text-lg font-semibold text-foreground sm:block">{name}</h2>
        <StatusBadge status={session.status} />
      </div>

      <Group>
        <Field label={t("patientForm.fields.firstName")} value={d.firstName} />
        <Field label={t("patientForm.fields.middleName")} value={d.middleName} />
        <Field label={t("patientForm.fields.lastName")} value={d.lastName} />
        <Field label={t("patientForm.fields.dateOfBirth")} value={d.dateOfBirth} />
        <Field label={t("patientForm.fields.gender")} value={d.gender && getOptionLabel("gender", d.gender)} />
        <Field label={t("patientForm.fields.nationality")} value={d.nationality} />
        <Field
          label={t("patientForm.fields.preferredLanguage")}
          value={d.preferredLanguage && getOptionLabel("preferredLanguage", d.preferredLanguage)}
        />
        <Field label={t("patientForm.fields.religion")} value={d.religion && getOptionLabel("religion", d.religion)} />
        <Field label={t("patientForm.fields.phoneNumber")} value={d.phoneNumber} />
        <Field label={t("patientForm.fields.email")} value={d.email} />
      </Group>

      {d.address && (
        <Group title={t("staff.addressSection")}>
          <Field label={t("patientForm.fields.houseNoStreet")} value={d.address.houseNoStreet} />
          <Field label={t("patientForm.fields.subDistrict")} value={d.address.subDistrict} />
          <Field label={t("patientForm.fields.district")} value={d.address.district} />
          <Field label={t("patientForm.fields.province")} value={d.address.province} />
          <Field label={t("patientForm.fields.postalCode")} value={d.address.postalCode} />
        </Group>
      )}

      {d.emergencyContact && (
        <Group title={t("staff.emergencyContactSection")}>
          <Field label={t("patientForm.fields.emergencyContactName")} value={d.emergencyContact.name} />
          <Field
            label={t("patientForm.fields.emergencyContactRelationship")}
            value={
              d.emergencyContact.relationship && getOptionLabel("relationship", d.emergencyContact.relationship)
            }
          />
        </Group>
      )}
    </div>
  );
}
