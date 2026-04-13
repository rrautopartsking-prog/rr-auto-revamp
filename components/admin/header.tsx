"use client";

import { Bell, Search } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-16 bg-carbon-900 border-b border-white/5 flex items-center justify-between px-6">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search size={16} className="text-carbon-500" />
        <input
          type="text"
          placeholder="Search leads, products..."
          className="bg-transparent text-sm text-white placeholder:text-carbon-500 outline-none flex-1"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-white transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
        </button>
        <div className="w-8 h-8 bg-gold-gradient rounded-sm flex items-center justify-center">
          <span className="text-carbon-950 font-bold text-xs">A</span>
        </div>
      </div>
    </header>
  );
}
