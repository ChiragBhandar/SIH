"use client";

import * as React from "react";
import { Language, TranslationDictionary } from "@/i18n/types";
import { en, hi } from "@/i18n/translations";

import {
  translateStatus,
  translateRole,
  translateOrgType,
  translateNav,
  translateEventType,
  translateTerm,
} from "@/i18n/terms";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  isHindi: boolean;
  tr: (enText: string, hiText: string) => string;
  trTerm: (term: string) => string;
  trStatus: (status: string) => string;
  trRole: (role: string) => string;
  trOrgType: (orgType: string) => string;
  trNav: (nav: string) => string;
  trEventType: (eventType: string) => string;
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
  const isHindi = language === "hi";

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

  const tr = React.useCallback(
    (enText: string, hiText: string) => (isHindi ? hiText : enText),
    [isHindi]
  );

  const trTerm = React.useCallback(
    (term: string) => translateTerm(term, isHindi),
    [isHindi]
  );

  const trStatus = React.useCallback(
    (status: string) => translateStatus(status, isHindi),
    [isHindi]
  );

  const trRole = React.useCallback(
    (role: string) => translateRole(role, isHindi),
    [isHindi]
  );

  const trOrgType = React.useCallback(
    (orgType: string) => translateOrgType(orgType, isHindi),
    [isHindi]
  );

  const trNav = React.useCallback(
    (nav: string) => translateNav(nav, isHindi),
    [isHindi]
  );

  const trEventType = React.useCallback(
    (eventType: string) => translateEventType(eventType, isHindi),
    [isHindi]
  );

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isHindi,
      tr,
      trTerm,
      trStatus,
      trRole,
      trOrgType,
      trNav,
      trEventType,
    }),
    [language, setLanguage, t, isHindi, tr, trTerm, trStatus, trRole, trOrgType, trNav, trEventType]
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
      tr: (enText: string, _hiText: string) => enText,
      trTerm: (term: string) => term,
      trStatus: (status: string) => status,
      trRole: (role: string) => role,
      trOrgType: (orgType: string) => orgType,
      trNav: (nav: string) => nav,
      trEventType: (eventType: string) => eventType,
    };
  }
  return context;
}
