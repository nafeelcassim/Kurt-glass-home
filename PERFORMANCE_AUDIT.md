# Kurth Glass — Next.js 16 Performance Audit

**Auditor role:** Principal Frontend Engineer / Next.js Performance Architect
**Date:** 2026-07-24
**Stack:** Next.js 16.2 (App Router, React 19) · Tailwind v4 · GSAP 3.15 + @gsap/react · next-intl v4 · lucide-react · Radix/shadcn UI kit (mostly unused)
**Routes audited:** `/[locale]` (home), `/[locale]/manufatory`, `/[locale]/glass-solutions/{interior,exterior}`

---

## Executive summary

The site is architecturally a **fully client-rendered marketing site**. Every visible section (`Hero`, `Products`, `Manufacturing`, `About`, `Services`, `Showrooms`, `Footer`, plus both sub-page bodies) is marked `'use client'` **solely to run GSAP entrance animations**. As a result:

- All static copy, layout, and the **entire translation dictionary for the active locale (~16 KB JSON)** are shipped to the browser and hydrated, even though ~95% of the DOM is non-interactive.
- GSAP core + ScrollTrigger (~40–70 KB gzipped) is a hard, render-blocking dependency of first paint.
- ~~Above-the-fold media is a **remote 4K (2560×1440) autoplaying `.mp4`** with no poster — this is your LCP element and it is uncontrolled.~~ ✅ **Addressed in code** (§1): poster-first paint, `preload="none"`, hydration + reduced-motion/save-data gating, preconnect. Remaining: right-size/self-host the encode (asset task).
- Product/service/showroom imagery uses raw `<img>` with no dimensions → **layout shift (CLS)** and no image optimization.

None of these are correctness bugs — the site works — but they are the difference between a ~1.5 s and a ~4 s LCP on mid-tier mobile. The good news: **your GSAP hygiene is mostly excellent** (`useGSAP` + `scope` everywhere), and the heavy Radix/Recharts/Embla kit is **dead code that does not currently ship**. The wins are concentrated and achievable.

### Priority ranking

| # | Issue | Impact | Effort | Area |
|---|-------|--------|--------|------|
| 1 | ~~Remote 4K hero video as unmanaged LCP~~ | ✅ **Fixed** (asset re-encode still pending) | Low | LCP / bandwidth |
| 2 | ~~Raw `<img>` everywhere → CLS + no optimization~~ | ✅ **Fixed** | Med | CLS / LCP |
| 3 | Whole-page `'use client'` for animation only | 🟡 **Pilot shipped; rollout paused by decision** (2/9) | Med | Hydration / RSC |
| 4 | `NextIntlClientProvider` ships full message tree | 🟠 High | Low | Hydration / bundle |
| 5 | Manual `addEventListener` inside `useGSAP` (latent / dev-time dup) | 🟡 Low–Medium *(corrected down from High)* | Low | Memory / re-render |
| 6 | Header animates `padding` on scroll (layout thrash) | 🟡 Medium | Low | Rendering |
| 7 | `optimizePackageImports` ✅ done · dead-kit prune ⏸️ declined (0-byte cost) | 🟡 Medium | Low | Bundle |
| 8 | GSAP is eager & render-blocking for below-fold | 🟡 Medium | Med | Bundle / TBT |
| 9 | Config: `ignoreBuildErrors`, dead `contact.tsx` | 🟢 Low | Low | Hygiene |

---

## 1. Remote 4K hero video is an unmanaged LCP element ✅ MOSTLY FIXED

> **Status — resolved 2026-07-24 (code).** The hero video now has a **poster that carries first paint**, `preload="none"`, and the source is attached **client-side only** and **only when the user hasn't requested reduced motion or data-saver**. `preconnect` hints warm the Pexels origins. Poster URL verified `200`; `hero.tsx` type-checks clean. **One follow-up remains and cannot be done in code:** the streamed source is still the UHD (2560×1440) file — right-sizing/self-hosting a 1080p encode is an asset-pipeline task (see "Remaining follow-up" below).

**File:** `components/hero.tsx`

```tsx
// BEFORE
<video ref={videoRef} autoPlay muted loop playsInline
  className="absolute inset-0 w-full h-full object-cover">
  <source
    src="https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
    type="video/mp4" />
</video>
```

### Issue & Impact
- The source is a **UHD 2560×1440 25fps** file streamed from a third-party origin (`videos.pexels.com`). On the hero, full-viewport, this is almost certainly your **Largest Contentful Paint** element and it is completely uncontrolled: no `poster`, no `preload` hint, no size ceiling.
- With no `poster`, the hero paints **black → flash of video**, and the browser cannot show a meaningful first frame until enough of a multi-megabyte file has buffered. This inflates LCP *and* pushes back the point where the GSAP intro timeline visually "lands."
- A third-party origin means an **extra DNS + TLS + connection** on the critical path, with none of your caching/CDN guarantees.
- `Manufacturing` (`components/manufacturing.tsx:64`) does this correctly with a `poster` — the hero should match.

