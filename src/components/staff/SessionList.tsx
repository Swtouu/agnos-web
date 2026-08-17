"use client";

import { useMemo, useState } from "react";
import type { SessionState, SessionStatus } from "@/types/session";
import { SessionCard } from "./SessionCard";

const STATUS_FILTERS: Array<"all" | SessionStatus> = ["all", "active", "inactive", "submitted"];

interface SessionListProps {
  sessions: SessionState[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SessionList({ sessions, selectedId, onSelect }: SessionListProps) {
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
        <input
          type="search"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`rounded px-2 py-1 text-xs capitalize ${
                statusFilter === filter ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {filtered.length === 0 && <p className="text-sm text-slate-400">No sessions.</p>}
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
