import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, resolveLocale, type Locale } from "./config";
import { translate } from "./translate";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLocale) {
    return resolveLocale(cookieLocale);
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");
  if (acceptLanguage) {
    const firstLanguage = acceptLanguage.split(",")[0]?.trim();
    return resolveLocale(firstLanguage);
  }

  return DEFAULT_LOCALE;
}

export function createTranslator(locale: Locale) {
  return (key: string, values?: Record<string, string | number>) =>
    translate(locale, key, values);
}

