"use client"

import { ShoppingBag } from "lucide-react"
import { fonts } from "@/lib/fonts"
import { SHOP_URL } from "@/lib/site"

interface ShopButtonProps {
  label: string
  isScrolled?: boolean
  variant?: "desktop" | "mobile"
  onClick?: () => void
}

// "Glass glint" shop CTA: a fill sweeps up on hover, a light reflection streaks
// across (a nod to the glass brand), and the bag icon lifts. All animation is
// transform/opacity only, so it's composited and cheap.
export function ShopButton({ label, isScrolled = false, variant = "desktop", onClick }: ShopButtonProps) {
  const isMobile = variant === "mobile"
  // Both the scrolled header and the mobile menu sit on a dark surface, so they
  // use the light "foreground" token; the transparent hero state uses pure white.
  const onDarkSurface = isScrolled || isMobile

  return (
    <a
      href={SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden border font-normal transition-colors duration-300 ${
        isMobile ? `px-6 py-2 ${fonts.sm} uppercase tracking-widest` : `px-5 py-2 ${fonts["2xl"]} tracking-wide`
      } ${onDarkSurface ? "border-foreground text-foreground" : "border-white/60 text-white"}`}
    >
      {/* Fill sweep — rises from the bottom on hover */}
      <span
        aria-hidden
        className={`absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 ${
          onDarkSurface ? "bg-foreground" : "bg-white"
        }`}
      />

      {/* Glass reflection — a diagonal light streak that sweeps across on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/3 -translate-x-[350%] -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[350%]"
      />

      {/* Label + icon */}
      <span
        className={`relative z-10 inline-flex items-center gap-2 transition-colors duration-300 ${
          onDarkSurface ? "group-hover:text-background" : "group-hover:text-black"
        }`}
      >
        <ShoppingBag className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:-rotate-6" />
        {label}
      </span>
    </a>
  )
}
