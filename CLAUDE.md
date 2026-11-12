# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Marketing site for Kurth Glass. Next.js 16 (App Router, React 19), Tailwind v4, GSAP + `@gsap/react`, next-intl v4. Package manager: **pnpm**.

## Commands

```bash
pnpm dev      # dev server
pnpm build    # production build
pnpm start    # serve production build
npx tsc --noEmit   # type-check — `next build` does NOT (ignoreBuildErrors: true in next.config.mjs)
```

- `pnpm lint` runs `eslint .`, but ESLint is not installed, so it fails. There are no tests.
- `pnpm-workspace.yaml` sets `minimumReleaseAge` to 7 days, so pnpm refuses package versions published less than a week ago.

## Architecture

**i18n (next-intl).** Locales are `de` (default), `en` and `fr`, defined in `i18n/routing.ts`. Every route is under `app/[locale]/`. Locale routing middleware lives in `proxy.ts`, which is the Next 16 name for `middleware.ts`. Messages are in `messages/{de,en,fr}.json` and are statically imported in `i18n/request.ts`. When adding copy, add the key to all three files. Use `Link`, `useRouter` and `usePathname` from `@/i18n/navigation`, not from `next/link` or `next/navigation`, so locale prefixes are kept.

**Pages.** Each page is `<SmoothScroll><Header/>…<Footer/></SmoothScroll>`. The home page composes section components from `components/`. The sub-pages use shared bodies: `glass-solutions/{interior,exterior}` → `GlassSolutionsPage type=…`, and `manufatory` → `ManufactoryPage`. The route is spelled `manufatory` and links depend on that spelling.

**Animations.** Most sections are `"use client"` only so they can run GSAP entrance and scroll animations.
- Import `gsap`, `useGSAP` and `ScrollTrigger` from `@/lib/gsap`, which is the single plugin registration point. Always use `useGSAP` with a `scope` ref so triggers are cleaned up on unmount.
- Sections start hidden (opacity 0) until their ScrollTrigger fires. `SmoothScroll` calls `ScrollTrigger.refresh()` after each pathname change, including client-side locale switches. Do not add a global ScrollTrigger kill: it races with the newly mounted locale's triggers and leaves the page blank.
- Preferred pattern for new or refactored sections: a server component (`getTranslations` from `next-intl/server`) wraps its content in a thin client animator from `components/section-animations.tsx`. `Manufacturing` and `Footer` use this pattern. Converting the remaining sections was paused on purpose; see `PERFORMANCE_AUDIT.md` §3.

**Styling.** Tailwind v4 is configured through `app/globals.css`; there is no tailwind config file. Typography presets (`fonts`, `fontHeading`) are in `lib/fonts.ts`, so reuse them instead of writing raw leading and tracking classes. `components.json` is set up for shadcn, but `components/ui` does not exist yet. External URLs such as `SHOP_URL` belong in `lib/site.ts`. Remote image hosts must be allowlisted in `next.config.mjs` under `images.remotePatterns`.

**`PERFORMANCE_AUDIT.md`** records performance decisions, including items intentionally declined or paused. Check it before reopening any of them.
