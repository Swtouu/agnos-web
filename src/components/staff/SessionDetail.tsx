import type { SessionState } from "@/types/session";
import { StatusBadge } from "./StatusBadge";

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm text-slate-900">{value || "—"}</span>
    </div>
  );
}

interface SessionDetailProps {
  session: SessionState;
  onBack?: () => void;
}

export function SessionDetail({ session, onBack }: SessionDetailProps) {
  const d = session.data;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        {onBack && (
          <button type="button" onClick={onBack} className="text-sm text-blue-600 sm:hidden">
            ← Back
          </button>
        )}
        <StatusBadge status={session.status} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
      </div>

      {d.address && (
        <div>
          <h3 className="mb-1 text-sm font-medium text-slate-700">Address</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="House No. / Street" value={d.address.houseNoStreet} />
            <Field label="Sub-district" value={d.address.subDistrict} />
            <Field label="District" value={d.address.district} />
            <Field label="Province" value={d.address.province} />
            <Field label="Postal Code" value={d.address.postalCode} />
          </div>
        </div>
      )}

      {d.emergencyContact && (
        <div>
          <h3 className="mb-1 text-sm font-medium text-slate-700">Emergency Contact</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Name" value={d.emergencyContact.name} />
            <Field label="Relationship" value={d.emergencyContact.relationship} />
          </div>
        </div>
      )}
    </div>
  );
}
