import Link from "next/link"
import { ArrowUpRight, Instagram, Linkedin } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { fonts, fontHeading } from "@/lib/fonts"
import { SHOP_URL } from "@/lib/site"
import { FooterAnimation } from "@/components/section-animations"

const manufacturingKeys = ["glaszuschnitt", "kantenbearbeitung", "wasserstrahlschneiden", "glasbearbeitung", "keramikdigitaldruck", "vorspannanlage", "bogenglas", "lackiererei"]
const manufacturingHrefs = [
  "https://www.kurth-glas.ch/glaszuschnitt-2",
  "https://www.kurth-glas.ch/kopie-von-glaszuschnitt",
  "https://www.kurth-glas.ch/kopie-von-kantenbearbeitung",
  "https://www.kurth-glas.ch/kopie-von-wasserstrahlschneiden",
  "https://www.kurth-glas.ch/kopie-von-glasbearbeitung",
  "https://www.kurth-glas.ch/kopie-von-keramikdigitaldruck",
  "https://www.kurth-glas.ch/kopie-von-vorspannanlage",
  "https://www.kurth-glas.ch/kopie-von-bogenglas",
]
const contactKeys = ["standort", "kontakt", "karriere"]
const contactHrefs = ["#showrooms", "#showrooms", "#"]

export async function Footer() {
  const t = await getTranslations("Footer")

  return (
    <FooterAnimation>
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-white/4 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-120 w-120 rounded-full bg-white/3 blur-3xl" />

      <div className="container relative mx-auto px-6">
        {/* Logo & Description */}
        <div className="grid gap-10 py-20 md:py-24 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className={`footer-intro ${fonts.lg} tracking-[0.22em] text-white/60`}>
              {t("atelier.eyebrow")}
            </p>
            <h3 className={`footer-intro ${fontHeading.md} mt-5 max-w-4xl font-bold leading-[0.95] tracking-[-0.04em] text-white`}>
              {t("atelier.title")}
            </h3>
            <p className={`footer-intro ${fonts.lg} mt-6 font-semibold tracking-[0.08em] text-white`}>
              {t("atelier.quality")}
            </p>
          </div>

          <div className="lg:col-span-5 lg:pb-2">
            <p className={`footer-intro ${fonts["2xl"]} max-w-xl leading-relaxed text-white/55`}>
              {t("atelier.description")}
            </p>
            <div className="footer-intro mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="https://outlook.office365.com/owa/calendar/KurthGlasSpiegelAG@kurth-glas.ch/bookings/"
                target="_blank"
                rel="noreferrer"
                className={`${fonts.lg} font-semibold group inline-flex items-center gap-3 text-white transition-colors duration-300 hover:text-white/65 animated-underline`}
              >
                {t("atelier.bookConsultation")}
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-white/50 group-hover:bg-white group-hover:text-neutral-950">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${fonts.lg} font-semibold group inline-flex items-center gap-3 text-white transition-colors duration-300 hover:text-white/65 animated-underline`}
              >
                {t("atelier.visitShop")}
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-white/50 group-hover:bg-white group-hover:text-neutral-950">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 border-y border-white/10 py-16 sm:grid-cols-2 lg:grid-cols-12">
          {/* Produkte */}
          <div className="footer-column pb-12 sm:pr-10 lg:col-span-4 lg:pb-0">
            <h4 className={`${fonts.lg} mb-7 font-bold  tracking-[0.18em] text-white/35`}>
              {t("links.manufacturing")}
            </h4>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {manufacturingKeys.map((key, index) => (
                <li key={key}>
                  <Link
                    href={manufacturingHrefs[index]}
                    target="_blank"
                    rel="noreferrer"
                    className={`${fonts.lg} text-white/60 transition-colors duration-300 hover:text-white`}
                  >
                    {t(`serviceLinks.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-column border-t border-white/10 py-12 sm:border-l sm:border-t-0 sm:px-10 lg:col-span-3 lg:py-0">
            <h4 className={`${fonts.lg} mb-7 font-bold  tracking-[0.18em] text-white/35`}>
              {t("openingHours.title")}
            </h4>
            <div className={`${fonts.base} space-y-5 text-white/55`}>
              <div>
                <p className="mb-2 font-bold text-white/80">{t("openingHours.mondayThursday")}</p>
                <p>07.10 Uhr - 12.00 Uhr</p>
                <p>13.30 Uhr - 17.30 Uhr</p>
              </div>
              <div>
                <p className="mb-2 font-bold text-white/80">{t("openingHours.friday")}</p>
                <p>07.10 Uhr - 12.00 Uhr</p>
                <p>13.30 Uhr - 16.30 Uhr</p>
              </div>
            </div>
          </div>

          {/* Kontakt */}
          <div className="footer-column border-t border-white/10 py-12 sm:pr-10 lg:col-span-2 lg:border-l lg:border-t-0 lg:px-10 lg:py-0">
            <h4 className={`${fonts.lg} mb-7 font-bold  tracking-[0.18em] text-white/35`}>
              {t("links.contact")}
            </h4>
            <ul className="space-y-3">
              {contactKeys.map((key, index) => (
                <li key={key}>
                  <Link
                    href={contactHrefs[index]}
                    className={`${fonts.lg} text-white/60 transition-colors duration-300 hover:text-white`}
                  >
                    {t(`contactLinks.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column border-t border-white/10 pt-12 sm:border-l sm:px-10 lg:col-span-3 lg:border-t-0 lg:py-0">
            <h4 className={`${fonts.lg} mb-7 font-bold  tracking-[0.18em] text-white/35`}>
              {t("social.title")}
            </h4>
            <div className="space-y-3">
              <Link
                href="https://www.instagram.com/kurthglas"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between border-b border-white/10 pb-3 text-white/60 transition-colors duration-300 hover:text-white"
              >
                <span className={`${fonts.base} inline-flex items-center gap-3 font-bold`}>
                  <Instagram className="h-5 w-5" />
                  Instagram
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/kurthglas?originalSubdomain=ch"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between border-b border-white/10 pb-3 text-white/60 transition-colors duration-300 hover:text-white"
              >
                <span className={`${fonts.base} inline-flex items-center gap-3 font-bold`}>
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom flex flex-col items-start justify-between gap-5 py-8 md:flex-row md:items-center">
          <p className={`${fonts.xs} text-white/30`}>
            {t("legal.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6">
            <Link href="#" className={`${fonts.xs} text-white/30 transition-colors duration-300 hover:text-white`}>
              {t("legal.privacy")}
            </Link>
            <Link href="#" className={`${fonts.xs} text-white/30 transition-colors duration-300 hover:text-white`}>
              {t("legal.imprint")}
            </Link>
          </div>
        </div>
      </div>
    </FooterAnimation>
  )
}
