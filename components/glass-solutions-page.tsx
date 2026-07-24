"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { fonts, fontHeading } from "@/lib/fonts"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type SolutionType = "interior" | "exterior"

const catalogues: Record<SolutionType, Array<{ id: string; href: string; image: string }>> = {
  interior: [
    { id: "wallCladding", href: "https://www.kurth-glas.ch/glasverkleidung", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85" },
    { id: "switchableGlass", href: "https://www.kurth-glas.ch/schaltbares-glas", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85" },
    { id: "allGlassSystems", href: "https://www.kurth-glas.ch/ganzglas-system", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85" },
    { id: "mirrors", href: "https://www.kurth-glas.ch/spiegel", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85" },
    { id: "twoWayMirrors", href: "https://www.kurth-glas.ch/spionspiegel", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85" },
    { id: "antiReflectiveGlass", href: "https://www.kurth-glas.ch/luxar", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=85" },
    { id: "curvedGlass", href: "https://www.kurth-glas.ch/bogenglas", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85" },
    { id: "glassFloors", href: "https://www.kurth-glas.ch/glasboden", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" },
  ],
  exterior: [
    { id: "facadeGlazing", href: "https://www.kurth-glas.ch/glas", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85" },
    { id: "safetyGlass", href: "https://www.kurth-glas.ch/manufaktur", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=85" },
    { id: "balustrades", href: "https://www.kurth-glas.ch/glas", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85" },
    { id: "outdoorKitchen", href: "https://www.kurth-glas.ch/outdoor-kitchen", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85" },
    { id: "curvedArchitecture", href: "https://www.kurth-glas.ch/bogenglas", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85" },
    { id: "glassFloors", href: "https://www.kurth-glas.ch/glasboden", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85" },
  ],
}

export function GlassSolutionsPage({ type }: { type: SolutionType }) {
  const pageRef = useRef<HTMLElement>(null)
  const t = useTranslations("GlassSolutionsPage")
  const products = catalogues[type]

  useGSAP(() => {
    const timeline = gsap.timeline({ delay: 0.15 })
    timeline
      .fromTo(".solution-hero-reveal", { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.95, stagger: 0.12, ease: "power4.out" })
      .fromTo(".solution-hero-line", { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, "-=0.45")

    gsap.fromTo(
      ".solution-product-card",
      { y: 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".solution-catalogue", start: "top 78%" },
      }
    )
  }, { scope: pageRef })

  return (
    <main ref={pageRef} className="bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-6 pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="pointer-events-none absolute -left-36 top-10 h-112 w-md rounded-full bg-sky-200/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-36 bottom-0 h-112 w-md rounded-full bg-amber-100/10 blur-3xl" />
        <div className="container relative mx-auto">
          <div className="mt-16 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className={`solution-hero-reveal ${fonts.lg} tracking-[0.2em] text-white/50`}>{t(`types.${type}.eyebrow`)}</p>
              <h1 className={`solution-hero-reveal ${fontHeading.hero} mt-6 max-w-5xl font-bold text-white`}>
                {t(`types.${type}.title`)}
              </h1>
            </div>
            <p className={`solution-hero-reveal ${fonts.xl} max-w-md leading-relaxed text-white/60 lg:col-span-4 lg:pb-3`}>
              {t(`types.${type}.description`)}
            </p>
          </div>
          <div className="solution-hero-line mt-16 h-px origin-left bg-white/20" />
          <div className="solution-hero-reveal mt-6 flex items-center justify-between">
            <span className={`${fonts.sm} tracking-[0.16em] text-white/40`}>{t("catalogueLabel")}</span>
            <span className={`${fonts.sm} text-white/40`}>{String(products.length).padStart(2, "0")}</span>
          </div>
        </div>
      </section>

      <section className="solution-catalogue px-6 py-16 md:py-24">
        <div className="container mx-auto grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <a
              key={product.id}
              href={product.href}
              target="_blank"
              rel="noreferrer"
              className="solution-product-card group block"
            >
              <div className="relative aspect-4/5 overflow-hidden bg-neutral-900">
                <Image
                  src={product.image}
                  alt={t(`products.${product.id}.title`)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/20 px-5 py-4 text-white/65">
                  <span className={`${fonts.sm}`}>{String(index + 1).padStart(2, "0")}</span>
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className={`${fonts["2xl"]} tracking-[0.16em] text-white/60`}>{t(`products.${product.id}.category`)}</p>
                  <h2 className={`${fontHeading.sm} mt-3 font-bold text-white`}>{t(`products.${product.id}.title`)}</h2>
                </div>
              </div>
              <p className={`${fonts["2xl"]} mt-5 max-w-md leading-relaxed text-white/55 transition-colors duration-300 group-hover:text-white/75`}>
                {t(`products.${product.id}.description`)}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 md:py-20">
        <div className="container mx-auto flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className={`${fonts.lg} tracking-[0.18em] text-white/45`}>{t("consultation.eyebrow")}</p>
            <h2 className={`${fontHeading.md} mt-4 max-w-2xl font-bold`}>{t("consultation.title")}</h2>
          </div>
          <a href="https://outlook.office365.com/owa/calendar/KurthGlasSpiegelAG@kurth-glas.ch/bookings/" target="_blank" rel="noreferrer" className={`${fonts.lg} group inline-flex items-center gap-4 font-semibold text-white animated-underline`}>
            {t("consultation.cta")}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </main>
  )
}