### Refactored code (applied)

Poster now paints first; the source is gated behind hydration + user intent, and the origins are pre-connected:

```tsx
// hero.tsx — module scope
const HERO_VIDEO_SRC =
  "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
const HERO_POSTER_SRC =
  "https://images.pexels.com/videos/3209828/free-video-3209828.jpg?auto=compress&cs=tinysrgb&w=1920"

// inside the component
const [enableVideo, setEnableVideo] = useState(false)
useEffect(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
  if (!prefersReducedMotion && !saveData) setEnableVideo(true)
}, [])
```

```tsx
{/* React 19 hoists these <link>s into <head> */}
<link rel="preconnect" href="https://videos.pexels.com" />
<link rel="preconnect" href="https://images.pexels.com" />

<video
  ref={videoRef}
  autoPlay={enableVideo}
  muted
  loop
  playsInline
  preload="none"                 {/* don't fight the poster for bandwidth */}
  poster={HERO_POSTER_SRC}       {/* this is what the user perceives as "loaded" */}
  className="absolute inset-0 w-full h-full object-cover"
>
  {enableVideo && <source src={HERO_VIDEO_SRC} type="video/mp4" />}
</video>
```

Why this helps:
- **Poster = LCP.** The still paints immediately instead of a black box → LCP is a small, cacheable image rather than a multi-MB video buffer.
- **`preload="none"` + client-side `<source>`.** SSR ships the poster only; the video download starts *after* hydration and never competes with the critical render.
- **Respect user intent.** Reduced-motion and data-saver users get the poster and **never download the video at all** — a large bandwidth and accessibility win.
- **`preconnect`.** DNS/TLS to the Pexels origins is warmed before the source is attached, shaving the connection cost off the video's start.

### What was changed
- Added `HERO_VIDEO_SRC` / `HERO_POSTER_SRC` constants (poster verified reachable → HTTP `200`).
- Added an `enableVideo` state + `useEffect` gate on `prefers-reduced-motion` and `navigator.connection.saveData`.
- Set `preload="none"`, added `poster`, made `autoPlay` and the `<source>` conditional on `enableVideo`.
- Added two `preconnect` `<link>`s (React 19 hoists them to `<head>`).
- **Verified:** poster URL `200`; `tsc --noEmit` clean for `hero.tsx`.

### Remaining follow-up (asset task — cannot be done in code)
The gated source is still the **UHD 2560×1440** Pexels file, so users with motion enabled on good connections still pull a heavy asset. To close this fully:
1. Encode a **1080p-max** background render as **WebM (VP9/AV1) + MP4 (H.264)**.
2. Self-host / CDN it and swap `HERO_VIDEO_SRC` for two `<source>`s (WebM first, MP4 fallback).
3. Optionally move `HERO_POSTER_SRC` to a self-hosted, optimized AVIF for full control of the LCP bytes.

### Key takeaway
**Your LCP element must be something you control the bytes of.** A background video should be poster-first, right-sized, and self-hosted; the poster is what the user actually perceives as "loaded."

---

## 2. Raw `<img>` tags cause layout shift and skip optimization ✅ FIXED

