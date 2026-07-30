import { DEFAULT_LOCALE, type Locale } from "./config";
import { MESSAGES } from "./messages";

export function translate(
  locale: Locale,
  key: string,
  values?: Record<string, string | number>
) {
  const template = MESSAGES[locale]?.[key] ?? MESSAGES[DEFAULT_LOCALE]?.[key] ?? key;

  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, placeholder: string) => {
    const value = values[placeholder];
    return value === undefined || value === null ? `{${placeholder}}` : String(value);
  });
}

export function translateStatus(locale: Locale, status: string) {
  const readable = status.replaceAll("_", " ");
  return translate(locale, readable.toUpperCase()) || translate(locale, readable) || readable;
}

