import { ArrowLeft } from "lucide-react";
import type { SessionState } from "@/types/session";
import { StatusBadge } from "./StatusBadge";

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

function Group({ title, children }: { title?: string; children: React.ReactNode }) {
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
  const d = session.data;
  const name = [d.firstName, d.lastName].filter(Boolean).join(" ") || "Unnamed patient";

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
            Back
          </button>
        )}
        <h2 className="hidden text-lg font-semibold text-foreground sm:block">{name}</h2>
        <StatusBadge status={session.status} />
      </div>

      <Group>
        <Field label="First Name" value={d.firstName} />
        <Field label="Middle Name" value={d.middleName} />
        <Field label="Last Name" value={d.lastName} />
        <Field label="Date of Birth" value={d.dateOfBirth} />
        <Field label="Gender" value={d.gender} />
        <Field label="Nationality" value={d.nationality} />
        <Field label="Preferred Language" value={d.preferredLanguage} />
        <Field label="Religion" value={d.religion} />
        <Field label="Phone Number" value={d.phoneNumber} />
        <Field label="Email" value={d.email} />
      </Group>

      {d.address && (
        <Group title="Address">
          <Field label="House No. / Street" value={d.address.houseNoStreet} />
          <Field label="Sub-district" value={d.address.subDistrict} />
          <Field label="District" value={d.address.district} />
          <Field label="Province" value={d.address.province} />
          <Field label="Postal Code" value={d.address.postalCode} />
        </Group>
      )}

      {d.emergencyContact && (
        <Group title="Emergency Contact">
          <Field label="Name" value={d.emergencyContact.name} />
          <Field label="Relationship" value={d.emergencyContact.relationship} />
        </Group>
      )}
    </div>
  );
}
