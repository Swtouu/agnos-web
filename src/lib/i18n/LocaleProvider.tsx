"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { dict, optionLabels, type Locale } from "./translations";

const STORAGE_KEY = "locale";
const listeners = new Set<() => void>();

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "th";
}

function getSnapshot(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;
  return navigator.language.startsWith("th") ? "th" : "en";
}

// SSR always renders "en" — matches the client's first paint, then useSyncExternalStore
// re-syncs to the real value right after hydration. No manual effect+setState needed.
function getServerSnapshot(): Locale {
  return "en";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function setStoredLocale(locale: Locale) {
  window.localStorage.setItem(STORAGE_KEY, locale);
  for (const listener of listeners) listener();
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setLocale = useCallback((next: Locale) => setStoredLocale(next), []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function useTranslations() {
  const { locale } = useLocale();
  return useCallback(
    (path: string): string => {
      const entry = getPath(dict, path);
      if (entry && typeof entry === "object" && locale in entry) {
        return (entry as Record<Locale, string>)[locale];
      }
      return path;
    },
    [locale]
  );
}

export function useOptionLabel() {
  const { locale } = useLocale();
  return useCallback(
    (group: keyof typeof optionLabels, value: string): string => {
      const groupLabels = optionLabels[group] as Record<string, Record<Locale, string>>;
      return groupLabels[value]?.[locale] ?? value;
    },
    [locale]
  );
}
