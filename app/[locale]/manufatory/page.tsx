import { Header } from "@/components/header"
import { ManufactoryPage } from "@/components/manufactory-page"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"

export default function Manufatory() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <ManufactoryPage />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
