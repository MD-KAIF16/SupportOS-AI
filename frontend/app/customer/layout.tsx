"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  MessageSquare, 
  Ticket, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";

/**
 * Customer Portal Shell Layout.
 *
 * Responsibility:
 * Enforces customer authentication guard and renders customer header navigation.
 */
export default function CustomerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, loading, logout } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!token) {
      router.replace("/");
      return;
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-xs text-purple-300 font-medium">Loading Support Portal...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const customerNavItems = [
    { name: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
    { name: "AI Support Chat", path: "/customer/chat", icon: MessageSquare },
    { name: "My Tickets", path: "/customer/tickets", icon: Ticket },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050507]">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/[0.08] bg-[#050507]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/customer/dashboard" className="flex items-center gap-2 group">
            <Logo size={42} showText={true} />
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 rounded-full bg-white/[0.04] p-1 border border-white/[0.06]">
            {customerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600/80 to-violet-600/80 text-white shadow-lg shadow-purple-500/20 border border-purple-400/30"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="font-semibold">Customer Portal</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-purple-500/20">
                {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
