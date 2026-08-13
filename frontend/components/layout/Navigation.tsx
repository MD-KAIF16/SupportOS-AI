"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  MessageSquare, 
  Ticket, 
  BarChart3, 
  LogOut, 
  ShieldCheck, 
  User as UserIcon,
  Sparkles,
  BookOpen
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Role-Aware Navigation Configuration
  const navItems = isAdmin
    ? [
        { name: "Knowledge Base", path: "/knowledge-base", icon: BookOpen },
        { name: "Analytics", path: "/analytics", icon: BarChart3 },
        { name: "Tickets", path: "/tickets", icon: Ticket },
        { name: "AI Chat", path: "/chat", icon: MessageSquare },
      ]
    : [
        { name: "AI Chat", path: "/chat", icon: MessageSquare },
        { name: "My Tickets", path: "/tickets", icon: Ticket },
      ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/[0.08] bg-[#050507]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href={isAdmin ? "/knowledge-base" : "/chat"} className="flex items-center gap-2 group">
          <Logo size={42} showText={true} />
        </Link>

        {/* Navigation Tabs (Role Aware) */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/[0.04] p-1 border border-white/[0.06]">
            {navItems.map((item) => {
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
        )}

        {/* Right Action / Profile / Role Badge */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 border text-xs ${
              isAdmin
                ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="font-semibold capitalize">{isAdmin ? "Admin Workspace" : "Customer Workspace"}</span>
            </div>

            {/* Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-purple-500/20">
                {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl purple-glow-btn px-4 py-2 text-xs font-semibold text-white"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile nav bar */}
      {user && (
        <div className="flex md:hidden items-center justify-around border-t border-white/[0.06] bg-[#08080c] py-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${
                  isActive ? "text-purple-400 bg-purple-500/10" : "text-gray-400"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
