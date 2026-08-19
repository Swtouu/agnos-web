"use client";

import { WifiOff } from "lucide-react";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function ReconnectBanner({ connected }: { connected: boolean }) {
  const t = useTranslations();
  if (connected) return null;
  return (
    <div
      className="flex items-center gap-2 rounded-lg bg-warning-bg px-4 py-2.5 text-sm text-warning-fg"
      role="status"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      {t("patientForm.reconnecting")}
    </div>
  );
}
