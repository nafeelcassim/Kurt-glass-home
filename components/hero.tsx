"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronDown } from "lucide-react"
import { fonts, fontHeading } from "@/lib/fonts"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation timeline
      const tl = gsap.timeline({ delay: 0.5 })

      // Split title animation - letter by letter
      const titleChars = titleRef.current?.querySelectorAll(".char")
      if (titleChars) {
        gsap.set(titleChars, { y: 120, opacity: 0, rotateX: -90 })
        tl.to(titleChars, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.05,
        })
      }

      // Tagline image fade in and scale up
      tl.fromTo(
        taglineRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
        "-=0.3"
      )

      // Scroll indicator fade in
      tl.fromTo(
        scrollIndicatorRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      )

      // Continuous bounce for scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.5,
      })

      // Parallax effect on video
      gsap.to(videoRef.current, {
        y: 150,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })

      // Text fade out on scroll
      gsap.to(titleRef.current, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "40% top",
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Split text into individual characters for each line
  const renderChars = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ perspective: "1000px" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div ref={titleRef} className="flex flex-col items-center">
          <span className={`${fontHeading.hero} font-bold text-white uppercase`}>
            {renderChars("KURTH")}
          </span>
          <span className={`${fontHeading.hero} font-bold text-white uppercase mt-2 md:mt-4`}>
            {renderChars("GLAS")}
          </span>

          {/* Tagline image */}
          <div ref={taglineRef} className="mt-6 md:mt-10">
            <Image
              src="/wording.png"
              alt="glas trifft design."
              width={1024}
              height={900}
              className="w-32 sm:w-40 md:w-52 lg:w-64 xl:w-72 h-auto invert opacity-90"
              priority
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className={`${fonts.xs} uppercase text-white/60`}>
          Entdecken
        </span>
        <ChevronDown className="w-5 h-5 text-white/60" />
      </div>
    </section>
  )
}
