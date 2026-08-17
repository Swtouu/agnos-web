import { CheckCircle2, MinusCircle, PenLine } from "lucide-react";
import type { SessionStatus } from "@/types/session";

const STATUS_STYLES: Record<SessionStatus, string> = {
  active: "bg-success-bg text-success-fg",
  inactive: "bg-surface-muted text-muted-foreground",
  submitted: "bg-info-bg text-info-fg",
};

const STATUS_LABELS: Record<SessionStatus, string> = {
  active: "Actively filling in",
  inactive: "Inactive",
  submitted: "Submitted",
};

const STATUS_ICONS: Record<SessionStatus, typeof PenLine> = {
  active: PenLine,
  inactive: MinusCircle,
  submitted: CheckCircle2,
};

export function StatusBadge({ status }: { status: SessionStatus }) {
  const Icon = STATUS_ICONS[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      <Icon className="h-3 w-3" />
      {STATUS_LABELS[status]}
    </span>
  );
}
