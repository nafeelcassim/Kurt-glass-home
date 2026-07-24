"use client"

// Thin client "animator" wrappers. Each one renders the section's root element,
// establishes a GSAP scope, and runs the *exact* animation the original client
// component ran — but the section's content is server-rendered and slotted in as
// `children`, so copy/translations/images cost zero client hydration.
import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/lib/gsap"

export function ManufacturingAnimation({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const revealElements = scope.current?.querySelectorAll(".manufacturing-reveal")
      if (revealElements && revealElements.length > 0) {
        gsap.fromTo(
          revealElements,
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: scope.current,
              start: "top 75%",
            },
          }
        )
      }

      const video = scope.current?.querySelector(".manufacturing-video")
      if (video) {
        gsap.fromTo(
          video,
          { scale: 1.08, yPercent: -3 },
          {
            scale: 1.15,
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        )
      }
    },
    { scope }
  )

  return (
    <section
      ref={scope}
      id="manufacturing"
      className="relative min-h-[72vh] overflow-hidden bg-neutral-950"
    >
      {children}
    </section>
  )
}

export function FooterAnimation({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top 78%",
        },
      })

      timeline
        .fromTo(
          ".footer-intro",
          { y: 65, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" }
        )
        .fromTo(
          ".footer-column",
          { y: 55, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.45"
        )
        .fromTo(
          ".footer-bottom",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" },
          "-=0.25"
        )
    },
    { scope }
  )

  return (
    <footer ref={scope} className="relative overflow-hidden bg-neutral-950 text-white">
      {children}
    </footer>
  )
}
