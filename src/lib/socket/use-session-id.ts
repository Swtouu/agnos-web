"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Session id lives in the URL so a refresh rejoins the same session instead of starting a new one (Q8).
export function useSessionId(basePath: string): string {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Lazy initializer, computed once — only used as a fallback until the URL carries a session id.
  const [generatedId] = useState(() => crypto.randomUUID());
  const sessionId = searchParams.get("session") ?? generatedId;

  useEffect(() => {
    if (!searchParams.get("session")) {
      router.replace(`${basePath}?session=${generatedId}`);
    }
  }, [searchParams, router, basePath, generatedId]);

  return sessionId;
}
