"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"
import { fonts } from "@/lib/fonts"

const footerLinks = {
  produkte: [
    { label: "Glasverkleidung", href: "#" },
    { label: "Schaltbares Glas", href: "#" },
    { label: "Glasbilder", href: "#" },
    { label: "Spionspiegel", href: "#" },
    { label: "Bogenglas", href: "#" },
    { label: "Entspiegeltes Glas", href: "#" },
  ],
  services: [
    { label: "Ganzglas-System", href: "#" },
    { label: "Glasboden", href: "#" },
    { label: "Spiegel", href: "#" },
    { label: "Beratung", href: "#" },
  ],
  kontakt: [
    { label: "Standort", href: "#showrooms" },
    { label: "Kontakt", href: "#contact" },
    { label: "Karriere", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-white text-neutral-900 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-W72cJvxeS1BY9zkwZEVHeJ5empcchu.png"
                  alt="Kurth Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`${fonts['3xl']}  text-neutral-900`}>
                    KURTH
                  </span>
                  <Image
                    src="/wording.png"
                    alt="glas trifft design."
                    width={512}
                    height={450}
                    className="h-12 w-auto opacity-90"
                  />
                </div>
              </div>
              <span className={`block ${fonts.xs} uppercase text-neutral-500 mt-1`}>
                Glas und Spiegel AG
              </span>
            </Link>
            <p className={`text-neutral-600 ${fonts.sm} mb-6 max-w-sm`}>
              Glas trifft Design. Hochwertige Glaslösungen aus Zuchwil, Schweiz. 
              Inhabergeführt mit über 50 Jahren Erfahrung.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://instagram.com/kurthglas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-neutral-900 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </Link>
            </div>
            <p className={`${fonts.xs} text-neutral-500 mt-4`}>@kurthglas</p>
          </div>

          {/* Produkte */}
          <div>
            <h4 className={`${fonts.sm} uppercase  text-neutral-900 mb-6`}>
              Produkte
            </h4>
            <ul className="space-y-3">
              {footerLinks.produkte.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`${fonts.sm} text-neutral-600 hover:text-neutral-900 transition-colors duration-300`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className={`${fonts.sm} uppercase text-neutral-900 mb-6`}>
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`${fonts.sm} text-neutral-600 hover:text-neutral-900 transition-colors duration-300`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className={`${fonts.sm} uppercase  text-neutral-900 mb-6`}>
              Kontakt
            </h4>
            <ul className="space-y-3">
              {footerLinks.kontakt.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`${fonts.sm} text-neutral-600 hover:text-neutral-900 transition-colors duration-300`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className={`${fonts.xs} text-neutral-500`}>
            &copy; {new Date().getFullYear()} KURTH Glas und Spiegel AG. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className={`${fonts.xs} text-neutral-500 hover:text-neutral-900 transition-colors duration-300`}
            >
              Datenschutz
            </Link>
            <Link
              href="#"
              className={`${fonts.xs} text-neutral-500 hover:text-neutral-900 transition-colors duration-300`}
            >
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
