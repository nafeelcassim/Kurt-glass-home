import { getTranslations } from "next-intl/server"
import { ArrowUpRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { fonts, fontHeading } from "@/lib/fonts"
import { ManufacturingAnimation } from "@/components/section-animations"

export async function Manufacturing() {
  const t = await getTranslations("Manufacturing")

  return (
    <ManufacturingAnimation>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://images.pexels.com/videos/7519304/pexels-photo-7519304.jpeg?auto=compress&cs=tinysrgb&w=1920"
        aria-hidden="true"
        className="manufacturing-video absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://www.pexels.com/download/video/7519304/"
          type="video/mp4"
        />
        <source
          src="https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/55 to-transparent" />

      <div className="container relative mx-auto flex min-h-[72vh] items-end px-6 py-16 md:py-24">
        <div className="max-w-3xl text-white">
          <p className={`manufacturing-reveal ${fonts.lg} mb-5 tracking-[0.18em] text-white/65`}>
            {t("eyebrow")}
          </p>
          <h2 className={`manufacturing-reveal ${fontHeading.lg} max-w-3xl font-bold text-white`}>
            {t("title")}
          </h2>
          <p className={`manufacturing-reveal ${fonts["2xl"]} mt-6 max-w-2xl leading-relaxed text-white/70`}>
            {t("description")}
          </p>
          <Link
            href="/manufatory"
            className={`manufacturing-reveal ${fonts.lg} group mt-9 inline-flex items-center gap-4 font-semibold text-white animated-underline transition-colors duration-300 hover:text-white/70`}
          >
            {t("cta")}
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-white group-hover:text-neutral-950">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </div>
    </ManufacturingAnimation>
  )
}
