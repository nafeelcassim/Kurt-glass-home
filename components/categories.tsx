"use client"

import { useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { fonts, fontHeading } from "@/lib/fonts"

// Register both plugins
gsap.registerPlugin(useGSAP, ScrollTrigger)

const services = [
  { id: "glaszuschnitt", subtitle: "precision", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80", href: "https://www.kurth-glas.ch/glaszuschnitt-2" },
  { id: "kantenbearbeitung", subtitle: "finishing", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80", href: "https://www.kurth-glas.ch/kopie-von-glaszuschnitt" },
  { id: "wasserstrahlschneiden", subtitle: "bystronic", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80", href: "https://www.kurth-glas.ch/kopie-von-kantenbearbeitung" },
  { id: "glasbearbeitung", subtitle: "cnc", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", href: "https://www.kurth-glas.ch/kopie-von-wasserstrahlschneiden" },
  { id: "keramikdigitaldruck", subtitle: "650°c", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80", href: "https://www.kurth-glas.ch/kopie-von-glasbearbeitung" },
  { id: "vorspannanlage", subtitle: "esg", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", href: "https://www.kurth-glas.ch/kopie-von-keramikdigitaldruck" },
  { id: "bogenglas", subtitle: "arcus", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", href: "https://www.kurth-glas.ch/kopie-von-vorspannanlage" },
  { id: "lackiererei", subtitle: "ral + ncs", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80", href: "https://www.kurth-glas.ch/kopie-von-bogenglas" },
]

export function Services() {
  const t = useTranslations("Services")
  const sectionRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    // Title animation
    gsap.fromTo(
      titleRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
        },
      }
    )

    // Cards stagger animation
    const cards = carouselRef.current?.querySelectorAll(".service-card")
    if (cards) {
      gsap.fromTo(
        cards,
        { y: 100, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 80%",
          },
        }
      )
    }
  }, { scope: sectionRef })

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section ref={sectionRef} id="services" className="py-24 md:py-32 overflow-hidden bg-[#141414]">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex items-end justify-between">
          <h2
            ref={titleRef}
            className={`${fontHeading.md} font-bold text-foreground`}
          >
            {t("heading.line1")}<br />
            <span className="text-foreground">{t("heading.line2")}</span>
          </h2>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-3 border border-border hover:border-primary hover:text-primary transition-colors duration-300 bg-background"
              aria-label={t("navigation.back")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 border border-border hover:border-primary hover:text-primary transition-colors duration-300 bg-background"
              aria-label={t("navigation.next")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-6 px-6 overflow-x-auto horizontal-scroll pb-4"
      >
        {services.map((service) => (
          <a
            key={service.id}
            href={service.href}
            target="_blank"
            rel="noreferrer"
            className="service-card shrink-0 w-72 md:w-80 group"
          >
            <div className="relative aspect-3/4 overflow-hidden mb-4">
              <Image
                src={service.image}
                alt={t(`items.${service.id}`)}
                fill
                sizes="(max-width: 768px) 288px, 320px"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.srcset = ""
                  event.currentTarget.src = "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80"
                }}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className={`${fonts["2xl"]} tracking-normal text-white/60 mb-2 block`}>
                  {service.subtitle}
                </span>
                <h3 className={`${fonts['2xl']} font-bold text-white group-hover:text-white transition-colors animated-underline duration-300`}>
                  {t(`items.${service.id}`)}
                </h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}