"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { fonts, fontHeading } from "@/lib/fonts"

// Register both plugins
gsap.registerPlugin(useGSAP, ScrollTrigger)

const productImages = [
  { id: "murale", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80" },
  { id: "mutabilis", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80" },
  { id: "glasbilder", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80" },
  { id: "spectabilis", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" },
  { id: "arcus", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  { id: "luxar", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80" },
]

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
            <p className={`${fonts.sm} uppercase  text-muted-foreground mb-3`}>
              {t("header.subtitle")}
            </p>
            <h2 className={`${fontHeading.md} font-bold text-foreground`}>
              {t("header.title")}
            </h2>
          </div>
          <a
            href="#"
            className={`inline-flex items-center gap-3 ${fonts.sm} font-semibold  text-primary hover:text-foreground transition-colors duration-300 group animated-underline`}
          >
            {t("cta.allProducts")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </div>

        {/* Products Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: "1000px" }}
        >
          {productImages.map((product) => (
            <div
              key={product.id}
              className="product-card group cursor-pointer relative overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-4/5 overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={t(`items.${product.id}.name`)}
                  className="product-image w-full h-full object-cover scale-105"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Hover overlay */}
                <div className="product-overlay absolute inset-0 bg-primary/20 opacity-0 pointer-events-none" />
                
                {/* Content on image */}
                <div className="product-content absolute bottom-2 left-0 right-0 p-6">
                  <span className={`${fonts.lg} font-normal tracking-wide text-white/70 mb-2 block`}>
                    {t(`items.${product.id}.subtitle`)}
                  </span>
                  <h3 className={`${fontHeading.sm} tracking-normal text-white mb-2 font-bold`}>
                    {t(`items.${product.id}.name`)}
                  </h3>
                  <p className={`${fonts.lg} text-white/70 tracking-wider line-clamp-2`}>
                    {t(`items.${product.id}.description`)}
                  </p>
                </div>

                {/* Arrow icon */}
                <div className="product-arrow absolute top-6 right-6">
                  <ArrowUpRight className="w-6 h-6 text-white/70" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional products link */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["murus", "pavimentum", "speculum"].map((id) => (
            <a
              key={id}
              href="#"
              className="group flex items-center justify-between p-6 border border-border hover:border-primary transition-colors duration-300"
            >
              <div>
                <span className={`${fonts.xs} uppercase tracking-widest text-muted-foreground block mb-1`}>
                  {t(`items.${id}.subtitle`)}
                </span>
                <span className={`${fonts['2xl']} text-foreground group-hover:text-primary transition-colors duration-300`}>
                  {t(`items.${id}.name`)}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}