"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  name: string;
  slug: string;
}

export function ShareProduct({ name, slug }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/products/${slug}`
    : `https://rrautorevamp.com/products/${slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({ title: name, url });
    } else {
      setOpen(!open);
    }
  };

  const waMsg = encodeURIComponent(`Check out this part: ${name}\n${url}`);

  return (
    <div className="relative">
      <button
        onClick={shareNative}
        className="flex items-center gap-1.5 text-xs text-carbon-400 hover:text-gold border border-carbon-700 hover:border-gold/50 px-3 py-2 rounded-sm transition-all"
      >
        <Share2 size={13} /> Share
      </button>

      {open && (
        <div className="absolute right-0 top-10 bg-carbon-900 border border-carbon-700 rounded-lg shadow-xl p-3 z-20 w-48 space-y-2">
          <button onClick={copyLink}
            className="w-full flex items-center gap-2 text-xs text-carbon-300 hover:text-white px-2 py-1.5 rounded hover:bg-carbon-800 transition-colors">
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a href={`https://wa.me/?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-2 text-xs text-carbon-300 hover:text-white px-2 py-1.5 rounded hover:bg-carbon-800 transition-colors">
            <MessageCircle size={13} className="text-[#25D366]" /> Share on WhatsApp
          </a>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out: ${name}`)}&url=${encodeURIComponent(url)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-2 text-xs text-carbon-300 hover:text-white px-2 py-1.5 rounded hover:bg-carbon-800 transition-colors">
            <span className="text-[#1DA1F2] font-bold text-xs">𝕏</span> Share on X
          </a>
        </div>
      )}
    </div>
  );
}
