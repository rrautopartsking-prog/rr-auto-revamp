import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

export const dynamic = "force-dynamic";
import { mockBlogPosts } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";
import { formatDate } from "@/lib/utils";

interface PageProps { params: { slug: string } }

async function getPost(slug: string) {
  if (!isDbConnected()) return mockBlogPosts.find((p) => p.slug === slug) || null;
  const { prisma } = await import("@/lib/prisma");
  const post = await prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
    include: { author: { select: { name: true, avatar: true } } },
  });
  if (post) await prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });
  return post;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Not Found" };
  return { title: post.metaTitle || post.title, description: post.metaDesc || post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-carbon-950 pt-20">
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        {post.category && <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">{post.category}</span>}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-3 mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-carbon-500 text-sm mb-8">
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
        </div>
        {post.coverImage && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-10">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="768px" priority />
          </div>
        )}
        <div className="prose prose-invert max-w-none text-carbon-200 leading-relaxed prose-headings:font-display prose-headings:text-white prose-a:text-gold prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
