"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Recalculate every ScrollTrigger's start/end positions after each navigation
  // — including a client-side locale switch, which swaps the page content for the
  // new language without a full reload. Sections are hidden by default (opacity:0)
  // and only revealed when their trigger enters the viewport; without refreshing
  // after the new content lays out, those triggers keep stale positions, never
  // fire, and the whole page stays blank. Two rAFs let layout/images settle first.
  useEffect(() => {
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [pathname])

  // Note: we intentionally do NOT globally kill ScrollTriggers here. Each animated
  // component creates its triggers inside useGSAP, whose scoped context reverts and
  // kills them on unmount. A blanket kill on this wrapper races with the sections
  // the next locale has just mounted and tears their fresh triggers down too.

  return <>{children}</>
}
