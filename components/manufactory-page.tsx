"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowDown, ArrowDownRight, Play } from "lucide-react"
import { useTranslations } from "next-intl"
import { fonts, fontHeading } from "@/lib/fonts"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const services = [
  {
    id: "glassCutting",
    video: "https://www.pexels.com/download/video/7219716/",
    poster: "https://images.pexels.com/videos/7219716/pexels-photo-7219716.jpeg?auto=compress&cs=tinysrgb&w=1600",
    specs: ["0.5 – 24 mm", "35 × 35 mm", "3210 × 5100 mm"],
  },
  {
    id: "edgeProcessing",
    video: "https://www.pexels.com/download/video/7219703/",
    poster: "https://images.pexels.com/videos/7219703/pexels-photo-7219703.jpeg?auto=compress&cs=tinysrgb&w=1600",
    specs: ["0.5 – 24 mm", "20 × 20 mm", "3210 × 4000 mm"],
  },
  {
    id: "waterjet",
    video: "https://www.pexels.com/download/video/7219717/",
    poster: "https://images.pexels.com/videos/7219717/pexels-photo-7219717.jpeg?auto=compress&cs=tinysrgb&w=1600",
    specs: ["0.5 – 50 mm", "10 × 10 mm", "2000 × 4000 mm"],
  },
  {
    id: "cnc",
    video: "https://www.pexels.com/download/video/7519304/",
    poster: "https://images.pexels.com/videos/7519304/pexels-photo-7519304.jpeg?auto=compress&cs=tinysrgb&w=1600",
    specs: ["3 – 50 mm", "160 × 160 mm", "2000 × 4000 mm"],
  },
  {
    id: "ceramicPrint",
    video: "https://www.pexels.com/download/video/7519305/",
    poster: "https://images.pexels.com/videos/7519305/pexels-photo-7519305.jpeg?auto=compress&cs=tinysrgb&w=1600",
    specs: ["0.5 – 50 mm", "10 × 10 mm", "2400 × 4000 mm"],
  },
  {
    id: "tempering",
    video: "https://www.pexels.com/download/video/7520876/",
    poster: "https://images.pexels.com/videos/7520876/pexels-photo-7520876.jpeg?auto=compress&cs=tinysrgb&w=1600",
    specs: ["3 – 24 mm", "100 × 100 mm", "2400 × 4200 mm"],
  },
  {
    id: "curvedGlass",
    video: "https://www.pexels.com/download/video/7519880/",
    poster: "https://images.pexels.com/videos/7519880/pexels-photo-7519880.jpeg?auto=compress&cs=tinysrgb&w=1600",
    specs: ["4 – 24 mm", "200 × 300 mm", "2400 × 2400 mm"],
  },
  {
    id: "painting",
    video: "https://www.pexels.com/download/video/7519300/",
    poster: "https://images.pexels.com/videos/7519300/pexels-photo-7519300.jpeg?auto=compress&cs=tinysrgb&w=1600",
    specs: ["RAL + NCS", "2K + enamel", "Interior + furniture"],
  },
] as const

