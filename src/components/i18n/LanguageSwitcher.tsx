"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/providers/LocaleProvider";

type LanguageSwitcherProps = {
  variant?: "desktop" | "mobile";
  className?: string;
};

export default function LanguageSwitcher({
  variant = "desktop",
  className = "",
}: LanguageSwitcherProps) {
  const { locale, labels, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const isMobile = variant === "mobile";

  const handleSelect = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }

    setOpen(false);
    setLocale(nextLocale);
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className={`navbar__lang ${isMobile ? "navbar__lang--mobile" : ""} inline-flex items-center justify-between gap-2 rounded-full border border-[rgba(0,32,53,0.12)] bg-white/80 px-3 py-2 shadow-sm backdrop-blur-md transition-colors hover:border-[rgba(0,32,53,0.22)]`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={labels[locale]}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Globe className="w-4 h-4 shrink-0 text-[#5B8FA8]" />
        <span className="navbar__lang-label text-sm font-medium text-[#0f172a]">
          {labels[locale]}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className={`absolute ${isMobile ? "left-0 right-0 mt-2" : "right-0 mt-2"} z-50 overflow-hidden rounded-2xl border border-[rgba(0,32,53,0.12)] bg-white shadow-xl`}>
          <div className="flex flex-col p-1">
            {SUPPORTED_LOCALES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`rounded-xl px-4 py-2 text-left text-sm transition-colors ${
                  option === locale
                    ? "bg-[rgba(2,95,92,0.08)] text-[#025f5c] font-semibold"
                    : "text-[#1A1F1C] hover:bg-[rgba(0,0,0,0.04)]"
                }`}
              >
                {labels[option]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