> **Status — resolved 2026-07-24.** All six raw `<img>` tags were converted to `next/image` with `fill` + `sizes`, and `next.config.mjs` now whitelists `images.unsplash.com` / `images.pexels.com` with AVIF/WebP output. `onError` fallbacks in `categories.tsx` and `showrooms.tsx` were preserved (now also clearing `srcset` so the fallback wins over the optimizer's candidate set). Verified: `grep "<img"` returns nothing across `app/` and `components/`, and the edited files type-check clean. See the "What was changed" note at the end of this section.

**Files:** `components/products.tsx:144`, `about.tsx:126`, `categories.tsx:127`, `showrooms.tsx:130`, `interior-exterior.tsx:73`, `glass-solutions-page.tsx:98`

```tsx
// BEFORE
<img
  src={product.image}
  alt={t(`items.${product.id}.name`)}
  className="product-image w-full h-full object-cover scale-105"
/>
```

### Issue & Impact
- **No `width`/`height` (or aspect-ratio box with reserved space at the img level)** → the browser cannot reserve layout for the image before it loads. Combined with the `aspect-*` wrapper you *do* have this is partially mitigated, but the raw `<img>` still contributes to **CLS** on slow connections and offers zero format negotiation.
- **No AVIF/WebP transcoding, no responsive `srcset`, no lazy-loading policy.** Every card downloads a full Unsplash JPEG (`?w=800&q=80` … `?w=1600`) regardless of the device. On the `Services` carousel and `GlassSolutionsPage` grid that's 6–8 large images eagerly fetched, competing with the hero for bandwidth.
- You deliberately used `<img>` because `next.config.mjs` only whitelists the Vercel blob host — so `next/image` would throw on Unsplash/Pexels URLs. The fix is to whitelist those hosts, not to abandon the optimizer.

### Refactored code (applied)

**Step 1 — allow the remote hosts** (`next.config.mjs`) — *done*:

```js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
    ],
  },
}
```

**Step 2 — swap `<img>` for `next/image`** with `fill` inside the existing aspect wrappers — *done*:

```tsx
import Image from "next/image"

// AFTER — components/products.tsx
<div className="relative aspect-4/5 overflow-hidden bg-secondary">
  <Image
    src={product.image}
    alt={t(`items.${product.id}.name`)}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="product-image object-cover scale-105"
  />
</div>
```

Per-file `sizes` chosen to match the actual layout so `srcset` serves the smallest sufficient candidate:

| File | Layout at breakpoints | `sizes` applied |
|---|---|---|
| `products.tsx` | 1 / 2 / 3-col grid | `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw` |
| `about.tsx` | full → half on `lg` | `(max-width: 1024px) 100vw, 50vw` |
| `categories.tsx` | fixed `w-72 md:w-80` cards | `(max-width: 768px) 288px, 320px` |
| `showrooms.tsx` | 1 → 2-col on `md` | `(max-width: 768px) 100vw, 50vw` |
| `interior-exterior.tsx` | 1 → 2-col on `lg` | `(max-width: 1024px) 100vw, 50vw` |
| `glass-solutions-page.tsx` | 1 / 2 / 3-col grid | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw` |

### What was changed
- `next.config.mjs`: added `images.unsplash.com` + `images.pexels.com` to `remotePatterns`, plus `formats: ['image/avif', 'image/webp']`.
- Converted all 6 `<img>` → `<Image fill sizes=… />`, moving `object-cover` (and hover/scale transform classes) onto the `Image`; the surrounding `relative` + `aspect-*` boxes were already present, so no CLS regression.
- Preserved the `onError` fallbacks in `categories.tsx` and `showrooms.tsx`, adding `event.currentTarget.srcset = ""` so the fallback `src` isn't overridden by the optimizer's `srcset` candidates.
- **Verified:** `grep "<img"` → none; `tsc --noEmit` → no errors in the edited files.

### Follow-ups (not yet done)
- **`priority` for above-the-fold images:** all converted images currently lazy-load (the correct default, since every one of them sits below the hero). If the layout changes so any image lands in the initial viewport, give that one `priority`.
- The **hero background video** (§1) is a separate LCP concern and is still open.

### Key takeaway
**Reserve space and let the platform negotiate bytes.** `next/image` with `fill` + `sizes` gives you AVIF, responsive `srcset`, and lazy-loading for free, and eliminates the CLS that raw `<img>` reintroduces even inside an aspect box.

---

## 3. Whole sections are `'use client'` purely to animate 🟠 — PILOT APPLIED (2 / 9)

> **Status — 2026-07-24.** The server-component + client-animator pattern is **implemented and verified for `Manufacturing` and `Footer`** (chosen as the pilot: both have purely class-based animations, so they're the lowest-risk conversions). Remaining: `Products`, `About`, `Services (categories)`, `Showrooms`, `InteriorExterior`, `GlassSolutionsPage`, `ManufactoryPage`.
>
> **Important SEO clarification:** `'use client'` components **are already server-side rendered** in the App Router — the crawler-visible HTML always contained the translated copy, so SEO text was never actually missing. This refactor's real payoff is **reduced hydration JS + eliminating the client translation payload** (feeds directly into §4) and genuinely server-owned content via `getTranslations`.
>
> **What was built (pilot):**
> - `lib/gsap.ts` — single GSAP + plugin registration point (also advances §8).
> - `components/section-animations.tsx` — `"use client"` file holding `ManufacturingAnimation` + `FooterAnimation`. Each renders the section's real root element (`<section>` / `<footer>` with the original `id`/`className`), owns the GSAP scope, and slots server content as `children`. **The GSAP is copied verbatim** — only element-`ref` targets became scoped class-selectors (`videoRef` → `.manufacturing-video`); triggers/eases/durations/stagger are unchanged.
> - `components/manufacturing.tsx` + `components/footer.tsx` — now **async Server Components** using `getTranslations`; all markup + `next-intl` `Link`s render on the server.
>
> **Verified:** `next build` ✓ · raw server HTML (JS disabled) contains the Manufacturing + Footer copy and the `manufacturing-reveal` / `footer-intro` / `footer-column` animation hooks ✓ · translations resolve (no missing-key regression) ✓.
>
> **One behavior note:** the Manufacturing `<video>`'s inline `onCanPlay` autoplay-retry was removed (event handlers can't live in a Server Component). Muted `autoPlay playsInline` is reliable on all modern browsers — this matches how `Hero` already works — so the video still autoplays; only the redundant retry is gone.
>
> **⚠️ Please visually QA** the Manufacturing reveal + video parallax and the Footer staggered reveal in a browser — the code preserves the animation definitions exactly, but I can't run the browser from here.
>
> **Decision (2026-07-24): rollout intentionally paused after the pilot.** Rationale: the original driver was SEO, which turned out to be a non-issue (client components already SSR their copy). The remaining benefit is hydration JS + the ~12.4 KB translation payload — and the payload only actually drops once **§4** scopes the provider. That's a real-but-modest, diminishing-returns optimization for a marketing site, so we're keeping the pilot as a proven, reusable pattern and **not** converting the other 7 unless/until hydration cost shows up in measured field metrics. The recipe below is preserved so the rollout can resume at any time.
>
> **To resume later,** the remaining 7 follow the same recipe (with small client leaves for the interactive bits: the `Services` carousel buttons, `Showrooms`/`Services` `onError` images, and `ManufactoryPage` hover-videos). Recommended order when resuming: the low-risk static sections first (`GlassSolutionsPage` 2.8 KB, `InteriorExterior`, `Products`, `About`), then pair with §4 to bank the payload; treat `ManufactoryPage` (biggest payload, highest interactivity) as an optional last step.

**Files:** every component in `components/*.tsx` (`hero`, `products`, `manufacturing`, `about`, `categories`, `showrooms`, `footer`, `interior-exterior`, `glass-solutions-page`, `manufactory-page`)

### Issue & Impact
Each section reaches for `'use client'` for one reason: to attach GSAP animations to refs. But the directive taints the **entire subtree** — all the static markup, all the `t(...)` translated strings, all the images — as a Client Component. Consequences:

- **Hydration cost:** React must ship the component code and re-run it on the client to attach event handlers/refs, even though the vast majority of the output is static. On a page that is 90% text and images, you are paying hydration for content that never changes.
- **Translation payload (see §4):** because these are client components calling `useTranslations`, the message dictionary must be serialized into the HTML and re-parsed on the client.
- **Streaming:** static server content can't stream ahead of the interactive islands because there effectively is no static server content — it's all in the client boundary.

Your `page.tsx` and `layout.tsx` are correctly Server Components, and `SmoothScroll` correctly receives `children` as a prop (so *in principle* children could stay on the server) — but since every child is itself `'use client'`, that benefit is never realized.

### Refactored code — isolate animation into a leaf "island"

Create **one** reusable client wrapper that owns the GSAP context; keep the content as a Server Component.

```tsx
// components/animate/reveal.tsx  (the ONLY client code)
"use client"

import { useRef, type ReactNode } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function Reveal({
  children,
  y = 60,
  start = "top 80%",
  stagger = 0,
  selector = ":scope > *",
}: {
  children: ReactNode
  y?: number
  start?: string
  stagger?: number
  selector?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const targets = ref.current?.querySelectorAll(selector)
    if (!targets?.length) return
    gsap.fromTo(
      targets,
      { y, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger,
        scrollTrigger: { trigger: ref.current, start },
      }
    )
  }, { scope: ref })

  return <div ref={ref}>{children}</div>
}
```

```tsx
// components/products.tsx  — now a SERVER component (no "use client")
import { getTranslations } from "next-intl/server"
import { Reveal } from "@/components/animate/reveal"

export async function Products() {
  const t = await getTranslations("Products")     // runs on server, ships no dictionary
  return (
    <section id="products" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <Reveal stagger={0.1} selector=".product-card">
          {/* all static markup + <Image> render on the server and stream */}
          ...
        </Reveal>
      </div>
    </section>
  )
}
```

> **Pragmatic note:** the hero letter-splitting, the `Products` hover handlers, the `Services` carousel buttons, and the `manufactory-page` video hover *are* genuinely interactive and should remain client leaves. The point is not "delete all `'use client'`" — it's to **push the boundary down to the smallest node that needs it** so the copy, images, and translations render on the server. Even converting the purely-declarative sections (`Manufacturing`, `About`, `InteriorExterior`, `Footer`, `GlassSolutionsPage`) to this pattern removes the bulk of the hydration and the entire message payload.

### Key takeaway
**`'use client'` is a subtree tax, not a line-level flag.** Interactivity belongs in leaf islands; static content and i18n belong on the server where they cost zero hydration.

---

## 4. `NextIntlClientProvider` serializes the entire message tree to the client 🟠

**File:** `app/[locale]/layout.tsx:46`

```tsx
<NextIntlClientProvider>{children}</NextIntlClientProvider>
```

### Issue & Impact
With no `messages` prop, next-intl v4 **forwards the full request-config message object to the client** so that any descendant client component can call `useTranslations`. Your active-locale dictionary is **~15–16 KB of JSON** (`messages/en.json` 15.5 KB, `de` 16 KB, `fr` 16.5 KB). That entire blob is:

1. embedded in the streamed HTML,
2. shipped again in the RSC payload, and
3. re-parsed during hydration.

This is a direct consequence of §3 — because every consumer is a client component, *every* namespace has to cross the wire. It's pure overhead for a site whose text never changes after render.

### Refactored code

**Best fix (pairs with §3):** render text on the server with `getTranslations` and stop forwarding messages entirely. If no client descendant needs `useTranslations`, you can drop the provider or scope it.

**If you must keep some client consumers,** forward only the namespaces they need instead of the whole tree:

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import pick from 'lodash-es/pick'   // or a 3-line manual pick, no dep

export default async function RootLayout({ children, params }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} /* … */>
      <body /* … */>
        <NextIntlClientProvider
          locale={locale}
          messages={pick(messages, ['Header', 'LanguageSwitcher'])} // only interactive namespaces
        >
          {children}
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
```

