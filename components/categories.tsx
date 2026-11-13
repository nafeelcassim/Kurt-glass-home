"use client"

import { useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { fonts, fontHeading } from "@/lib/fonts"

// Register both plugins
gsap.registerPlugin(useGSAP, ScrollTrigger)

// anchor = chapter id on the manufactory page (components/manufactory-page.tsx)
const services = [
  { id: "glaszuschnitt", subtitle: "precision", image: "/media/APJ_1412.jpg", position: "object-[85%_50%]", anchor: "glassCutting" },
  { id: "kantenbearbeitung", subtitle: "finishing", image: "/media/APJ_1558.jpg", position: "object-[72%_50%]", anchor: "edgeProcessing" },
  { id: "wasserstrahlschneiden", subtitle: "bystronic", image: "/media/APJ_1339.jpg", anchor: "waterjet" },
  { id: "glasbearbeitung", subtitle: "cnc", image: "/media/_DSC0843.jpg", position: "object-[25%_50%]", anchor: "cnc" },
  { id: "keramikdigitaldruck", subtitle: "650°c", image: "/media/APJ_1694.jpg", anchor: "ceramicPrint" },
  { id: "vorspannanlage", subtitle: "esg", image: "/media/_DSC0983.jpg", position: "object-[38%_50%]", anchor: "tempering" },
  { id: "bogenglas", subtitle: "arcus", image: "/media/web_curved-glass-staircase.jpg", anchor: "curvedGlass" },
  { id: "lackiererei", subtitle: "ral + ncs", image: "/media/web_black-glass-kitchen.jpg", position: "object-[15%_50%]", anchor: "painting" },
]

export function Services() {
  const t = useTranslations("Services")
  const sectionRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
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
    <section ref={sectionRef} id="services" className="py-16 md:py-20 overflow-hidden bg-[#141414]">
      <div className="container mx-auto px-6 mb-8">
        <div className="flex items-end justify-end">
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
        className="container mx-auto flex gap-6 px-6 overflow-x-auto horizontal-scroll pb-4"
      >
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/manufatory#${service.anchor}`}
            className="service-card shrink-0 w-72 md:w-80 group"
          >
            <div className="relative aspect-3/4 overflow-hidden mb-4">
              <Image
                src={service.image}
                alt={t(`items.${service.id}`)}
                fill
                sizes="(max-width: 768px) 576px, 640px" // 3:2 photo covering a 3:4 card is 2x the card width
                className={`object-cover transition-transform duration-700 group-hover:scale-110 ${"position" in service ? service.position : ""}`}
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
          </Link>
        ))}
      </div>
    </section>
  )
}