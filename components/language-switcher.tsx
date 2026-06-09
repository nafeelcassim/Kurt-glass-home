"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, Globe } from "lucide-react"
import { fonts } from "@/lib/fonts"
import { routing } from "@/i18n/routing"

const locales = {
  de: { label: "DE", flag: "🇩🇪" },
  en: { label: "EN", flag: "🇬🇧" },
  fr: { label: "FR", flag: "🇫🇷" },
}

interface LanguageSwitcherProps {
  isScrolled?: boolean
  variant?: "dropdown" | "buttons"
}

export function LanguageSwitcher({ isScrolled = false, variant = "dropdown" }: LanguageSwitcherProps) {
  const [isLangOpen, setIsLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const currentLocale = pathname.split("/")[1] || routing.defaultLocale

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLocaleChange = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`)
    router.push(newPath || `/${locale}`)
    setIsLangOpen(false)
  }

  if (variant === "buttons") {
    return (
      <div className="flex items-center  gap-2">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-2">
          {routing.locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`px-3 py-1.5 text-sm font-bold transition-colors duration-200 border ${
                currentLocale === locale
                  ? "bg-muted text-foreground border-border"
                  : "text-muted-foreground hover:text-foreground border-transparent hover:border-border"
              }`}
            >
              {locales[locale as keyof typeof locales]?.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={langRef} className="relative">
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none border transition-all duration-300 ${
          isScrolled
            ? "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            : "border-white/30 text-white/80 hover:text-white hover:border-white/60"
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className={`${fonts.sm} font-bold uppercase items`}>
          {locales[currentLocale as keyof typeof locales]?.label || "DE"}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-300 ${
            isLangOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full right-0 mt-2 py-2 min-w-[120px] bg-popover border border-border shadow-lg transition-all duration-300 origin-top-right ${
          isLangOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {routing.locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-left transition-colors duration-200 ${
              currentLocale === locale
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <span className="text-base">{locales[locale as keyof typeof locales]?.flag}</span>
            <span className={`${fonts.sm} font-bold`}>
              {locales[locale as keyof typeof locales]?.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
