"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations";

interface Props {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    tags: string[];
    category: string | null;
    metaTitle: string | null;
    metaDesc: string | null;
    isPublished: boolean;
  };
}

export function BlogEditor({ post }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: post ? {
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || "",
      tags: post.tags,
      category: post.category || "",
      metaTitle: post.metaTitle || "",
      metaDesc: post.metaDesc || "",
      isPublished: post.isPublished,
    } : { isPublished: false, tags: [] },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your article here..." }),
    ],
    content: post?.content || "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[300px] focus:outline-none text-carbon-200 leading-relaxed",
      },
    },
  });

  const onSubmit = async (data: BlogPostInput) => {
    setIsLoading(true);
    try {
      const url = post ? `/api/blog/${post.id}` : "/api/blog";
      const method = post ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success(post ? "Post updated" : "Post created");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const ToolbarButton = ({ onClick, children, active }: { onClick: () => void; children: React.ReactNode; active?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-sm transition-colors ${active ? "bg-gold/20 text-gold" : "text-carbon-400 hover:text-white hover:bg-carbon-700"}`}
    >
      {children}
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="glass rounded-lg p-5 space-y-4">
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Title *</label>
          <input {...register("title")} className="input-premium text-lg font-semibold" placeholder="Article title..." />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Excerpt</label>
          <textarea {...register("excerpt")} rows={2} className="input-premium resize-none" placeholder="Brief summary..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Category</label>
            <input {...register("category")} className="input-premium" placeholder="e.g. Maintenance Tips" />
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Cover Image URL</label>
            <input {...register("coverImage")} className="input-premium" placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="glass rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-3 border-b border-carbon-800">
          <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")}>
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")}>
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")}>
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")}>
            <ListOrdered size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => {
            const url = prompt("Enter URL:");
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}>
            <LinkIcon size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => {
            const url = prompt("Enter image URL:");
            if (url) editor?.chain().focus().setImage({ src: url }).run();
          }}>
            <ImageIcon size={14} />
          </ToolbarButton>
        </div>
        <div className="p-5">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* SEO + Publish */}
      <div className="glass rounded-lg p-5 space-y-4">
        <h3 className="font-display font-semibold text-white">SEO & Publishing</h3>
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Meta Title</label>
          <input {...register("metaTitle")} className="input-premium" />
        </div>
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Meta Description</label>
          <textarea {...register("metaDesc")} rows={2} className="input-premium resize-none" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("isPublished")} className="accent-gold" />
          <span className="text-sm text-carbon-300">Publish immediately</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isLoading} className="btn-gold flex items-center gap-2">
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {post ? "Update Post" : "Create Post"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost-gold">Cancel</button>
      </div>
    </form>
  );
}
