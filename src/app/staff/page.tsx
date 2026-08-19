"use client";

import { useState } from "react";
import { useStaffSessions } from "@/lib/socket/use-staff-sessions";
import { SessionList } from "@/components/staff/SessionList";
import { SessionDetail } from "@/components/staff/SessionDetail";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export default function StaffPage() {
  const t = useTranslations();
  const sessions = useStaffSessions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = sessions.find((s) => s.sessionId === selectedId) ?? null;

  return (
    <main className="flex h-[calc(100vh-3.5rem)] flex-col sm:flex-row">
      <div
        className={`w-full border-border p-4 sm:block sm:w-80 sm:border-r ${selected ? "hidden" : "block"}`}
      >
        <h1 className="mb-3 text-lg font-semibold text-foreground">{t("staff.dashboardTitle")}</h1>
        <SessionList sessions={sessions} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div className={`flex-1 overflow-y-auto sm:block ${selected ? "block" : "hidden"}`}>
        {selected ? (
          <SessionDetail session={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {t("staff.selectSessionPrompt")}
          </div>
        )}
      </div>
    </main>
  );
}
