"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Category } from "@/types";

interface CategoryWithCount extends Category {
  _count: { products: number };
}

interface Props {
  categories: CategoryWithCount[];
}

export function CategoriesManager({ categories }: Props) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", icon: "" });

  const handleCreate = async () => {
    if (!form.name) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Category created");
      setIsAdding(false);
      setForm({ name: "", description: "", icon: "" });
      router.refresh();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Products in this category will be unaffected.`)) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Category deleted");
      router.refresh();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-carbon-800">
            <tr>
              {["Icon", "Name", "Slug", "Products", ""].map((h) => (
                <th key={h} className="text-left text-carbon-500 text-xs font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-carbon-800/20 transition-colors">
                <td className="px-4 py-3 text-xl">{cat.icon || "📦"}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{cat.name}</div>
                  {cat.description && <div className="text-carbon-500 text-xs">{cat.description}</div>}
                </td>
                <td className="px-4 py-3 text-carbon-400 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-carbon-300">{cat._count.products}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="text-carbon-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding ? (
        <div className="glass rounded-lg p-5 space-y-3">
          <h3 className="font-display font-semibold text-white">New Category</h3>
          <div className="grid grid-cols-3 gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Category name *"
              className="input-premium col-span-2"
            />
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="Icon emoji"
              className="input-premium"
            />
          </div>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="input-premium"
          />
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={isLoading} className="btn-gold text-sm py-2 flex items-center gap-2">
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              Create
            </button>
            <button onClick={() => setIsAdding(false)} className="btn-ghost-gold text-sm py-2">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} className="btn-gold text-sm py-2 flex items-center gap-2">
          <Plus size={14} /> Add Category
        </button>
      )}
    </div>
  );
}
