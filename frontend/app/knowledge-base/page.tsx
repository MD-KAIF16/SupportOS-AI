"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Knowledge Base Route Redirector.
 * Forwards requests to /admin/knowledge-base.
 */
export default function LegacyKnowledgeBaseRedirect() {
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
      router.replace("/admin/knowledge-base");
    } else {
      router.replace("/customer/dashboard");
    }
  }, [loading, token, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050507]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        <span className="text-xs text-purple-300 font-medium">Navigating to Knowledge Base...</span>
      </div>
    </div>
  );
}