`Header` and `LanguageSwitcher` are the only truly-interactive consumers today, so the client dictionary shrinks from ~16 KB to a few hundred bytes.

### Key takeaway
**Only interactive namespaces should cross the client boundary.** Server-render translated copy with `getTranslations`, and `pick()` the small remainder for the client provider.

---

## 5. Manual `addEventListener` inside `useGSAP` — latent / dev-time duplication 🟡 (severity corrected)

**File:** `components/products.tsx` (hover block inside `useGSAP`)

```tsx
card.addEventListener("mouseenter", () => {
  gsap.to(overlay, { opacity: 1, ... })
  gsap.to(image,   { scale: 1.08, ... })
})
card.addEventListener("mouseleave", () => { ... })
```

> **Correction (2026-07-24).** This was originally filed as 🟠 High / "genuine memory leak." After verifying against the installed `@gsap/react` **2.1.2** source, that overstated it. Corrected verdict below. **Left as-is by decision — not fixed** (it is not an active production bug; the fix would be optional hygiene).

### Verified behavior
- `useGSAP(cb, { scope })` is called with **no `dependencies`**, so `@gsap/react` defaults them to `[]` (confirmed in source: `dependencies = "dependencies" in config ? config.dependencies : emptyArray`). The callback therefore **runs once on mount**, cleanup on unmount — it does **not** re-run on re-render.
- Cleanup is `context.current.revert()`, which reverts **GSAP tweens/ScrollTriggers only**. Raw `addEventListener` calls are not GSAP objects, so they are never reverted by it.

