import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
import { mockBlogPosts } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — Automotive Insights",
  description: "Expert automotive tips, maintenance guides, and industry insights from RR Auto Revamp.",
};

async function getPosts() {
  if (!isDbConnected()) return mockBlogPosts;
  const { prisma } = await import("@/lib/prisma");
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    include: { author: { select: { name: true, avatar: true } } },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-carbon-950 pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Knowledge Base</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">Automotive Insights</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="group glass rounded-lg overflow-hidden hover:border-gold/30 hover:shadow-gold transition-all duration-300">
              {post.coverImage && (
                <div className="relative aspect-video overflow-hidden">
                  <Image src={post.coverImage} alt={post.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              )}
              <div className="p-5">
                {post.category && <span className="text-gold text-xs font-semibold tracking-wide uppercase">{post.category}</span>}
                <h2 className="font-display font-bold text-white text-lg mt-2 mb-2 group-hover:text-gold transition-colors line-clamp-2">{post.title}</h2>
                {post.excerpt && <p className="text-carbon-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>}
                <div className="flex items-center justify-between text-xs text-carbon-500">
                  <span>{post.author.name}</span>
                  <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
