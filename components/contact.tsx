"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslations } from "next-intl"
import { fonts, fontHeading, FONT_SPACING } from "@/lib/fonts"

// Register both plugins
gsap.registerPlugin(useGSAP, ScrollTrigger)

export function Contact() {
  const t = useTranslations("Contact")
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
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
  }, { scope: sectionRef })

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
          <p className={`${fonts.lg}  tracking-widest text-muted-foreground mb-3`}>
            {t("header.subtitle")}
          </p>
          <h2 className={`${fontHeading.md} font-bold text-foreground mb-8`}>
            {t("header.title")}
          </h2>
          <p className={`${fonts["2xl"]} text-muted-foreground mb-12 max-w-xl mx-auto`}>
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <a
              href="#"
              className={`inline-flex items-center gap-2 ${fonts.lg} text-white animated-underline transition-colors duration-300 group`}
            >
              {t("cta.getInTouch")}
            </a>
            <a
              href="#"
              className={`inline-flex items-center gap-2 ${fonts.lg} text-white animated-underline transition-colors duration-300 group`}
            >
              {t("cta.watchVideos")}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}