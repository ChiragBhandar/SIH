"use client";

import * as React from "react";
import { Language, TranslationDictionary } from "@/i18n/types";
import { en, hi } from "@/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  isHindi: boolean;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "honeychain_lang";

const getSnapshot = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    return saved === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
};

const getServerSnapshot = (): Language => "en";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("honeychain_lang_change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("honeychain_lang_change", onStoreChange);
  };
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = React.useCallback((newLang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
      window.dispatchEvent(new Event("honeychain_lang_change"));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Sync document lang attribute on language change
  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = React.useMemo(() => {
    return language === "hi" ? hi : en;
  }, [language]);

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isHindi: language === "hi",
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const context = React.useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components outside provider
    return {
      language: "en",
      setLanguage: () => {},
      t: en,
      isHindi: false,
    };
  }
  return context;
}
