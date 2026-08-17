import { WifiOff } from "lucide-react";

export function ReconnectBanner({ connected }: { connected: boolean }) {
  if (connected) return null;
  return (
    <div
      className="flex items-center gap-2 rounded-lg bg-warning-bg px-4 py-2.5 text-sm text-warning-fg"
      role="status"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      Reconnecting... your changes will sync once the connection is back.
    </div>
  );
}
