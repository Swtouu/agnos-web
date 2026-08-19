"use client";

import Link from "next/link";
import { ClipboardList, MonitorSmartphone, ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="hero-glow flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          {t("landing.badge")}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t("landing.heading")}
        </h1>
        <p className="max-w-lg text-balance text-muted-foreground">{t("landing.subheading")}</p>
      </div>

      <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/patient"
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ClipboardList className="h-5 w-5" />
          </span>
          <span className="font-semibold text-foreground">{t("landing.patientCardTitle")}</span>
          <span className="text-sm text-muted-foreground">{t("landing.patientCardDesc")}</span>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t("landing.patientCardAction")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/staff"
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-foreground">
            <MonitorSmartphone className="h-5 w-5" />
          </span>
          <span className="font-semibold text-foreground">{t("landing.staffCardTitle")}</span>
          <span className="text-sm text-muted-foreground">{t("landing.staffCardDesc")}</span>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t("landing.staffCardAction")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </main>
  );
}
