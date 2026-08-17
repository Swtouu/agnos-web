import type { z } from "zod";
import type { patientFormSchema, addressSchema, emergencyContactSchema } from "@/lib/validation/patient-form";

export type PatientFormData = z.infer<typeof patientFormSchema>;
export type Address = z.infer<typeof addressSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

export type SessionStatus = "active" | "inactive" | "submitted";

// Top-level keys only — nested objects (address, emergencyContact) sync as one unit per Q-19/Q-23.
export type PatientField = keyof PatientFormData;

export interface SessionState {
  sessionId: string;
  data: Partial<PatientFormData>;
  status: SessionStatus;
  lastActivityAt: number;
  createdAt: number;
  submittedAt?: number;
}

export interface FieldUpdatePayload {
  sessionId: string;
  field: PatientField;
  value: unknown;
}

export interface SubmitPayload {
  sessionId: string;
  data: PatientFormData;
}

export interface SubmitAck {
  ok: boolean;
  error?: string;
}

export interface ServerToClientEvents {
  "session-snapshot": (sessions: SessionState[]) => void;
  "session-update": (session: SessionState) => void;
  "session-removed": (sessionId: string) => void;
}

export interface ClientToServerEvents {
  "join-session": (sessionId: string) => void;
  "join-staff": () => void;
  "field-update": (payload: FieldUpdatePayload) => void;
  submit: (payload: SubmitPayload, ack: (res: SubmitAck) => void) => void;
}
