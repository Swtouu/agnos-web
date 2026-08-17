export function ReconnectBanner({ connected }: { connected: boolean }) {
  if (connected) return null;
  return (
    <div className="rounded bg-amber-100 px-4 py-2 text-sm text-amber-900" role="status">
      Reconnecting... your changes will sync once the connection is back.
    </div>
  );
}
