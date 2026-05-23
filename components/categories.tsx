"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fonts, fontHeading } from "@/lib/fonts"

gsap.registerPlugin(ScrollTrigger)

const categories = [
  { name: "Glasverkleidung", subtitle: "murale", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80" },
  { name: "Schaltbares Glas", subtitle: "mutabilis", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80" },
  { name: "Glasbilder", subtitle: "by kurth", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80" },
  { name: "Spionspiegel", subtitle: "spectabilis", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" },
  { name: "Bogenglas", subtitle: "arcus", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  { name: "Entspiegeltes Glas", subtitle: "luxar", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80" },
  { name: "Ganzglas-System", subtitle: "murus", image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80" },
  { name: "Spiegel", subtitle: "speculum", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" },
]

export function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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
      const cards = carouselRef.current?.querySelectorAll(".category-card")
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

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
    <section ref={sectionRef} id="categories" className="py-24 md:py-32 overflow-hidden bg-[#141414]">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex items-end justify-between">
          <h2
            ref={titleRef}
            className={`${fontHeading.md} font-bold text-foreground`}
          >
            Unsere <br />
            <span className="text-foreground">Kategorien</span>
          </h2>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-3 border border-border hover:border-primary hover:text-primary transition-colors duration-300 bg-background"
              aria-label="Zurück"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 border border-border hover:border-primary hover:text-primary transition-colors duration-300 bg-background"
              aria-label="Weiter"
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
        {categories.map((category, index) => (
          <div
            key={category.name}
            className="category-card flex-shrink-0 w-72 md:w-80 group cursor-pointer"
          >
            <div className="relative aspect-[3/4] overflow-hidden mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className={`${fonts.xs} font-bold uppercase  text-white/70 mb-2 block`}>
                  {category.subtitle}
                </span>
                <h3 className={`${fonts['2xl']} text-white group-hover:text-accent transition-colors duration-300`}>
                  {category.name}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
