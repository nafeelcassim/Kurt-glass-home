"use client"

import Link from "next/link"
import Image from "next/image"
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
            <div className="max-w-md">
              <Link href="/" className="group block">
                <div className="rounded-2xl  border-neutral-200 bg-white p-5  transition-shadow duration-300 group-hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className={`${fonts['3xl']} font-bold text-neutral-900 leading-none`}>
                        KURTH
                      </span>
                      <span className={`block ${fonts.xs} font-bold uppercase tracking-wide text-neutral-500 mt-2`}>
                        Glas und Spiegel AG
                      </span>
                    </div>
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-W72cJvxeS1BY9zkwZEVHeJ5empcchu.png"
                      alt="Kurth Logo"
                      width={140}
                      height={48}
                      className="h-9 w-auto shrink-0"
                      priority
                    />
                  </div>

                  <div className="mt-4 h-px w-full bg-neutral-200" />

                  <div className="mt-4">
                    <Image
                      src="/wording.png"
                      alt="glas trifft design."
                      width={512}
                      height={450}
                      className="h-11 w-auto opacity-90"
                    />
                    <p className={`mt-4 text-neutral-600 ${fonts.sm} font-semibold leading-relaxed`}>
                      Glas trifft Design. Hochwertige Glaslösungen aus Zuchwil, Schweiz.
                      Inhabergeführt mit über 50 Jahren Erfahrung.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
        
          </div>

          {/* Produkte */}
          <div>
            <h4 className={`${fonts.sm} uppercase font-bold text-neutral-900 mb-6`}>
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
            <h4 className={`${fonts.sm} uppercase text-neutral-900 mb-6 font-bold`}>
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
            <h4 className={`${fonts.sm} uppercase  text-neutral-900 mb-6 font-bold`}>
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