### Actual impact (accurate)
- **Production, as written:** listeners are added exactly once and never re-added; on unmount React removes the card nodes and the listeners are GC'd with them. **No meaningful production leak or duplication today.**
- **Dev only — React Strict Mode / Fast Refresh:** mount → cleanup(revert) → remount *against the same persisted DOM nodes*. The first run's listeners survive (revert doesn't touch them) and the second run adds them again → **duplicate `mouseenter`/`mouseleave` handlers**, so each hover fires its tweens twice. Redundant, visually harmless, dev-only.
- **Latent footgun:** if anyone later gives this hook a *changing* dependency (or the section starts remounting against persisted nodes), the listeners **stack** and it becomes a real leak. That's the reason to keep it on the radar.
- **Minor smell:** the hover tweens aren't `contextSafe`, so they live outside GSAP's context lifecycle.

**Net:** valid but low-priority hygiene, not the urgent defect first reported. Worth fixing only opportunistically.

### Optional fix (not applied — kept for reference)

**Option A — register listeners through the GSAP context so they're reverted** (`contextSafe` / `gsap.context().add` return values are cleaned up):

```tsx
useGSAP((context, contextSafe) => {
  const productCards = gridRef.current?.querySelectorAll(".product-card")
  productCards?.forEach((card) => {
    const image   = card.querySelector(".product-image")
    const overlay = card.querySelector(".product-overlay")

    const onEnter = contextSafe!(() => {
      gsap.to(overlay, { opacity: 1, duration: 0.4 })
      gsap.to(image,   { scale: 1.08, duration: 0.7 })
    })
    const onLeave = contextSafe!(() => {
      gsap.to(overlay, { opacity: 0, duration: 0.4 })
      gsap.to(image,   { scale: 1.05, duration: 0.7 })
    })

    card.addEventListener("mouseenter", onEnter)
    card.addEventListener("mouseleave", onLeave)

    // useGSAP runs returned cleanup on revert/unmount
    return () => {
      card.removeEventListener("mouseenter", onEnter)
      card.removeEventListener("mouseleave", onLeave)
    }
  })
}, { scope: sectionRef })
```

