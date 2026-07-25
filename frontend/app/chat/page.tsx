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

      <div className="flex min-h-screen items-center justify-center">

        Loading...

      </div>

    );

  }

  if (!token) {

    return null;

  }

  return <ChatForm />;

}