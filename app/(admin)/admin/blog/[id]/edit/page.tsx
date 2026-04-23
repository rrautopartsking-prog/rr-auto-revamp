import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/blog-editor";
import { mockBlogPosts } from "@/lib/mock-data";

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = mockBlogPosts.find((p) => p.id === params.id);
  if (!post) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Edit Post</h1>
      <BlogEditor post={post} />
    </div>
  );
}
