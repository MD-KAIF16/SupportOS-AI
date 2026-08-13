"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, 
  BarChart3, 
  Ticket, 
  MessageSquare, 
  LogOut, 
  ShieldCheck, 
  LayoutDashboard,
  Building2
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";

/**
 * Admin Panel Shell & Role Protection Layout.
 *
 * Responsibility:
 * Enforces admin role access guard and renders the enterprise admin navigation sidebar.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, loading, logout } = useAuth();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (loading) return;
    if (!token) {
      router.replace("/");
      return;
    }
    if (!isAdmin) {
      router.replace("/customer/dashboard");
    }
  }, [loading, token, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-xs text-purple-300 font-medium">Loading Admin Workspace...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const adminNavItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Knowledge Base", path: "/admin/knowledge-base", icon: BookOpen },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Support Tickets", path: "/admin/tickets", icon: Ticket },
    { name: "AI Chat Console", path: "/admin/chat", icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#050507]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass-panel border-r border-white/[0.08] p-4 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="pb-6 mb-6 border-b border-white/[0.08] flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Logo size={40} showText={true} />
            </Link>
          </div>

          {/* Admin Role Pill */}
          <div className="mb-6 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <span className="font-semibold">Admin Panel</span>
            </div>
            <Building2 className="h-3.5 w-3.5 text-purple-400 opacity-70" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || (item.path !== "/admin/dashboard" && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600/80 to-violet-600/80 text-white shadow-lg shadow-purple-500/20 border border-purple-400/30"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.email ? user.email.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">{user?.email}</span>
              <span className="text-[10px] text-purple-400 font-medium">Administrator</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
