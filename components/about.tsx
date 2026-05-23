"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { fonts, fontHeading } from "@/lib/fonts"

gsap.registerPlugin(ScrollTrigger)

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation - split into lines
      const headingLines = headingRef.current?.querySelectorAll(".line")
      if (headingLines) {
        gsap.fromTo(
          headingLines,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
            },
          }
        )
      }

      // Text fade in
      gsap.fromTo(
        textRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
          },
        }
      )

      // Image reveal
      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 75%",
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-24 md:py-32 bg-[#001800] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Content */}
          <div>
            <h2
              ref={headingRef}
              className={`${fontHeading.lg} mb-8 leading-[1.1]`}
            >
              <span className="line block overflow-hidden">
                <span className="inline-block font-bold">glas</span>
              </span>
              <span className="line block overflow-hidden">
                <span className="inline-block font-bold">hautnah</span>
              </span>
              <span className="line block overflow-hidden">
                <span className="inline-block font-bold">erlebenr</span>
              </span>
            </h2>

            <div ref={textRef} className="space-y-6">
              <p className={`${fonts.lg} font-bold text-muted-foreground`}>
                Glas - ein zeitloses und faszinierendes Element, das in der 
                Innenausstattung unverzichtbar geworden ist. Es symbolisiert 
                Design und Klarheit und verkörpert einen ganz eigenen Lifestyle.
              </p>
              <p className={`${fonts.lg} font-bold text-muted-foreground`}>
                Bei KURTH Glas und Spiegel AG verschmilzt Handwerkskunst mit 
                einem tiefen Verständnis für Ästhetik und schafft somit eine 
                einzigartige Synthese aus Form und Funktion. Eine hochinnovative 
                Infrastruktur in Zuchwil hebt das inhabergeführte Unternehmen ab.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="#"
                  className={`inline-flex items-center gap-3 ${fonts.sm} uppercase  text-primary hover:text-foreground transition-colors duration-300 group animated-underline`}
                >
                  Unsere Geschichte
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <Link
                  href="#"
                  className={`inline-flex items-center gap-3 ${fonts.sm} uppercase  text-muted-foreground hover:text-foreground transition-colors duration-300 group`}
                >
                  <Play className="w-4 h-4" />
                  Videos ansehen
                </Link>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="relative aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              alt="Glas Handwerkskunst"
              className="w-full h-full object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-8 hidden md:block">
              <span className={fonts['5xl']}>50+</span>
              <p className={`${fonts.sm} uppercase tracking-wider mt-2`}>
                Jahre
                <br />
                Erfahrung
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