export function ManufactoryPage() {
  const t = useTranslations("ManufactoryPage")
  const pageRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const heroTimeline = gsap.timeline({ delay: 0.2 })
    heroTimeline
      .fromTo(
        ".manufactory-hero-reveal",
        { y: 90, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.13, ease: "power4.out" }
      )
      .fromTo(
        ".manufactory-stat",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" },
        "-=0.5"
      )

    gsap.fromTo(
      ".process-index-panel",
      { y: 65, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".process-index-panel", start: "top 95%" },
      }
    )

    gsap.fromTo(
      ".manufactory-index-item",
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.055,
        ease: "power3.out",
        scrollTrigger: { trigger: ".process-index-panel", start: "top 92%" },
      }
    )

    gsap.to(".manufactory-hero-image", {
      yPercent: 12,
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    })

    const chapters = gsap.utils.toArray<HTMLElement>(".service-chapter")
    chapters.forEach((chapter) => {
      const media = chapter.querySelector(".service-media")
      const details = chapter.querySelectorAll(".service-detail-reveal")

      gsap.fromTo(
        media,
        { y: 80, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: chapter, start: "top 78%" },
        }
      )

      gsap.fromTo(
        details,
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: chapter, start: "top 72%" },
        }
      )
    })
  }, { scope: pageRef })

  const playVideo = (video: HTMLVideoElement) => {
    video.play().catch(() => undefined)
  }

  const resetVideo = (video: HTMLVideoElement) => {
    video.pause()
    video.currentTime = 0
  }

  return (
    <div ref={pageRef} className="bg-neutral-950 text-white">
      <section ref={heroRef} className="relative min-h-[94svh] overflow-hidden bg-neutral-950 text-white">
        <div
          aria-hidden="true"
          className="manufactory-hero-image absolute inset-0 h-full w-full bg-cover bg-center opacity-65"
          style={{ backgroundImage: "url(https://images.pexels.com/photos/36423794/pexels-photo-36423794.jpeg?auto=compress&cs=tinysrgb&w=2400)" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-black/10 to-black/55" />
        <div className="absolute inset-y-0 left-[8%] hidden w-px bg-white/10 lg:block" />
        <div className="absolute inset-y-0 right-[8%] hidden w-px bg-white/10 lg:block" />
        <div className="absolute right-[8%] top-0 hidden h-[38%] w-[28%] border-b border-l border-white/10 lg:block" />
        <div className="absolute -right-16 top-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        <p className={`manufactory-hero-reveal ${fonts.xs} absolute left-7 top-1/2 hidden -translate-y-1/2 -rotate-90 tracking-[0.35em] text-white/35 xl:block`}>
          {t("hero.verticalLabel")}
        </p>

        <div className="container relative mx-auto grid min-h-[94svh] grid-cols-1 content-end px-6 pb-32 pt-36 lg:grid-cols-12 lg:gap-x-10 lg:pb-40">
          <div className="lg:col-span-9">
            <div className="manufactory-hero-reveal flex items-center gap-4">
              <span className="h-px w-12 bg-white/45" />
              <p className={`${fonts.lg} tracking-[0.2em] text-white/60`}>
                {t("hero.eyebrow")}
              </p>
            </div>
            <h1 className={`manufactory-hero-reveal ${fontHeading.hero} mt-7 max-w-6xl font-bold leading-[0.8] tracking-[-0.06em]`}>
              {t("hero.title")}
            </h1>
          </div>

          <div className="manufactory-hero-reveal mt-8 flex items-end justify-between border-t border-white/20 pt-6 lg:col-span-3 lg:mt-0 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <span className="text-[5rem] font-bold leading-none tracking-[-0.08em] text-white/15 lg:text-[8rem]">08</span>
            <p className={`${fonts.sm} max-w-32 text-right tracking-[0.16em] text-white/50`}>
              {t("hero.processCount")}
            </p>
          </div>

          <div className="manufactory-hero-reveal mt-10 grid gap-8 border-t border-white/20 pt-8 lg:col-span-12 lg:grid-cols-12">
            <p className={`${fonts["2xl"]} max-w-3xl leading-relaxed text-white/65 lg:col-span-6`}>
              {t("hero.description")}
            </p>
            <div className="grid grid-cols-3 gap-3 lg:col-span-4 lg:col-start-8">
              <div className="manufactory-stat border-l border-white/20 pl-4">
                <strong className={`${fonts["3xl"]} block font-semibold text-white`}>70+</strong>
                <span className={`${fonts.lg} mt-2 block text-white/40`}>{t("hero.years")}</span>
              </div>
              <div className="manufactory-stat border-l border-white/20 pl-4">
                <strong className={`${fonts["3xl"]} block font-semibold text-white`}>08</strong>
                <span className={`${fonts.lg} mt-2 block text-white/40`}>{t("hero.processes")}</span>
              </div>
              <div className="manufactory-stat border-l border-white/20 pl-4">
                <strong className={`${fonts["3xl"]} block font-semibold text-white`}>CH</strong>
                <span className={`${fonts.lg} mt-2 block text-white/40`}>{t("hero.origin")}</span>
              </div>
            </div>
            <div className="flex items-end lg:col-span-1 lg:justify-end">
              <a href="#processes" aria-label={t("hero.explore")} className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/35 text-white transition-colors duration-300 hover:bg-white hover:text-neutral-950">
                <ArrowDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="processes" className="relative z-20 -mt-20 border-b border-white/10 bg-transparent pb-12">
        <div className="container mx-auto px-6">
          <div className="process-index-panel overflow-hidden border border-white/10 bg-neutral-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex items-end justify-between border-b border-white/10 px-6 py-5 md:px-8">
              <div>
                <p className={`${fonts.lg} tracking-widest text-white/35`}>{t("index.eyebrow")}</p>
                <h2 className={`${fonts["2xl"]} mt-2 font-semibold text-white`}>{t("index.title")}</h2>
              </div>
              <span className={`${fonts.xs} hidden text-white/30 md:block`}>01 — 08</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {services.map((service, index) => (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className={`manufactory-index-item ${fonts.sm} group relative flex min-h-32 min-w-0 flex-col justify-between overflow-hidden border-b border-r border-white/10 p-4 text-white/55 transition-colors duration-300 hover:bg-white hover:text-neutral-950 lg:min-h-40 lg:border-b-0 lg:p-5`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl font-semibold tracking-tighter text-white/20 transition-colors duration-300 group-hover:text-neutral-950/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowDownRight className="h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" />
                  </div>
                  <span
                    title={t(`items.${service.id}.title`)}
                    className={`${fonts.lg} block max-w-full truncate font-semibold leading-tight transition-colors duration-300 group-hover:text-neutral-950`}
                  >
                    {t(`items.${service.id}.title`)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {services.map((service, index) => {
        const reverse = index % 2 === 1
        const specLabels = service.id === "painting"
          ? [t("labels.colors"), t("labels.finishes"), t("labels.applications")]
          : [t("labels.thickness"), t("labels.minimum"), t("labels.maximum")]

        return (
          <article
            key={service.id}
            id={service.id}
            className={`service-chapter scroll-mt-20 border-b border-white/10 py-20 md:py-28 ${index % 2 === 1 ? "bg-neutral-900" : "bg-neutral-950"}`}
          >
            <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16">
              <div className={`service-media relative lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
                <div
                  className="group relative aspect-video overflow-hidden bg-neutral-950 shadow-2xl shadow-black/10"
                  onMouseEnter={(event) => {
                    const video = event.currentTarget.querySelector("video")
                    if (video) playVideo(video)
                  }}
                  onMouseLeave={(event) => {
                    const video = event.currentTarget.querySelector("video")
                    if (video) resetVideo(video)
                  }}
                >
                  <video
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={service.poster}
                    tabIndex={0}
                    aria-label={t(`items.${service.id}.videoTitle`)}
                    onFocus={(event) => playVideo(event.currentTarget)}
                    onBlur={(event) => resetVideo(event.currentTarget)}
                    onClick={(event) => {
                      if (event.currentTarget.paused) {
                        playVideo(event.currentTarget)
                      }
                    }}
                    className="absolute inset-0 h-full w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  >
                    <source src={service.video} type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 bg-black/15 transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0" />
                  <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/20 text-white backdrop-blur-sm transition-all duration-500 group-hover:scale-75 group-hover:opacity-0 group-focus-within:scale-75 group-focus-within:opacity-0">
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  </span>
                </div>
              </div>

              <div className={`lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}>
                <p className={`service-detail-reveal ${fonts.lg} tracking-[0.18em] text-white/40`}>
                  {t(`items.${service.id}.kicker`)}
                </p>
                <h2 className={`service-detail-reveal ${fontHeading.md} mt-5 font-bold text-white`}>
                  {t(`items.${service.id}.title`)}
                </h2>
                <p className={`service-detail-reveal ${fonts.xl} mt-7 leading-relaxed text-white/60`}>
                  {t(`items.${service.id}.description`)}
                </p>

                <div className="service-detail-reveal mt-9 grid grid-cols-3 border-y border-white/10 py-5">
                  {service.specs.map((spec, specIndex) => (
                    <div key={spec} className={specIndex > 0 ? "border-l border-white/10 pl-4" : "pr-4"}>
                      <span className={`${fonts.lg} block text-white/35`}>{specLabels[specIndex]}</span>
                      <strong className={`${fonts.base} mt-2 block font-semibold text-white`}>{spec}</strong>
                    </div>
                  ))}
                </div>

                <ul className="service-detail-reveal mt-8 space-y-3">
                  {["feature1", "feature2", "feature3"].map((feature) => (
                    <li key={feature} className={`${fonts.lg} flex gap-3 text-white/55`}>
                      <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                      {t(`items.${service.id}.${feature}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
