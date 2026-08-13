"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Tickets Route Redirector.
 * Forwards requests to /admin/tickets or /customer/tickets based on role.
 */
export default function LegacyTicketsRedirect() {
  const router = useRouter();
  const { user, token, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!token) {
      router.replace("/");
      return;
    }
    const isAdmin = user?.role?.toLowerCase() === "admin";
    if (isAdmin) {
      router.replace("/admin/tickets");
    } else {
      router.replace("/customer/tickets");
    }
  }, [loading, token, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050507]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        <span className="text-xs text-purple-300 font-medium">Navigating to Support Tickets...</span>
      </div>
    </div>
  );
}