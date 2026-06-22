// Body text: comfortable line-height for readability, slight negative tracking for League Spartan
export const BODY_LEADING = "leading-relaxed"
export const BODY_TRACKING = "tracking-[-0.01em]"
export const BODY_SPACING = `${BODY_LEADING} ${BODY_TRACKING}`

// Heading text: tight line-height, tighter tracking — matches kurth-glas.ch style
export const HEADING_LEADING = "leading-[0.95]"
export const HEADING_TRACKING = "tracking-[-0.02em]"
export const FONT_SPACING = `${HEADING_LEADING} ${HEADING_TRACKING}`

// Individual font sizes — body sizes use BODY_SPACING, display sizes use FONT_SPACING
export const fonts = {
  xs: `text-xs ${BODY_SPACING}`,
  sm: `text-sm ${BODY_SPACING}`,
  base: `text-base ${BODY_SPACING}`,
  lg: `text-lg ${BODY_SPACING}`,
  xl: `text-xl ${BODY_SPACING}`,
  "2xl": `text-2xl ${FONT_SPACING}`,
  "3xl": `text-3xl ${FONT_SPACING}`,
  "4xl": `text-4xl ${FONT_SPACING}`,
  "5xl": `text-5xl ${FONT_SPACING}`,
  "6xl": `text-6xl ${FONT_SPACING}`,
  "7xl": `text-7xl ${FONT_SPACING}`,
  "8xl": `text-8xl ${FONT_SPACING}`,
  "9xl": `text-9xl ${FONT_SPACING}`,
} as const

// Responsive heading presets — all use tight heading spacing
export const fontHeading = {
  // text-2xl md:text-3xl
  sm: `text-2xl md:text-3xl ${FONT_SPACING}`,
  // text-4xl md:text-5xl lg:text-6xl
  md: `text-4xl md:text-5xl lg:text-6xl ${FONT_SPACING}`,
  // text-4xl md:text-5xl lg:text-6xl xl:text-7xl
  lg: `text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${FONT_SPACING}`,
  // text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem]
  hero: `text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] ${FONT_SPACING}`,
} as const
