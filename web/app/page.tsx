import { Architecture } from "@/components/landing/architecture"
import { Capabilities } from "@/components/landing/capabilities"
import { Cta } from "@/components/landing/cta"
import { Faq } from "@/components/landing/faq"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { LightSection } from "@/components/landing/light-section"
import { ParallaxFeatures } from "@/components/landing/parallax-features"
import { ProblemSection } from "@/components/landing/problem-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import { TrustBar } from "@/components/landing/trust-bar"

export default function Page() {
  return (
    <div className="landing">
      <div className="page">
        <div className="frame">
          <SiteNav />
          <Hero />
          <TrustBar />
          <ProblemSection />
          <HowItWorks />
          <LightSection />
          <Capabilities />
          <ParallaxFeatures />
          <Architecture />
          <Faq />
          <Cta />
          <SiteFooter />
        </div>
      </div>
    </div>
  )
}
