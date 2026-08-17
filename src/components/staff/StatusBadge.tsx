import type { SessionStatus } from "@/types/session";

const STATUS_STYLES: Record<SessionStatus, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-slate-100 text-slate-600",
  submitted: "bg-blue-100 text-blue-800",
};

const STATUS_LABELS: Record<SessionStatus, string> = {
  active: "Actively filling in",
  inactive: "Inactive",
  submitted: "Submitted",
};

export function StatusBadge({ status }: { status: SessionStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
