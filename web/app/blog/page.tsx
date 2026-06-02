import type { Metadata } from "next"

import { BlogIndex } from "@/components/blog/blog-index"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tudo sobre a Kori, um argumento de cada vez: a tese, por que Solana, como o lojista antecipa e o investidor rende — com os números reais por trás do produto.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog · Kori",
    description:
      "Da tese ao trilho técnico: como a Kori liga capital global à economia local.",
  },
}

export default function BlogPage() {
  return (
    <div className="landing">
      <div className="page">
        <div className="frame">
          <SiteNav />
          <BlogIndex />
          <SiteFooter />
        </div>
      </div>
    </div>
  )
}
