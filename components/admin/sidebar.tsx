"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Package, Tag, FileText,
  Star, Settings, LogOut, ChevronRight, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gold-gradient rounded-sm flex items-center justify-center">
            <span className="text-carbon-950 font-display font-bold text-xs">RR</span>
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm tracking-wide">AUTO REVAMP</div>
            <div className="text-carbon-500 text-xs">Admin Panel</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-carbon-400 hover:text-white transition-colors lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-carbon-400 hover:text-white hover:bg-carbon-800"
              )}
            >
              <item.icon size={16} className={isActive ? "text-gold" : "text-carbon-500 group-hover:text-white"} />
              {item.label}
              {isActive && <ChevronRight size={12} className="ml-auto text-gold" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-carbon-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger — shown in header area */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-carbon-900 border border-carbon-700 rounded-sm flex items-center justify-center text-white"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-carbon-950/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-64 z-50 bg-carbon-900 border-r border-white/5 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-carbon-900 border-r border-white/5 flex-col shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
