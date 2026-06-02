import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { getFeaturedPosts } from "@/lib/blog-posts"

export function BlogSection() {
  const posts = getFeaturedPosts(3)

  return (
    <section className="section blog-section">
      <span className="sec-label">S:11 / BLOG</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="blog-section-head">
        <div className="sec-head">
          <div className="sec-tag">Blog</div>
          <h2 className="sec-title">
            Tem muito assunto.
            <span className="dim">Aprenda sobre a Kori.</span>
          </h2>
          <p className="section-intro">
            O pitch cabe numa página — a tese, não. Aprofundamos cada ponto no
            blog: o pedágio financeiro, por que Solana, como o lojista antecipa
            e o investidor rende. Tudo com os números reais.
          </p>
        </div>
        <Link href="/blog" className="btn btn-ghost blog-section-link">
          Ver todos
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <div className="blog-feature-grid">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`blog-feature reveal d${i + 1}`}
          >
            <div className="blog-feature-top">
              <span className="feat-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="blog-cat">{post.category}</span>
            </div>
            <h3 className="blog-feature-title">{post.title}</h3>
            <p className="blog-feature-excerpt">{post.excerpt}</p>
            <span className="blog-feature-link">
              Ler artigo
              <ArrowRight size={14} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
