import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import type { ClientToServerEvents, FieldUpdatePayload, ServerToClientEvents, SubmitPayload } from "@/types/session";
import { patientFormSchema } from "@/lib/validation/patient-form";
import {
  getOrCreateSession,
  getSnapshot,
  markSubmitted,
  SWEEP_INTERVAL_MS,
  sweepInactiveSessions,
  updateField,
} from "@/lib/socket/session-store";

const STAFF_ROOM = "staff";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

  io.on("connection", (socket) => {
    socket.on("join-session", (sessionId: string) => {
      const session = getOrCreateSession(sessionId);
      io.to(STAFF_ROOM).emit("session-update", session);
    });

    socket.on("join-staff", () => {
      socket.join(STAFF_ROOM);
      socket.emit("session-snapshot", getSnapshot());
    });

    socket.on("field-update", (payload: FieldUpdatePayload) => {
      // Structural check only — content/format validation belongs at submit time, not on every keystroke (see Q9).
      if (!(payload.field in patientFormSchema.shape)) return;
      const session = updateField(payload.sessionId, payload.field, payload.value);
      io.to(STAFF_ROOM).emit("session-update", session);
    });

    socket.on("submit", (payload: SubmitPayload, ack) => {
      const result = patientFormSchema.safeParse(payload.data);
      if (!result.success) {
        ack({ ok: false, error: "Validation failed" });
        return;
      }
      const session = markSubmitted(payload.sessionId, result.data);
      io.to(STAFF_ROOM).emit("session-update", session);
      ack({ ok: true });
    });
  });

  setInterval(() => {
    const changed = sweepInactiveSessions();
    for (const session of changed) {
      io.to(STAFF_ROOM).emit("session-update", session);
    }
  }, SWEEP_INTERVAL_MS);

  httpServer.listen(port, () => {
    console.log(`> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
  });
});
