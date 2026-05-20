import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Products } from "@/components/products"
import { About } from "@/components/about"
import { Categories } from "@/components/categories"
import { Showrooms } from "@/components/showrooms"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <Products />
        <About />
        <Categories />
        <Showrooms />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
