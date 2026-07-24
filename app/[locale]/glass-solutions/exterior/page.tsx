import { Footer } from "@/components/footer"
import { GlassSolutionsPage } from "@/components/glass-solutions-page"
import { Header } from "@/components/header"
import { SmoothScroll } from "@/components/smooth-scroll"

export default function ExteriorGlassSolutions() {
  return (
    <SmoothScroll>
      <Header />
      <GlassSolutionsPage type="exterior" />
      <Footer />
    </SmoothScroll>
  )
}
