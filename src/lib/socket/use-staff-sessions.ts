"use client";

import { useEffect, useState } from "react";
import { getSocket } from "./client";
import type { SessionState } from "@/types/session";

export function useStaffSessions(): SessionState[] {
  const [sessions, setSessions] = useState<Record<string, SessionState>>({});

  useEffect(() => {
    const socket = getSocket();

    function onSnapshot(list: SessionState[]) {
      const map: Record<string, SessionState> = {};
      for (const session of list) map[session.sessionId] = session;
      setSessions(map);
    }
    function onUpdate(session: SessionState) {
      setSessions((prev) => ({ ...prev, [session.sessionId]: session }));
    }
    function joinStaffRoom() {
      socket.emit("join-staff");
    }

    socket.on("session-snapshot", onSnapshot);
    socket.on("session-update", onUpdate);
    socket.on("connect", joinStaffRoom);
    if (socket.connected) joinStaffRoom();

    return () => {
      socket.off("session-snapshot", onSnapshot);
      socket.off("session-update", onUpdate);
      socket.off("connect", joinStaffRoom);
    };
  }, []);

  return Object.values(sessions).sort((a, b) => b.createdAt - a.createdAt);
}
