export const SUPPORTED_LOCALES = ["en", "hi"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "glofi-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
};

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  en: "EN",
  hi: "हि",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "hi";
}

export function resolveLocale(value: string | null | undefined): Locale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  const normalized = value.toLowerCase().trim();
  if (normalized.startsWith("hi")) {
    return "hi";
  }

  if (normalized.startsWith("en")) {
    return "en";
  }

  return isLocale(normalized) ? normalized : DEFAULT_LOCALE;
}

