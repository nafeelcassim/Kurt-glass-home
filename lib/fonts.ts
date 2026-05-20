// Global font spacing values - change here to update everywhere
export const FONT_LEADING = "leading-[0.9]"
export const FONT_TRACKING = "tracking-[-0.05px]"
export const FONT_SPACING = `${FONT_LEADING} ${FONT_TRACKING}`

// Individual font sizes with spacing baked in
export const fonts = {
  xs: `text-xs ${FONT_SPACING}`,
  sm: `text-sm ${FONT_SPACING}`,
  base: `text-base ${FONT_SPACING}`,
  lg: `text-lg ${FONT_SPACING}`,
  xl: `text-xl ${FONT_SPACING}`,
  "2xl": `text-2xl ${FONT_SPACING}`,
  "3xl": `text-3xl ${FONT_SPACING}`,
  "4xl": `text-4xl ${FONT_SPACING}`,
  "5xl": `text-5xl ${FONT_SPACING}`,
  "6xl": `text-6xl ${FONT_SPACING}`,
  "7xl": `text-7xl ${FONT_SPACING}`,
  "8xl": `text-8xl ${FONT_SPACING}`,
  "9xl": `text-9xl ${FONT_SPACING}`,
} as const

// Responsive heading presets
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
