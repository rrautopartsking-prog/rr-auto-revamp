"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Package, Tag, FileText,
  Star, Settings, LogOut, ChevronRight,
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

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <aside className="w-60 bg-carbon-900 border-r border-white/5 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gold-gradient rounded-sm flex items-center justify-center">
            <span className="text-carbon-950 font-display font-bold text-xs">RR</span>
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm tracking-wide">AUTO REVAMP</div>
            <div className="text-carbon-500 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
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
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-carbon-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
