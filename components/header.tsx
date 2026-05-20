"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { fonts } from "@/lib/fonts"

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    // Initial animation
    gsap.fromTo(
      header,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    )

    // Scroll handler
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#news", label: "News" },
    { href: "#products", label: "Produkte" },
    { href: "#about", label: "Über Uns" },
    { href: "#showrooms", label: "Standort" },
    { href: "#contact", label: "Kontakt" },
  ]

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-background/95 backdrop-blur-md py-4 shadow-sm"
          : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-W72cJvxeS1BY9zkwZEVHeJ5empcchu.png"
            alt="Kurth Logo"
            width={120}
            height={40}
            className="h-8 w-auto transition-all duration-300 invert brightness-0"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${fonts.sm} uppercase  transition-colors duration-300 animated-underline ${isScrolled
                  ? "text-muted-foreground hover:text-foreground font-bold"
                  : "text-white/80 hover:text-white font-bold"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 transition-all duration-300 ${isScrolled ? "bg-foreground" : "bg-white"
              } ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`w-6 h-0.5 transition-all duration-300 ${isScrolled ? "bg-foreground" : "bg-white"
              } ${isMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`w-6 h-0.5 transition-all duration-300 ${isScrolled ? "bg-foreground" : "bg-white"
              } ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md transition-all duration-500 overflow-hidden border-b border-border ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
        </nav>
      </div>
    </header>
  )
}
