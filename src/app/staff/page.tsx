"use client";

import { useState } from "react";
import { useStaffSessions } from "@/lib/socket/use-staff-sessions";
import { SessionList } from "@/components/staff/SessionList";
import { SessionDetail } from "@/components/staff/SessionDetail";

export default function StaffPage() {
  const sessions = useStaffSessions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = sessions.find((s) => s.sessionId === selectedId) ?? null;

  return (
    <main className="flex h-screen flex-col sm:flex-row">
      <div
        className={`w-full border-slate-200 p-4 sm:block sm:w-80 sm:border-r ${selected ? "hidden" : "block"}`}
      >
        <h1 className="mb-3 text-lg font-semibold">Staff Dashboard</h1>
        <SessionList sessions={sessions} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div className={`flex-1 overflow-y-auto sm:block ${selected ? "block" : "hidden"}`}>
        {selected ? (
          <SessionDetail session={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Select a session to view details
          </div>
        )}
      </div>
    </main>
  );
}
