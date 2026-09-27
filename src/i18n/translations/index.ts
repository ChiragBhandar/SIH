import { Language, TranslationDictionary } from "../types";
import { en } from "./en";
import { hi } from "./hi";

export const translations: Record<Language, TranslationDictionary> = {
  en,
  hi,
};

/**
 * Helper to safely retrieve dictionary with automatic fallback to English
 */
export function getTranslations(lang: Language): TranslationDictionary {
  if (lang === "hi") {
    return hi;
  }
  return en;
}

export * from "../types";
export { en, hi };
