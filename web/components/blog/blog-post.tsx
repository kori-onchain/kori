import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import type { BlogPost as BlogPostType } from "@/lib/blog-posts"
import { getAllPosts } from "@/lib/blog-posts"
import { GlossyOrangeButton } from "@/components/landing/glossy-orange-button"
import { BlogBlocks } from "@/components/blog/blog-blocks"

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`))
}

export function BlogPost({ post }: { post: BlogPostType }) {
  // Próximos posts pra continuar lendo (até 2, excluindo o atual).
  const more = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2)

  return (
    <article className="section blog-article">
      <span className="corner bl" />
      <span className="corner br" />

      <Link href="/blog" className="blog-back">
        <ArrowLeft size={14} aria-hidden="true" />
        Blog
      </Link>

      <header className="blog-article-head">
        <div className="blog-meta">
          <span className="blog-cat">{post.category}</span>
          <span className="blog-dot" aria-hidden="true">
            ·
          </span>
          <span>{formatDate(post.date)}</span>
          <span className="blog-dot" aria-hidden="true">
            ·
          </span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="blog-title">{post.title}</h1>
        <p className="blog-excerpt">{post.excerpt}</p>
      </header>

      <BlogBlocks blocks={post.body} />

      <footer className="blog-article-foot">
        <span className="blog-byline">por {post.author}</span>
        <GlossyOrangeButton
          href="/blog"
          size="sm"
          icon={<ArrowLeft />}
          className="blog-foot-cta"
        >
          Voltar pro blog
        </GlossyOrangeButton>
      </footer>

      {more.length ? (
        <section className="blog-more">
          <div className="sec-tag">Continue lendo</div>
          <div className="blog-more-grid">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="blog-more-card"
              >
                <span className="blog-cat">{p.category}</span>
                <span className="blog-more-title">{p.title}</span>
                <span className="blog-more-link">
                  Ler artigo
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
