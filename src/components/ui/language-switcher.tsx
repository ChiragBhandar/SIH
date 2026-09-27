"use client";

import * as React from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Language } from "@/i18n/types";

interface LanguageSwitcherProps {
  className?: string;
  showChevron?: boolean;
}

export function LanguageSwitcher({
  className = "",
  showChevron = false,
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close dropdown
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const languages: Array<{ code: Language; label: string; englishLabel: string }> = [
    { code: "en", label: "English", englishLabel: "English" },
    { code: "hi", label: "हिन्दी", englishLabel: "Hindi" },
  ];

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Navbar Language Control Button matching reference image */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${t.common.changeLanguage} (Current: ${
          language === "hi" ? "हिन्दी" : "English"
        })`}
        className="group flex h-9 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 text-[13px] font-semibold text-[#1A221E] hover:text-foreground bg-transparent hover:bg-[#FAF8F5] border border-transparent hover:border-[#E7E3DB] transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]/40"
      >
        <Globe className="h-4 w-4 text-[#1A221E] stroke-[2] transition-transform duration-200 group-hover:rotate-12 shrink-0" />
        <span className="tracking-tight font-medium">
          {language === "hi" ? "हिन्दी" : "English"}
        </span>
        {showChevron && (
          <ChevronDown
            className={`h-3.5 w-3.5 text-[#5F6B64] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={t.common.language}
          className="absolute right-0 mt-1.5 w-36 sm:w-40 rounded-xl border border-[#E7E3DB] bg-white p-1 shadow-lg ring-1 ring-black/5 z-50 focus:outline-none animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectLanguage(lang.code)}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#FEF6E8] text-[#B45309] font-bold"
                    : "text-[#1A221E] hover:bg-[#FAF8F5] hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className={`h-3.5 w-3.5 ${isSelected ? "text-[#B45309]" : "text-[#5F6B64]"}`} />
                  <span className="text-[13px]">{lang.label}</span>
                </div>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-[#B45309] stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
