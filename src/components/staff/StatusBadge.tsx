"use client";

import { CheckCircle2, MinusCircle, PenLine } from "lucide-react";
import type { SessionStatus } from "@/types/session";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

const STATUS_STYLES: Record<SessionStatus, string> = {
  active: "bg-success-bg text-success-fg",
  inactive: "bg-surface-muted text-muted-foreground",
  submitted: "bg-info-bg text-info-fg",
};

const STATUS_LABEL_KEYS: Record<SessionStatus, string> = {
  active: "staff.statusActive",
  inactive: "staff.statusInactive",
  submitted: "staff.statusSubmitted",
};

const STATUS_ICONS: Record<SessionStatus, typeof PenLine> = {
  active: PenLine,
  inactive: MinusCircle,
  submitted: CheckCircle2,
};

export function StatusBadge({ status }: { status: SessionStatus }) {
  const t = useTranslations();
  const Icon = STATUS_ICONS[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      <Icon className="h-3 w-3" />
      {t(STATUS_LABEL_KEYS[status])}
    </span>
  );
}
