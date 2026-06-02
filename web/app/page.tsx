import { AiDrawer } from "@/components/ai-drawer"
import { VisitorTracker } from "@/components/track/visitor-tracker"
import { Architecture } from "@/components/landing/architecture"
import { BlogSection } from "@/components/landing/blog-section"
import { Calculator } from "@/components/landing/calculator"
import { Cta } from "@/components/landing/cta"
import { Faq } from "@/components/landing/faq"
import { Hero } from "@/components/landing/hero"
import { LandingReveal } from "@/components/landing/landing-reveal"
import { LightSection } from "@/components/landing/light-section"
import { ParallaxFeatures } from "@/components/landing/parallax-features"
import { ProblemSection } from "@/components/landing/problem-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import { TrustBar } from "@/components/landing/trust-bar"

export default function Page() {
  return (
    <div className="landing">
      <LandingReveal />
      <div className="page">
        <div className="frame">
          <SiteNav />
          <Hero />
          <TrustBar />
          <ProblemSection />
          <ParallaxFeatures />
          <Calculator />
          <LightSection />
          <Architecture />
          <Faq />
          <BlogSection />
          <Cta />
          <SiteFooter />
        </div>
      </div>
      {/* Drawer "Falar com a IA" — agnóstico à IA por enquanto.
          Plugue depois: <AiDrawer onSendMessage={minhaFn} /> ou deixe usar
          o route handler default em /api/ai-chat. */}
      <AiDrawer />
      {/* Tracker de visitas → Discord (webhook fica só no servidor). */}
      <VisitorTracker />
    </div>
  )
}
