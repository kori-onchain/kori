import { Architecture } from "@/components/landing/architecture"
import { Capabilities } from "@/components/landing/capabilities"
import { Cta } from "@/components/landing/cta"
import { DualBlocks } from "@/components/landing/dual-blocks"
import { Hero } from "@/components/landing/hero"
import { LightSection } from "@/components/landing/light-section"
import { ParallaxFeatures } from "@/components/landing/parallax-features"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import { TrustBar } from "@/components/landing/trust-bar"
import { YieldMap } from "@/components/landing/yield-map"

export default function Page() {
  return (
    <div className="landing">
      <div className="page">
        <div className="frame">
          <SiteNav />
          <Hero />
          <TrustBar />
          <ParallaxFeatures />
          <DualBlocks />
          <YieldMap />
          <LightSection />
          <Capabilities />
          <Architecture />
          <Cta />
          <SiteFooter />
        </div>
      </div>
    </div>
  )
}
