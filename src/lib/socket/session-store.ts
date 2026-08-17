import type { PatientField, PatientFormData, SessionState } from "@/types/session";

export const INACTIVITY_THRESHOLD_MS = 15_000;
export const SWEEP_INTERVAL_MS = 5_000;

const sessions = new Map<string, SessionState>();

export function getOrCreateSession(sessionId: string): SessionState {
  let session = sessions.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      data: {},
      status: "active",
      lastActivityAt: Date.now(),
      createdAt: Date.now(),
    };
    sessions.set(sessionId, session);
  }
  return session;
}

export function updateField(sessionId: string, field: PatientField, value: unknown): SessionState {
  const session = getOrCreateSession(sessionId);
  session.data = { ...session.data, [field]: value };
  session.lastActivityAt = Date.now();
  if (session.status !== "submitted") {
    session.status = "active";
  }
  return session;
}

export function markSubmitted(sessionId: string, data: PatientFormData): SessionState {
  const session = getOrCreateSession(sessionId);
  session.data = data;
  session.status = "submitted";
  session.submittedAt = Date.now();
  session.lastActivityAt = Date.now();
  return session;
}

export function getSnapshot(): SessionState[] {
  return Array.from(sessions.values());
}

// Pure reducer, unit-testable without mocking time or module state.
export function computeNextStatus(
  status: SessionState["status"],
  lastActivityAt: number,
  now: number
): SessionState["status"] {
  if (status === "active" && now - lastActivityAt > INACTIVITY_THRESHOLD_MS) {
    return "inactive";
  }
  return status;
}

// Single mechanism for both "stopped typing" and "disconnected" — see Q9.
export function sweepInactiveSessions(now = Date.now()): SessionState[] {
  const changed: SessionState[] = [];
  for (const session of sessions.values()) {
    const nextStatus = computeNextStatus(session.status, session.lastActivityAt, now);
    if (nextStatus !== session.status) {
      session.status = nextStatus;
      changed.push(session);
    }
  }
  return changed;
}

// Test-only escape hatch — production code never needs to clear the store.
export function __resetSessionsForTest() {
  sessions.clear();
}
