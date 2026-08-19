"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "./client";
import type { PatientField, PatientFormData, SubmitAck } from "@/types/session";

const DEBOUNCE_MS = 300;
const SUBMIT_TIMEOUT_MS = 5000;

export function usePatientSession(sessionId: string) {
  const [connected, setConnected] = useState(false);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const socket = getSocket();

    function onConnect() {
      setConnected(true);
      socket.emit("join-session", sessionId);
    }
    function onDisconnect() {
      setConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [sessionId]);

  const emitFieldUpdate = useCallback(
    (field: PatientField, value: unknown) => {
      const existing = timers.current.get(field);
      if (existing) clearTimeout(existing);
      const timeout = setTimeout(() => {
        getSocket().emit("field-update", { sessionId, field, value });
        timers.current.delete(field);
      }, DEBOUNCE_MS);
      timers.current.set(field, timeout);
    },
    [sessionId]
  );

  const submit = useCallback(
    (data: PatientFormData) => {
      return new Promise<SubmitAck>((resolve) => {
        let settled = false;
        const timeout = setTimeout(() => {
          if (settled) return;
          settled = true;
          resolve({ ok: false, error: "patientForm.submitTimeout" });
        }, SUBMIT_TIMEOUT_MS);
        getSocket().emit("submit", { sessionId, data }, (ack: SubmitAck) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          resolve(ack);
        });
      });
    },
    [sessionId]
  );

  return { connected, emitFieldUpdate, submit };
}