> Note: a callback returned from inside the `forEach` isn't what `useGSAP` cleans up — only the hook's top-level return is. For multiple cards, collect the teardowns and return one function:

```tsx
useGSAP((_, contextSafe) => {
  const teardowns: Array<() => void> = []
  gridRef.current?.querySelectorAll(".product-card").forEach((card) => {
    const onEnter = contextSafe!(() => { /* … */ })
    const onLeave = contextSafe!(() => { /* … */ })
    card.addEventListener("mouseenter", onEnter)
    card.addEventListener("mouseleave", onLeave)
    teardowns.push(() => {
      card.removeEventListener("mouseenter", onEnter)
      card.removeEventListener("mouseleave", onLeave)
    })
  })
  return () => teardowns.forEach((fn) => fn())
}, { scope: sectionRef })
```

**Option B (preferred here) — do the hover in CSS.** Scale/opacity hover states need no JS at all and can't leak:

```css
.product-card .product-image { transition: transform .7s cubic-bezier(.23,1,.32,1); transform: scale(1.05); }
.product-card:hover .product-image { transform: scale(1.08); }
.product-card .product-overlay { transition: opacity .4s ease; opacity: 0; }
.product-card:hover .product-overlay { opacity: 1; }
```

You already do exactly this for `.product-card:hover` translateY in `globals.css:130` — extend that pattern and delete the JS hover block entirely.

### Key takeaway
**GSAP cleans up tweens, not the listeners you hand-wire.** Either register them via `contextSafe` + an explicit teardown, or — for simple `transform`/`opacity` hovers — use CSS and pay nothing.

---

## 6. Header animates `padding` on scroll → layout thrash 🟡

**File:** `components/header.tsx:79-83`

```tsx
className={`... transition-[background-color,padding,box-shadow] duration-300 ${
  isScrolled ? "bg-background py-4 shadow-sm" : "bg-transparent py-6"
}`}
```

### Issue & Impact
- Transitioning **`padding`** is a **layout-triggering** property. Every animated frame of the 300 ms transition forces the browser to recompute layout for the header and reflow its contents (logo, nav, button). On a `position: fixed` bar this repaints on every scroll-state toggle.
- The rule requests `transition-[…padding…]`, which is exactly the "avoid animating layout properties" anti-pattern called out in your own audit goals (§3). `transform`/`opacity` are the composited, cheap alternatives.
- Toggling `py-6 → py-4` also **changes the header height**, nudging the fixed bar's own box and anything measuring it.

### Refactored code
Keep a **fixed height** and animate only compositor-friendly properties. Shrink the *contents* with `transform: scale` if you want the "condense" feel:

```tsx
<header
  ref={headerRef}
  className={`fixed top-0 inset-x-0 z-50 h-20 flex items-center
    transition-[background-color,box-shadow] duration-300
    ${isScrolled ? "bg-background shadow-sm" : "bg-transparent"}`}
>
  <div className={`container mx-auto px-6 flex items-center justify-between
      origin-top transition-transform duration-300
      ${isScrolled ? "scale-95" : "scale-100"}`}>
    …
  </div>
</header>
```

- Height is constant → no reflow of the fixed bar.
- `background-color` and `box-shadow` are paint-only (acceptable); `transform: scale` is composited.
- Bonus: your scroll handler is already `requestAnimationFrame`-throttled and `passive` — that part is well done, keep it.

### Key takeaway
**Never transition `width`/`height`/`padding`/`top`/`left` on a scroll-driven element.** Lock the box size and animate `transform`/`opacity` only.

---

## 7. Bundle: enable `optimizePackageImports` and prune dead heavy deps 🟡 — 7a FIXED · 7b DECLINED

> **Status — 2026-07-24.** **7a applied** (`optimizePackageImports: ['lucide-react']` in `next.config.mjs`; `next build` recognizes it and compiles clean). **7b declined by decision** — the dead UI kit already ships **zero runtime bytes**, so pruning is repo hygiene only; keeping the shadcn kit for future pages was chosen over deleting it.

