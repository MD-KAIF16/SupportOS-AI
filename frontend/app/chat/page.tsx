"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatForm from "@/components/chat/ChatForm";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/context/AuthContext";

export default function ChatPage() {
  const router = useRouter();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!token) {
      router.replace("/");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-xs text-purple-300 font-medium">Loading Chat Workspace...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <ChatForm />
      </main>
    </div>
  );
}