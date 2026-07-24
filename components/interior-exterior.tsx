"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { fonts, fontHeading } from "@/lib/fonts"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const solutions = [
  {
    id: "interior",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "exterior",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
  },
]

export function InteriorExterior() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations("InteriorExterior")

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 72%",
      },
    })

    timeline
      .fromTo(".glass-solutions-intro", { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" })
      .fromTo(".glass-solutions-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, "-=0.45")
      .fromTo(".glass-solutions-card", { y: 80, opacity: 0, clipPath: "inset(12% 0 0 0)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.05, stagger: 0.16, ease: "power4.out" }, "-=0.75")
      .fromTo(".glass-solutions-card-content", { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.14, ease: "power3.out" }, "-=0.55")
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="interior-exterior" className="relative overflow-hidden bg-neutral-950 py-24 text-white md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-white/10" />
      <div className="pointer-events-none absolute -left-28 top-1/3 h-96 w-96 rounded-full bg-cyan-200/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 bottom-0 h-112 w-md rounded-full bg-amber-200/8 blur-3xl" />

      <div className="container relative mx-auto px-6">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="glass-solutions-intro flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-white/55" />
              <p className={`${fonts.lg} tracking-[0.18em] text-white/50`}>{t("eyebrow")}</p>
            </div>
            <h2 className={`glass-solutions-intro ${fontHeading.lg} mt-5 max-w-4xl font-bold text-white`}>
              {t("title.line1")}<br />
              <span className="text-white/45">{t("title.line2")}</span>
            </h2>
          </div>

          <div className="glass-solutions-intro lg:col-span-4 lg:col-start-9">
            <p className={`${fonts.xl} max-w-md leading-relaxed text-white/60`}>{t("description")}</p>
          </div>
        </div>

        <div className="glass-solutions-rule mt-14 h-px origin-left bg-white/20 md:mt-20" />

        <div className="mt-7 grid gap-5 lg:grid-cols-2 lg:gap-7">
          {solutions.map((solution, index) => (
            <Link key={solution.id} href={`/glass-solutions/${solution.id}`} className="glass-solutions-card group relative block min-h-136 overflow-hidden bg-neutral-900">
              <Image
                src={solution.image}
                alt={t(`cards.${solution.id}.imageAlt`)}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-black/5" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/20 px-6 py-5 md:px-8">
                <span className={`${fonts.sm} tracking-[0.18em] text-white/65`}>{String(index + 1).padStart(2, "0")}</span>
                <span className={`${fonts.sm} tracking-[0.18em] text-white/65`}>{t(`cards.${solution.id}.label`)}</span>
              </div>

              <div className="glass-solutions-card-content absolute inset-x-0 bottom-0 p-6 md:p-9">
                <p className={`${fonts["2xl"]} tracking-[0.16em] text-white/55`}>{t(`cards.${solution.id}.eyebrow`)}</p>
                <h3 className={`${fontHeading.sm} mt-4 max-w-lg font-bold text-white`}>{t(`cards.${solution.id}.title`)}</h3>
                <div className="mt-7 border-t border-white/25 pt-5">
                  <div className="flex items-start justify-between gap-6">
                    <p className={`${fonts["2xl"]} max-w-md leading-relaxed text-white/70`}>{t(`cards.${solution.id}.description`)}</p>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-white group-hover:text-neutral-950">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                    {["application1", "application2", "application3"].map((application) => (
                      <li key={application} className={`${fonts.xs} flex items-center gap-2 text-white/55`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                        {t(`cards.${solution.id}.${application}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