### 7a. `lucide-react` — ✅ applied
Your imports are already **named** (`import { ArrowRight } from "lucide-react"`), which is correct. Next 16 + Turbopack tree-shakes these, but it's now explicit:

```js
// next.config.mjs — applied
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // …
}
```

This guarantees each icon is pulled as an individual module rather than risking a barrel-file pull-in during any future refactor. Verified: build logs `· optimizePackageImports` and compiles successfully.

### 7b. Heavy UI kit is dead code — ⏸️ **kept by decision (2026-07-24)**
Re-verified: **all 57 files in `components/ui/` plus `components/theme-provider.tsx` are dead** — nothing outside `components/ui/` imports any of it, and the heavy deps below are reachable *only* from that dead code (plus all ~25 `@radix-ui/*`). Because it's tree-shaken to **zero runtime bytes**, pruning is repo/`node_modules`/CI-install hygiene only — not a user-facing perf win. **Decision: keep the kit** for building future pages (forms, dialogs, carousel, charts) rather than delete 58 files + ~35 deps. Recoverable from git or `shadcn` CLI if that changes.

Reachability trace from the four rendered routes:

| Package | Only imported by | Reachable from a route? | Ships today? |
|---|---|---|---|
| `recharts` | `components/ui/chart.tsx` | ❌ | **No** |
| `date-fns` + `react-day-picker` | `components/ui/calendar.tsx` | ❌ | **No** |
| `cmdk` | `components/ui/command.tsx` | ❌ | **No** |
| `embla-carousel-react` | `components/ui/carousel.tsx` | ❌ | **No** |
| `vaul` | `components/ui/drawer.tsx` | ❌ | **No** |
| 25× `@radix-ui/*`, `sonner`, `input-otp`, `react-hook-form`, `zod` | `components/ui/*` only | ❌ | **No** |

