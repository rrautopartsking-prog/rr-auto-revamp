import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";
import { mockBlogPosts } from "@/lib/mock-data";
import { isDbConnected } from "@/lib/db";
import { formatDate } from "@/lib/utils";

async function getPosts() {
  if (!isDbConnected()) return mockBlogPosts;
  const { prisma } = await import("@/lib/prisma");
  return prisma.blogPost.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Blog CMS</h1>
          <p className="text-carbon-400 text-sm mt-1">{posts.length} posts</p>
        </div>
        <Link href="/admin/blog/new" className="btn-gold text-sm py-2 flex items-center gap-2">
          <Plus size={14} /> New Post
        </Link>
      </div>
      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-carbon-800">
            <tr>{["Title", "Author", "Status", "Views", "Date", ""].map((h) => (
              <th key={h} className="text-left text-carbon-500 text-xs font-medium px-4 py-3">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-carbon-800">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-carbon-800/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-white line-clamp-1">{post.title}</div>
                  <div className="text-carbon-500 text-xs font-mono">/blog/{post.slug}</div>
                </td>
                <td className="px-4 py-3 text-carbon-300">{post.author.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-sm ${post.isPublished ? "text-green-400 bg-green-400/10" : "text-carbon-400 bg-carbon-400/10"}`}>
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-carbon-400">{post.viewCount}</td>
                <td className="px-4 py-3 text-carbon-500 text-xs">{formatDate(post.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${post.id}/edit`} className="text-gold text-xs hover:text-gold-light">Edit →</Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={6} className="text-center text-carbon-500 py-10">No posts yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
