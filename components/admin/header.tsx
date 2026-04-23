"use client";

import { Search } from "lucide-react";
import { PushNotificationToggle } from "@/components/admin/push-notifications";

export function AdminHeader() {
  return (
    <header className="h-16 bg-carbon-900 border-b border-white/5 flex items-center justify-between px-4 lg:px-6">
      {/* Spacer for mobile hamburger button */}
      <div className="w-10 lg:hidden" />

      <div className="flex items-center gap-3 flex-1 max-w-md mx-4 lg:mx-0">
        <Search size={16} className="text-carbon-500 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-white placeholder:text-carbon-500 outline-none flex-1 min-w-0"
        />
      </div>

      <div className="flex items-center gap-2">
        <PushNotificationToggle />
        <div className="w-8 h-8 bg-gold-gradient rounded-sm flex items-center justify-center shrink-0">
          <span className="text-carbon-950 font-bold text-xs">A</span>
        </div>
      </div>
    </header>
  );
}
