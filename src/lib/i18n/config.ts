export const SUPPORTED_LOCALES = ["en", "hi", "mr", "bn"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "glofi-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  bn: "বাংলা",
};

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  en: "EN",
  hi: "हि",
  mr: "म",
  bn: "बा",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "hi" || value === "mr" || value === "bn";
}

export function resolveLocale(value: string | null | undefined): Locale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  const normalized = value.toLowerCase().trim();
  if (normalized.startsWith("hi")) {
    return "hi";
  }
  if (normalized.startsWith("mr")) {
    return "mr";
  }
  if (normalized.startsWith("bn")) {
    return "bn";
  }
  if (normalized.startsWith("en")) {
    return "en";
  }

  return isLocale(normalized) ? normalized : DEFAULT_LOCALE;
}
