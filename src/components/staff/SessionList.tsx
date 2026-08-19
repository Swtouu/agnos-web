"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { SessionState, SessionStatus } from "@/types/session";
import { SessionCard } from "./SessionCard";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

const STATUS_FILTERS: Array<"all" | SessionStatus> = ["all", "active", "inactive", "submitted"];
const FILTER_LABEL_KEYS: Record<"all" | SessionStatus, string> = {
  all: "staff.filterAll",
  active: "staff.filterActive",
  inactive: "staff.filterInactive",
  submitted: "staff.filterSubmitted",
};

interface SessionListProps {
  sessions: SessionState[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SessionList({ sessions, selectedId, onSelect }: SessionListProps) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SessionStatus>("all");

  const filtered = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return sessions.filter((session) => {
      if (statusFilter !== "all" && session.status !== statusFilter) return false;
      if (!lowerQuery) return true;
      const name = `${session.data.firstName ?? ""} ${session.data.lastName ?? ""}`.toLowerCase();
      return name.includes(lowerQuery);
    });
  }, [sessions, query, statusFilter]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={t("staff.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(FILTER_LABEL_KEYS[filter])}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {filtered.length === 0 && <p className="px-1 text-sm text-muted-foreground">{t("staff.noSessions")}</p>}
        {filtered.map((session) => (
          <SessionCard
            key={session.sessionId}
            session={session}
            selected={session.sessionId === selectedId}
            onSelect={() => onSelect(session.sessionId)}
          />
        ))}
      </div>
    </div>
  );
}
