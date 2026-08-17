import Link from "next/link";
import { Activity } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </span>
          Agnos Patient Intake
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
