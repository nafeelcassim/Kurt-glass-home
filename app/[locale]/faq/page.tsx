import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArrowUpRight, Plus } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"
import { fonts, fontHeading } from "@/lib/fonts"
import { BOOKING_URL } from "@/lib/site"

type FaqItem = { q: string; a: string; link?: { href: string; label: string } }
type FaqCategory = { id: string; title: string; items: FaqItem[] }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "FaqPage" })
  return { title: t("meta.title"), description: t("meta.description") }
}

export default async function FaqPage() {
  const t = await getTranslations("FaqPage")
  const categories = t.raw("categories") as FaqCategory[]

  // FAQPage structured data: lets search engines and AI assistants read every Q&A directly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((c) =>
      c.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))
    ),
  }

  return (
    <SmoothScroll>
      <Header />
      <main className="bg-neutral-950 text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />

        <section className="container mx-auto px-6 pt-36 pb-16 md:pt-44 md:pb-20">
          <p className={`${fonts.lg} tracking-[0.18em] text-white/50`}>{t("hero.eyebrow")}</p>
          <h1 className={`${fontHeading.lg} mt-5 font-bold`}>{t("hero.title")}</h1>
          <p className={`${fonts.xl} mt-7 max-w-2xl text-white/60`}>{t("hero.description")}</p>
        </section>

        <div className="container mx-auto grid gap-12 px-6 pb-24 lg:grid-cols-12 lg:gap-16">
          <nav aria-label={t("topics")} className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className={`${fonts.sm} mb-4 tracking-[0.18em] text-white/40`}>{t("topics")}</p>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {categories.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      className={`${fonts.base} block rounded-full border border-white/15 px-4 py-2 text-white/70 transition-colors hover:border-white/40 hover:text-white lg:rounded-none lg:border-0 lg:px-0 lg:py-1.5`}
                    >
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="space-y-16 lg:col-span-9">
            {categories.map((c) => (
              <section key={c.id} id={c.id} className="scroll-mt-28">
                <h2 className={`${fontHeading.sm} font-bold`}>{c.title}</h2>
                <div className="mt-6 border-t border-white/10">
                  {c.items.map((item) => (
                    <details key={item.q} className="group border-b border-white/10">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                        <h3 className={`${fonts.xl} font-semibold text-white`}>{item.q}</h3>
                        <Plus className="mt-1 h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 group-open:rotate-45" />
                      </summary>
                      <div className="pb-7 pr-10">
                        <p className={`${fonts.lg} text-white/65`}>{item.a}</p>
                        {item.link && (
                          <a
                            href={item.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${fonts.base} mt-4 inline-flex items-center gap-2 font-semibold text-white animated-underline`}
                          >
                            {item.link.label}
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            <div className="grid gap-6 md:grid-cols-2">
              {(["shop", "contact"] as const).map((key) => (
                <a
                  key={key}
                  href={key === "shop" ? t("shop.href") : BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between gap-8 border border-white/15 p-8 transition-colors hover:border-white/40"
                >
                  <div>
                    <h2 className={`${fonts["2xl"]} font-bold`}>{t(`${key}.title`)}</h2>
                    <p className={`${fonts.base} mt-3 text-white/60`}>{t(`${key}.description`)}</p>
                  </div>
                  <span className={`${fonts.base} inline-flex items-center gap-2 font-semibold`}>
                    {t(`${key}.cta`)}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
