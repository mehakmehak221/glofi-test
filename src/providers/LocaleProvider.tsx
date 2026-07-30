"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, LOCALE_LABELS, LOCALE_SHORT_LABELS, type Locale } from "@/lib/i18n/config";
import { translate } from "@/lib/i18n/translate";
import { setCookie } from "@/utils/cookieUtils";

type LocaleContextValue = {
  locale: Locale;
  labels: typeof LOCALE_LABELS;
  shortLabels: typeof LOCALE_SHORT_LABELS;
  setLocale: (nextLocale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = "ltr";
  }, [locale]);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    setCookie(LOCALE_COOKIE, nextLocale, 365);
    router.refresh();
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        labels: LOCALE_LABELS,
        shortLabels: LOCALE_SHORT_LABELS,
        setLocale,
        t: (key, values) => translate(locale, key, values),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useI18n must be used within LocaleProvider");
  }
  return context;
}

