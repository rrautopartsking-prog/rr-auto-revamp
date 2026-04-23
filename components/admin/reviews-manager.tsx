"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, X, AlertTriangle, Plus, Trash2, Pencil, Save } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate, cn } from "@/lib/utils";
import type { Review } from "@/types";

interface Props {
  reviews: (Review & { product: { name: string } | null })[];
}

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  APPROVED: "text-green-400 bg-green-400/10",
  REJECTED: "text-red-400 bg-red-400/10",
  SPAM: "text-carbon-400 bg-carbon-400/10",
};

const emptyForm = { authorName: "", authorEmail: "", rating: 5, title: "", content: "" };

export function ReviewsManager({ reviews }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<typeof emptyForm & { rating: number }>>({});

  const updateReview = async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("Review updated");
      router.refresh();
    } else {
      toast.error("Update failed");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Review deleted"); router.refresh(); }
    else toast.error("Delete failed");
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({ authorName: review.authorName, title: review.title || "", content: review.content, rating: review.rating });
  };

  const saveEdit = async (id: string) => {
    await updateReview(id, editForm);
    setEditingId(null);
  };

  const addReview = async () => {
    if (!form.authorName || !form.content) { toast.error("Name and content are required"); return; }
    setAdding(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isAdminCreated: true }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Review added and approved");
      setForm(emptyForm);
      setShowAdd(false);
      router.refresh();
    } catch { toast.error("Failed to add review"); }
    finally { setAdding(false); }
  };

  const filtered = filter === "ALL" ? reviews : reviews.filter((r) => r.status === filter);

  // Stats
  const avgRating = reviews.filter(r => r.status === "APPROVED").length
    ? (reviews.filter(r => r.status === "APPROVED").reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.status === "APPROVED").length).toFixed(1)
    : "—";

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Reviews", value: reviews.length },
          { label: "Approved", value: reviews.filter(r => r.status === "APPROVED").length },
          { label: "Avg Rating", value: `${avgRating} ★` },
        ].map((s) => (
          <div key={s.label} className="glass rounded-lg p-3 text-center">
            <div className="text-gold font-bold text-xl">{s.value}</div>
            <div className="text-carbon-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {["ALL", "PENDING", "APPROVED", "REJECTED", "SPAM"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn("text-xs px-3 py-1.5 rounded-sm border transition-all",
                filter === s ? "border-gold text-gold bg-gold/10" : "border-carbon-600 text-carbon-400 hover:border-gold/50")}>
              {s} {s !== "ALL" && `(${reviews.filter((r) => r.status === s).length})`}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-gold text-xs flex items-center gap-1.5 py-1.5 px-3">
          <Plus size={14} /> Add Review
        </button>
      </div>

      {/* Add review form */}
      {showAdd && (
        <div className="glass rounded-lg p-5 space-y-4 border border-gold/20">
          <h4 className="font-semibold text-white text-sm">Add New Review</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-carbon-400 mb-1 block">Customer Name *</label>
              <input className="input-premium" placeholder="e.g. Rahul Sharma" value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-carbon-400 mb-1 block">Email</label>
              <input className="input-premium" placeholder="customer@email.com" value={form.authorEmail}
                onChange={(e) => setForm({ ...form, authorEmail: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-carbon-400 mb-1 block">Rating</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                    <Star size={20} className={n <= form.rating ? "text-gold fill-gold" : "text-carbon-600"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-carbon-400 mb-1 block">Title</label>
              <input className="input-premium" placeholder="Review title (optional)" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Review Content *</label>
            <textarea className="input-premium resize-none" rows={3} placeholder="Write the customer review here..."
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button onClick={addReview} disabled={adding} className="btn-gold text-sm flex items-center gap-2">
              {adding ? "Adding..." : <><Plus size={14} /> Add & Approve</>}
            </button>
            <button onClick={() => { setShowAdd(false); setForm(emptyForm); }} className="btn-ghost-gold text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className="glass rounded-lg p-5">
            {editingId === review.id ? (
              /* Edit mode */
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setEditForm({ ...editForm, rating: n })}>
                      <Star size={18} className={n <= (editForm.rating || 0) ? "text-gold fill-gold" : "text-carbon-600"} />
                    </button>
                  ))}
                </div>
                <input className="input-premium text-sm" placeholder="Author name" value={editForm.authorName || ""}
                  onChange={(e) => setEditForm({ ...editForm, authorName: e.target.value })} />
                <input className="input-premium text-sm" placeholder="Title (optional)" value={editForm.title || ""}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                <textarea className="input-premium resize-none text-sm" rows={3} value={editForm.content || ""}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(review.id)} className="btn-gold text-xs flex items-center gap-1"><Save size={12} /> Save</button>
                  <button onClick={() => setEditingId(null)} className="btn-ghost-gold text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? "text-gold fill-gold" : "text-carbon-600"} />
                      ))}
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-sm", statusColors[review.status])}>{review.status}</span>
                    {review.product && <span className="text-xs text-carbon-500">on {review.product.name}</span>}
                  </div>
                  {review.title && <h4 className="font-semibold text-white text-sm mb-1">{review.title}</h4>}
                  <p className="text-carbon-300 text-sm">{review.content}</p>
                  <div className="mt-2 text-carbon-500 text-xs">{review.authorName} · {review.authorEmail} · {formatDate(review.createdAt)}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {review.status === "PENDING" && (
                    <>
                      <button onClick={() => updateReview(review.id, { status: "APPROVED" })}
                        className="w-8 h-8 bg-green-400/10 border border-green-400/20 rounded-sm flex items-center justify-center text-green-400 hover:bg-green-400/20 transition-all" title="Approve">
                        <Check size={14} />
                      </button>
                      <button onClick={() => updateReview(review.id, { status: "REJECTED" })}
                        className="w-8 h-8 bg-red-400/10 border border-red-400/20 rounded-sm flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-all" title="Reject">
                        <X size={14} />
                      </button>
                      <button onClick={() => updateReview(review.id, { status: "SPAM" })}
                        className="w-8 h-8 bg-carbon-400/10 border border-carbon-400/20 rounded-sm flex items-center justify-center text-carbon-400 hover:bg-carbon-400/20 transition-all" title="Spam">
                        <AlertTriangle size={14} />
                      </button>
                    </>
                  )}
                  <button onClick={() => startEdit(review)}
                    className="w-8 h-8 bg-gold/10 border border-gold/20 rounded-sm flex items-center justify-center text-gold hover:bg-gold/20 transition-all" title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteReview(review.id)}
                    className="w-8 h-8 bg-red-400/10 border border-red-400/20 rounded-sm flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-all" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center text-carbon-500 py-10">No reviews in this category</div>}
      </div>
    </div>
  );
}
