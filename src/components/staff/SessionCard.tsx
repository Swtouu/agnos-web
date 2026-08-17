import type { SessionState } from "@/types/session";
import { StatusBadge } from "./StatusBadge";

interface SessionCardProps {
  session: SessionState;
  selected: boolean;
  onSelect: () => void;
}

export function SessionCard({ session, selected, onSelect }: SessionCardProps) {
  const name = [session.data.firstName, session.data.lastName].filter(Boolean).join(" ") || "Unnamed patient";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col gap-1 rounded border px-3 py-2 text-left ${
        selected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium text-slate-900">{name}</span>
        <StatusBadge status={session.status} />
      </div>
      <span className="text-xs text-slate-400">Session {session.sessionId.slice(0, 8)}</span>
    </button>
  );
}
