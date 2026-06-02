import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { getAllPosts } from "@/lib/blog-posts"

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`))
}

export function BlogIndex() {
  const posts = getAllPosts()

  return (
    <section className="section blog-section blog-page">
      <span className="sec-label">S:BLOG</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Blog</div>
        <h1 className="sec-title">
          Tudo sobre a Kori,
          <span className="dim">um argumento de cada vez.</span>
        </h1>
        <p className="section-intro">
          Da tese ao trilho técnico: como a Kori liga capital global à economia
          local, por que escolhemos a Solana e onde está o dinheiro. Conteúdo
          direto, com os números reais por trás do produto.
        </p>
      </div>

      <div className="blog-grid">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
            <div className="blog-card-top">
              <span className="blog-cat">{post.category}</span>
              <span className="blog-card-time">{post.readingTime}</span>
            </div>
            <h2 className="blog-card-title">{post.title}</h2>
            <p className="blog-card-excerpt">{post.excerpt}</p>
            <div className="blog-card-foot">
              <span>{formatDate(post.date)}</span>
              <span className="blog-card-link">
                Ler
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
