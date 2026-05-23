"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MapPin, Phone, Mail, Navigation } from "lucide-react"
import { fonts, fontHeading } from "@/lib/fonts"

gsap.registerPlugin(ScrollTrigger)

const showrooms = [
  {
    name: "KURTH Glas und Spiegel AG",
    location: "Zuchwil",
    address: "Zuchwil, Schweiz",
    phone: "+41 32 685 XX XX",
    email: "info@kurth-glas.ch",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
]

export function Showrooms() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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
            start: "top 80%",
          },
        }
      )

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll(".showroom-card")
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="showrooms" className="py-24 md:py-32 bg-[#111111]">
      <div className="container mx-auto px-6">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <p className={`${fonts.sm} font-bold uppercase text-muted-foreground mb-4`}>
            Besuchen Sie uns
          </p>
          <h2 className={`${fontHeading.md} font-bold text-foreground`}>
            Unser <span className="text-foreground">Standort</span>
          </h2>
        </div>

        {/* Showroom card */}
        <div
          ref={cardsRef}
          className="max-w-4xl mx-auto"
        >
          {showrooms.map((showroom) => (
            <div
              key={`${showroom.name}-${showroom.location}`}
              className="showroom-card group bg-background border border-border overflow-hidden grid md:grid-cols-2"
            >
              {/* Image */}
              <div className="relative aspect-video md:aspect-auto overflow-hidden">
                <img
                  src={showroom.image}
                  alt={`${showroom.name} ${showroom.location}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className={`${fonts['2xl']} font-bold text-foreground mb-1`}>
                  {showroom.name}
                </h3>
                <p className={`text-primary ${fonts.lg} mb-8`}>{showroom.location}</p>

                <div className="space-y-4 mb-8">
                  <div className={`flex items-center gap-4 ${fonts.sm} font-semibold text-muted-foreground`}>
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <span>{showroom.address}</span>
                  </div>
                  <div className={`flex items-center gap-4 ${fonts.sm} font-semibold  text-muted-foreground`}>
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <span>{showroom.phone}</span>
                  </div>
                  <div className={`flex items-center gap-4 ${fonts.sm} font-semibold  text-muted-foreground`}>
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span>{showroom.email}</span>
                  </div>
                </div>

                <button className={`inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-4 ${fonts.sm} font-bold uppercase  hover:bg-foreground hover:text-black transition-colors duration-300 w-fit`}>
                  <Navigation className="w-4 h-4 font" />
                  Route planen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
