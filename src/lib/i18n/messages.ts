import type { Locale } from "./config";
import { hi } from "./locales/hi";
import { mr } from "./locales/mr";
import { bn } from "./locales/bn";

export type MessageTable = Record<string, string>;

export const MESSAGES: Record<Locale, MessageTable> = {
  en: {},
  hi,
  mr,
  bn,
};
