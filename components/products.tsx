"use client"

import { useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { fonts, fontHeading } from "@/lib/fonts"
import { SHOP_URL } from "@/lib/site"

// Register both plugins
gsap.registerPlugin(useGSAP, ScrollTrigger)

// Product brands with their own sites. Logo = client-supplied white wordmark (white on photos, per brand guide).
// Images: reference photos from the client's own sites (kurth-glas.ch, *.glaszentrum.ch), served from
// /public/media until moved to Vercel storage.
const brandProducts = [
  { id: "murale", href: "https://murale.glaszentrum.ch", image: "/media/web_murale-alpine-print-kitchen.jpg" },
  { id: "imber", href: "https://imber.glaszentrum.ch", image: "/media/web_imber-marble-shower.jpg" },
  { id: "murus", href: "https://murus.glaszentrum.ch", image: "/media/web_murus-printed-meeting-box.jpg" },
  { id: "ventus", href: "https://ventus.glaszentrum.ch", image: "/media/web_entrance-windbreak-black.jpg" },
  { id: "speculum", href: "https://speculum.glaszentrum.ch", image: "/media/web_bathroom-mirror.jpg" },
]

const shopProducts = ["mutabilis", "glasbilder", "spectabilis", "arcus", "luxar", "pavimentum"]

export function Products() {
  const t = useTranslations("Products")
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

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
          start: "top 85%",
        },
      }
    )

    // Products stagger animation
    const productCards = gridRef.current?.querySelectorAll(".product-card")
    if (productCards) {
      productCards.forEach((card, index) => {
        // Card entrance animation
        gsap.fromTo(
          card,
          { 
            y: 100, 
            opacity: 0,
            rotateX: 15
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
          }
        )

        // Image parallax on scroll
        const image = card.querySelector(".product-image")
        if (image) {
          gsap.to(image, {
            y: -30,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          })
        }

        // Hover animations
        const overlay = card.querySelector(".product-overlay")
        const content = card.querySelector(".product-content")
        const arrow = card.querySelector(".product-arrow")

        card.addEventListener("mouseenter", () => {
          gsap.to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" })
          gsap.to(content, { y: -10, duration: 0.4, ease: "power2.out" })
          gsap.to(arrow, { x: 5, y: -5, duration: 0.3, ease: "power2.out" })
          gsap.to(image, { scale: 1.08, duration: 0.7, ease: "power2.out" })
        })

        card.addEventListener("mouseleave", () => {
          gsap.to(overlay, { opacity: 0, duration: 0.4, ease: "power2.out" })
          gsap.to(content, { y: 0, duration: 0.4, ease: "power2.out" })
          gsap.to(arrow, { x: 0, y: 0, duration: 0.3, ease: "power2.out" })
          gsap.to(image, { scale: 1.05, duration: 0.7, ease: "power2.out" })
        })
      })
    }
  }, { scope: sectionRef }) // Pass your container ref here to establish the context scope

  return (
    <section ref={sectionRef} id="products" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            {/* <p className={`${fonts.sm} uppercase  text-muted-foreground mb-3`}>
              {t("header.subtitle")}
            </p> */}
            <h2 className={`${fontHeading.md} font-bold text-foreground`}>
              {t("header.title")}
            </h2>
          </div>
          <a
            href={SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-3 ${fonts.lg} font-semibold  text-foreground hover:text-foreground transition-colors duration-300 group animated-underline`}
          >
            {t("cta.allProducts")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </div>

        {/* Products Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8"
          style={{ perspective: "1000px" }}
        >
          {/* 5 cards: 2 wide on the first row, 3 on the second */}
          {brandProducts.map((product, i) => (
            <a
              key={product.id}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`product-card group cursor-pointer relative overflow-hidden ${i < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}
            >
              {/* Image Container */}
              <div className={`relative ${i < 2 ? "aspect-4/5 lg:aspect-4/3" : "aspect-4/5"} overflow-hidden bg-secondary`}>
                <Image
                  src={product.image}
                  alt=""
                  fill
                  // 3:2 photo covering a 4:5 card is 1.875x the card width (4:3 wide cards: ~1.1x)
                  sizes={i < 2 ? "(max-width: 768px) 188vw, (max-width: 1024px) 94vw, 56vw" : "(max-width: 768px) 188vw, (max-width: 1024px) 94vw, 63vw"}
                  className="product-image object-cover scale-105"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Hover overlay */}
                <div className="product-overlay absolute inset-0 bg-primary/20 opacity-0 pointer-events-none" />
                
                {/* Content on image */}
                <div className="product-content absolute bottom-2 left-0 right-0 p-6">
                  <img
                    src={`/brands/${product.id}.svg`}
                    alt={`${product.id}.`}
                    // speculum.svg is 1792 units tall (room for the "p" descender) vs 1400 for the others; scale so letters match
                    className={`${product.id === "speculum" ? "h-[2.875rem] md:h-14 mb-1" : "h-9 md:h-11 mb-4"} w-auto`}
                  />
                  <h3 className={`${fonts["2xl"]} tracking-wide text-white/80`}>
                    {t(`items.${product.id}.name`)}
                  </h3>
                </div>

                {/* Arrow icon */}
                <div className="product-arrow absolute top-6 right-6">
                  <ArrowUpRight className="w-6 h-6 text-white/70" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Additional products link */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {shopProducts.map((id) => (
            <a
              key={id}
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-6 border border-border hover:border-foreground transition-colors duration-300"
            >
              <div>
                <span className={`${fonts["2xl"]}  tracking-normal text-muted-foreground block mb-3`}>
                  {t(`items.${id}.subtitle`)}
                </span>
                <span className={`${fontHeading.sm} text-foreground group-hover:text-foreground transition-colors duration-300`}>
                  {t(`items.${id}.name`)}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-2 transition-all duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}