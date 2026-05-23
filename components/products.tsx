"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { fonts, fontHeading } from "@/lib/fonts"

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    id: "murale",
    name: "Glasverkleidung",
    subtitle: "murale",
    description: "Elegante Wandverkleidungen aus hochwertigem Glas für exklusive Innenräume",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
  {
    id: "mutabilis",
    name: "Schaltbares Glas",
    subtitle: "mutabilis",
    description: "Innovative Technologie für maximale Privatsphäre auf Knopfdruck",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  },
  {
    id: "glasbilder",
    name: "Glasbilder",
    subtitle: "by kurth",
    description: "Kunstvolle Glasbilder als einzigartige Designelemente",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
  },
  {
    id: "spectabilis",
    name: "Spionspiegel",
    subtitle: "spectabilis",
    description: "Hochwertige Spionspiegel für besondere Anwendungen",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    id: "arcus",
    name: "Bogenglas",
    subtitle: "arcus",
    description: "Gebogenes Glas für architektonische Highlights",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: "luxar",
    name: "Entspiegeltes Glas",
    subtitle: "luxar",
    description: "Kristallklare Sicht ohne störende Reflexionen",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
  },
]

export function Products() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="products" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className={`${fonts.sm} uppercase text-muted-foreground mb-4`}>
              Unsere Produkte
            </p>
            <h2 className={`${fontHeading.md} font-bold text-foreground`}>
              Glas trifft <span className="text-foreground">Design</span>
            </h2>
          </div>
          <a
            href="#"
            className={`inline-flex items-center gap-3 ${fonts.sm} font-semibold uppercase text-primary hover:text-foreground transition-colors duration-300 group animated-underline`}
          >
            Alle Produkte
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </div>

        {/* Products Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: "1000px" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card group cursor-pointer relative overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image w-full h-full object-cover scale-105"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Hover overlay */}
                <div className="product-overlay absolute inset-0 bg-primary/20 opacity-0 pointer-events-none" />
                
                {/* Content on image */}
                <div className="product-content absolute bottom-2 left-0 right-0 p-6">
                  <span className={`${fonts.xs} font-bold uppercase text-white/70 mb-2 block`}>
                    {product.subtitle}
                  </span>
                  <h3 className={`${fontHeading.sm} text-white mb-2`}>
                    {product.name}
                  </h3>
                  <p className={`${fonts.xl} text-white/70 line-clamp-2`}>
                    {product.description}
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
          {[
            { name: "Ganzglas-System", subtitle: "murus" },
            { name: "Glasboden", subtitle: "pavimentum" },
            { name: "Spiegel", subtitle: "speculum" },
          ].map((item) => (
            <a
              key={item.subtitle}
              href="#"
              className="group flex items-center justify-between p-6 border border-border hover:border-primary transition-colors duration-300"
            >
              <div>
                <span className={`${fonts.xs} uppercase text-muted-foreground block mb-1`}>
                  {item.subtitle}
                </span>
                <span className={`${fonts.xl} text-foreground group-hover:text-primary transition-colors duration-300`}>
                  {item.name}
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
