import { BlogEditor } from "@/components/admin/blog-editor";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">New Blog Post</h1>
      </div>
      <BlogEditor />
    </div>
  );
}
