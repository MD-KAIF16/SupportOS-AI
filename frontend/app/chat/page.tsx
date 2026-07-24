"use client";

// ======================================================
// Chat Page
//
// Purpose:
// Protected chat page.
// Only authenticated users can access this page.
// ======================================================

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import ChatForm from "@/components/chat/ChatForm";
import { useAuth } from "@/context/AuthContext";

export default function ChatPage() {

  // =====================================================
  // Router
  // =====================================================

  const router = useRouter();

  // =====================================================
  // Authentication Context
  // =====================================================

  const { token } = useAuth();

  // =====================================================
  // Protect Route
  // =====================================================

  useEffect(() => {

    if (!token) {

      router.replace("/");

    }

  }, [token, router]);

  // =====================================================
  // Prevent Page Flash
  // =====================================================

  if (!token) {

    return null;

  }

  // =====================================================
  // Chat UI
  // =====================================================

  return <ChatForm />;

}