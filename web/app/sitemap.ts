import type { MetadataRoute } from "next"

import { getAllPosts } from "@/lib/blog-posts"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kori.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T12:00:00`),
    changeFrequency: "monthly",
    priority: 0.6,
  }))
  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blog`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/download`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...posts,
  ]
}
