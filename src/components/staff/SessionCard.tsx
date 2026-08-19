"use client";

import type { SessionState } from "@/types/session";
import { StatusBadge } from "./StatusBadge";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

interface SessionCardProps {
  session: SessionState;
  selected: boolean;
  onSelect: () => void;
}

export function SessionCard({ session, selected, onSelect }: SessionCardProps) {
  const t = useTranslations();
  const name = [session.data.firstName, session.data.lastName].filter(Boolean).join(" ") || t("staff.unnamedPatient");

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col gap-1.5 rounded-xl border px-3.5 py-3 text-left transition-colors ${
        selected
          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/30"
          : "border-border bg-surface hover:bg-surface-muted"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium text-foreground">{name}</span>
        <StatusBadge status={session.status} />
      </div>
      <span className="text-xs text-muted-foreground">
        {t("staff.sessionPrefix")} {session.sessionId.slice(0, 8)}
      </span>
    </button>
  );
}
