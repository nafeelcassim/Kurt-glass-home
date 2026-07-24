"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { fonts } from "@/lib/fonts"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ShopButton } from "@/components/shop-button"

// Register useGSAP
gsap.registerPlugin(useGSAP)

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations("Header")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "de"
  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`
  const sectionHref = (section: string) => isHomepage ? `#${section}` : `/${locale}#${section}`

  // 1. Handle GSAP Animations
  useGSAP(() => {
    if (!headerRef.current) return

    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    )
  }, { scope: headerRef })

  // 2. Handle React State / Event Listeners
  useEffect(() => {
    let rafId: number | null = null
    let lastScrolled = false

    const handleScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const scrolled = window.scrollY > 50
        if (scrolled !== lastScrolled) {
          lastScrolled = scrolled
          setIsScrolled(scrolled)
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const manufacturingLabel = t.has("nav.manufacturing")
    ? t("nav.manufacturing")
    : t("nav.news")

  const navLinks = [
    { href: sectionHref("products"), label: t("nav.products") },
    { href: sectionHref("manufacturing"), label: manufacturingLabel },
    { href: sectionHref("about"), label: t("nav.about") },
    { href: sectionHref("services"), label: t("nav.services") },
    { href: sectionHref("showrooms"), label: t("nav.showrooms") },
    { href: sectionHref("contact"), label: t("nav.contact") },
  ]

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,padding,box-shadow] duration-300 ${
        isScrolled
          ? "bg-background py-4 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="group flex items-center gap-3">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-W72cJvxeS1BY9zkwZEVHeJ5empcchu.png"
            alt="Kurth Logo"
            width={120}
            height={40}
            className="h-22 w-auto transition-all duration-300 invert brightness-0"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                fonts["2xl"]
              } transition-colors duration-300 animated-underline tracking-wide font-normal ${
                isScrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <ShopButton label={t("nav.shop")} isScrolled={isScrolled} />

          <LanguageSwitcher isScrolled={isScrolled} />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 transition-all duration-300 ${
              isScrolled ? "bg-foreground" : "bg-white"
            } ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`w-6 h-0.5 transition-all duration-300 ${
              isScrolled ? "bg-foreground" : "bg-white"
            } ${isMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`w-6 h-0.5 transition-all duration-300 ${
              isScrolled ? "bg-foreground" : "bg-white"
            } ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md transition-all duration-500 overflow-hidden border-b border-border ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-6 py-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`${fonts.sm} uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300`}
            >
              {link.label}
            </Link>
          ))}

          <ShopButton label={t("nav.shop")} variant="mobile" onClick={() => setIsMenuOpen(false)} />

          <div className="pt-4 border-t border-border w-full flex justify-center">
            <LanguageSwitcher variant="buttons" />
          </div>
        </nav>
      </div>
    </header>
  )
}