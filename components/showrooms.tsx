"use client"

import { useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MapPin, Phone, Mail, Navigation } from "lucide-react"
import { useTranslations } from "next-intl"
import { fonts, fontHeading } from "@/lib/fonts"

// Register both plugins
gsap.registerPlugin(useGSAP, ScrollTrigger)

const showrooms = [
  {
    location: "Zuchwil",
    addressLines: ["Grubenweg 2", "4528 Zuchwil"],
    phone: "+41 32 685 55 75",
    email: "info@kurth-glas.ch",
    routeUrl: "https://maps.google.com/?q=Grubenweg+2+4528+Zuchwil",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Factory and location in Zuchwil",
  },
  {
    location: "Faoug",
    addressLines: ["Route de Morat 6", "1595 Faoug"],
    phone: "+41 26 670 41 80",
    email: "matthias.flach@kurth-glas.ch",
    routeUrl: "https://maps.google.com/?q=Route+de+Morat+6+1595+Faoug",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Factory and location in Faoug",
  },
]

export function Showrooms() {
  const t = useTranslations("Showrooms")
  const tContact = useTranslations("Contact")
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Title animation
    gsap.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        },
      }
    )

    // Cards animation
    const cards = cardsRef.current?.querySelectorAll(".showroom-card")
    if (cards) {
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
          },
        }
      )
    }

    const glows = sectionRef.current?.querySelectorAll(".location-glow")
    if (glows) {
      gsap.to(glows, {
        x: (index) => (index % 2 === 0 ? -20 : 20),
        y: (index) => (index % 2 === 0 ? 24 : -24),
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      })
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="showrooms" className="relative overflow-hidden py-24 md:py-32 bg-neutral-950 text-white">
      <div className="location-glow pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="location-glow pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />

      <div id="contact" className="absolute -top-24" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <p className={`${fonts.lg} tracking-[0.22em] text-white/60 mb-3`}>
            {t("header.subtitle")}
          </p>
          <h2 className={`${fontHeading.md} font-bold text-white`}>
            {t("header.title")}
          </h2>
          <p className={`${fonts["2xl"]} text-white/70 mt-8 max-w-3xl mx-auto`}>
            {tContact("description")}
          </p>

        </div>

        {/* Showroom cards */}
        <div
          ref={cardsRef}
          className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2"
        >
          {showrooms.map((showroom) => (
            <article
              key={showroom.location}
              className="showroom-card group rounded-3xl border border-white/15 bg-linear-to-b from-white/9 to-white/3 p-8 md:p-10 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/30"
            >
              <div className="relative mb-7 overflow-hidden rounded-2xl border border-white/15 aspect-16/10">
                <Image
                  src={showroom.image}
                  alt={showroom.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.srcset = ""
                    event.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80&auto=format&fit=crop"
                  }}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/65 via-neutral-900/20 to-transparent" />
                <span className={`${fonts.xs} absolute bottom-4 left-4 rounded-full border border-white bg-neutral-950/45 px-3 py-1 uppercase tracking-[0.14em] text-amber-100`}>
                  Factory · {showroom.location}
                </span>
              </div>

              <h3 className={`${fonts["2xl"]} font-bold text-white`}>
                {showroom.location}
              </h3>

              <div className="mt-8 space-y-5">
                <div className={`flex items-start gap-4 ${fonts.lg} text-white/85`}>
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-foreground" />
                  <address className="not-italic leading-relaxed">
                    {showroom.addressLines.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </address>
                </div>

                <a
                  href={`tel:${showroom.phone.replace(/\s+/g, "")}`}
                  className={`flex items-center gap-4 ${fonts.lg} text-white/85 transition-colors duration-300 hover:text-amber-100`}
                >
                  <Phone className="w-5 h-5 shrink-0 text-foreground" />
                  <span>Telefon {showroom.phone}</span>
                </a>

                <a
                  href={`mailto:${showroom.email}`}
                  className={`flex items-center gap-4 ${fonts.lg} text-white/85 transition-colors duration-300 hover:text-amber-100 break-all`}
                >
                  <Mail className="w-5 h-5 shrink-0 text-foreground" />
                  <span>Email {showroom.email}</span>
                </a>
              </div>

              <a
                href={showroom.routeUrl}
                target="_blank"
                rel="noreferrer"
                className={`group mt-10 inline-flex items-center gap-3 ${fonts.sm} font-bold uppercase tracking-[0.12em]  animated-underline transition-all duration-300 hover:text-foreground`}
              >
                <Navigation className="w-4 h-4 text-foreground transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1" />
                {t("cta.planRoute")}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="mailto:info@kurth-glas.ch"
            className={`${fonts.lg} font-semibold inline-flex items-center justify-center text-white/85 animated-underline hover:text-white transition-colors duration-300`}
          >
            {tContact("cta.getInTouch")}
          </a>
        </div>
      </div>
    </section>
  )
}