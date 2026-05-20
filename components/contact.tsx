"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"
import { fonts, fontHeading, FONT_SPACING } from "@/lib/fonts"

gsap.registerPlugin(ScrollTrigger)

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 md:py-32 relative overflow-hidden bg-background"
    >
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className={`text-[20vw] ${FONT_SPACING} text-foreground/5 whitespace-nowrap`}>
          KURTH
        </span>
      </div>

      <div ref={contentRef} className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className={`${fonts.sm} uppercase  text-muted-foreground mb-4`}>
            Kontaktieren Sie uns
          </p>
          <h2 className={`${fontHeading.md} text-foreground mb-8`}>
            Glas trifft <br />
            <span className="text-foreground">Design</span>
          </h2>
          <p className={`${fonts.lg} text-muted-foreground mb-12 max-w-xl mx-auto`}>
            Entdecken Sie unsere Welt in Bewegung - von spannenden Montagen über 
            Einblicke in die Produktion bis hin zu praktischen Tipps und Glas-Tests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`inline-flex items-center justify-center gap-4 bg-primary text-primary-foreground px-10 py-5 ${fonts.sm} uppercase hover:bg-foreground transition-colors duration-300 group`}>
              Kontakt aufnehmen
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <button className={`inline-flex items-center justify-center gap-4 border border-border text-foreground px-10 py-5 ${fonts.sm} uppercase hover:border-primary hover:text-primary transition-colors duration-300`}>
              Videos ansehen
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
