"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LOCALES } from "@/lib/i18n/translations";

const LABELS: Record<string, string> = { en: "EN", th: "TH" };

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex rounded-full border border-border bg-surface p-0.5 text-xs font-medium">
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === option ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  );
}