**Good news:** because nothing in your actual pages imports these, they are tree-shaken out and add **zero** runtime bytes today. **Recommendation:** delete the unused `components/ui/*` files (or the whole folder if you're not using shadcn primitives) and drop the corresponding `dependencies`. This shrinks `node_modules`, install/CI time, and eliminates the *latent* risk that someone imports `chart.tsx` (Recharts ≈ 100 KB gzipped) into a client component later.

**If/when you do use them,** load on demand:

```tsx
import dynamic from "next/dynamic"

// Recharts / any client-only heavy widget → never in the server or first-load bundle
const RevenueChart = dynamic(() => import("@/components/ui/chart").then(m => m.ChartContainer), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-muted" />,
})
```

Same pattern for `Command` (cmdk), `Drawer` (vaul), and any Radix `Dialog` that opens on interaction — there's no reason to pay for a modal's JS before the user asks for it.

### 7c. `date-fns` import style (for future use)
`date-fns` v4 is ESM and tree-shakes per-function, so `import { format } from "date-fns"` is fine **as long as you never do** `import * as dateFns from "date-fns"`. Prefer named imports; add `date-fns` to `optimizePackageImports` if you adopt it.

### Key takeaway
**Ship only what a route can reach.** Your heavy kit is already tree-shaken to zero — delete it to keep it that way, and lazy-load anything client-only and heavy behind `next/dynamic({ ssr: false })`.

---

## 8. GSAP is an eager, render-blocking dependency for below-the-fold work 🟡

**Files:** every section registers `gsap.registerPlugin(useGSAP, ScrollTrigger)` at module scope and imports `gsap` + `gsap/ScrollTrigger` statically.

### Issue & Impact
- GSAP core (~40 KB gz) + ScrollTrigger (~15 KB gz) are imported statically by the first-loaded client component, so they're part of the **initial JS that must download, parse, and execute before hydration completes** — contributing to Total Blocking Time.
- The **hero** genuinely needs GSAP immediately (intro timeline + parallax), so you can't fully defer it. But `Footer`, `Showrooms`, `About`, `InteriorExterior`, and the sub-page bodies only animate **on scroll**, well after first paint — their GSAP work doesn't need to be on the critical path.
- Registering the plugin in **every** module is idempotent (harmless) but redundant; centralize it.

### Refactored code
1. **Centralize registration** in one client module and import it once from the app shell:

```tsx
// lib/gsap.ts
"use client"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(useGSAP, ScrollTrigger)
export { gsap, useGSAP, ScrollTrigger }
```

2. **Lazy-load below-the-fold animated sections** so their component *and* their GSAP usage split out of the first-load chunk:

```tsx
// app/[locale]/page.tsx
import dynamic from "next/dynamic"
import { Hero } from "@/components/hero"          // eager: above the fold

const About       = dynamic(() => import("@/components/about").then(m => m.About))
const Showrooms   = dynamic(() => import("@/components/showrooms").then(m => m.Showrooms))
const Footer      = dynamic(() => import("@/components/footer").then(m => m.Footer))
// keep ssr:true (default) so HTML still streams; only the JS/hydration is deferred
```

> If you adopt §3 (server components + `Reveal` islands), the GSAP surface collapses to the small `Reveal` leaf and this becomes far less of a concern — that's the higher-leverage path.

### Key takeaway
**Animation for content the user hasn't scrolled to should not block first paint.** Centralize GSAP registration and code-split below-the-fold sections so their animation code loads lazily.

---

## 9. Configuration & hygiene 🟢

### 9a. `typescript.ignoreBuildErrors: true` (`next.config.mjs`)
```js
typescript: { ignoreBuildErrors: true },
```
This ships type-unsafe code to production and hides real refactor regressions (e.g., a mistyped `t()` key, a null ref). It's not a runtime perf issue but it's how perf regressions sneak in. Fix the underlying errors and remove the flag, or scope it to a temporary migration.

### 9b. Dead component: `components/contact.tsx`
`Contact` is not imported by any route (the home page uses `Showrooms`, which carries the `#contact` anchor). It's a full `'use client'` + GSAP component sitting unused. Delete it, or wire it in — either way it shouldn't linger as ambiguous dead code.

### 9c. React 19 form primitives — currently N/A
Your audit goal asks about `useActionState` / `useFormStatus` / `useOptimistic` alongside `react-hook-form`. **There are no forms in the rendered routes** — the "Get in touch" CTAs are `mailto:`/anchor links. So there's nothing to optimize today. **When you add a contact form,** the idiomatic React 19 + Next 16 pattern is:
- a **Server Action** for submission,
- `useActionState(action, initialState)` to track result/errors without a client fetch,
- `useFormStatus()` in the submit button for pending UI,
- keep `react-hook-form` + `zod` only if you need rich client-side field validation; otherwise Server Actions + `zod` on the server is lighter.

### 9d. Minor
- `viewport.themeColor` is set in `layout.tsx:22` — good, that's the correct place in Next 16 (not in `metadata`).
- `new Date().getFullYear()` in `footer.tsx:197` runs on the client (footer is `'use client'`); harmless, but if the footer becomes a Server Component it'll be computed at request time, which is fine.
- `SmoothScroll` calling `ScrollTrigger.refresh()` on mount is correct, but ensure it runs **after** images/fonts settle to avoid triggers computing against a pre-layout DOM — consider `ScrollTrigger.refresh()` inside a `requestAnimationFrame` or after `document.fonts.ready`.

---

## Suggested execution order

1. ✅ **Hero video → poster + preload/gate/preconnect** (§1) — *done (code)*; right-sized self-hosted encode still pending as an asset task.
2. ✅ **`next/image` + `remotePatterns` for Unsplash/Pexels** (§2) — *done* — kills CLS, cuts image bytes.
3. **`NextIntlClientProvider` scoping** (§4) — one-file change, removes ~16 KB client payload.
4. **Fix the leaking hover listeners** (§5) — correctness + memory; prefer the CSS option.
5. **Header: stop animating padding** (§6) — one-className change, smoother scroll.
6. ✅ **`optimizePackageImports`** (§7a) — *done*; dead-kit prune (§7b) declined (0-byte cost, kit kept).
7. 🔶 **Server-component + client-animator refactor** (§3) — *pilot shipped for `Manufacturing` + `Footer`; rollout paused by decision.* Resume only if hydration cost shows up in field metrics; pair with §4 to bank the payload.
8. **Code-split below-the-fold sections / centralize GSAP** (§8).
9. **Remove `ignoreBuildErrors`, delete `contact.tsx`** (§9).

---

## Architectural principles at a glance

- **`'use client'` is a subtree tax.** Push it to the smallest leaf that needs interactivity; render copy, images, and i18n on the server.
- **Own your LCP bytes.** Poster-first, right-sized, self-hosted media; let `next/image` negotiate everything else.
- **Reserve layout, animate the compositor.** `transform`/`opacity` only; never `width`/`height`/`padding`/`top`/`left` on scroll.
- **GSAP cleans tweens, not your listeners.** Use `contextSafe` + explicit teardown, or CSS for simple hovers.
- **Ship only what a route can reach.** Tree-shake, delete dead heavy deps, and lazy-load client-only widgets behind `next/dynamic({ ssr: false })`.
