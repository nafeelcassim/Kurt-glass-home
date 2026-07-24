import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Products } from "@/components/products"
import { Manufacturing } from "@/components/manufacturing"
import { InteriorExterior } from "@/components/interior-exterior"
import { About } from "@/components/about"
import { Services } from "@/components/categories"
import { Showrooms } from "@/components/showrooms"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <Products />
        <Manufacturing />
        <InteriorExterior />
        <Services />
        <About />
        <Showrooms />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
