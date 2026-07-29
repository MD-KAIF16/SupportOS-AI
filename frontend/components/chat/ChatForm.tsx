"use client";

// ======================================================
// Chat Form Component
// ======================================================

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { sendMessage } from "@/services/chat.service";
import { useAuth } from "@/context/AuthContext";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

// ======================================================
// Types
// ======================================================

type Message = {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
};

export default function ChatForm() {

  // =====================================================
  // Router
  // =====================================================

  const router = useRouter();

  // =====================================================
  // Auth Context
  // =====================================================

  const { token, logout } = useAuth();

  // =====================================================
  // User Input
  // =====================================================

  const [message, setMessage] = useState("");

  // =====================================================
  // Conversation
  // =====================================================

  const [messages, setMessages] = useState<Message[]>([]);

  // =====================================================
  // Loading
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // Auto Scroll Ref
  // =====================================================

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =====================================================
  // Logout
  // =====================================================

  const handleLogout = () => {

    logout();

    router.replace("/");

  };

  // =====================================================
  // Send Message
  // =====================================================

  const handleSend = async () => {

    if (!message.trim()) return;

    if (!token) {

      router.replace("/");

      return;

    }

    const currentMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");

    setLoading(true);

    try {

      const response = await sendMessage(
        currentMessage,
        token
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.reply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

    } catch (error) {

      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4 py-8">

      <div className="w-full max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">

        {/* =========================================
            Header
        ========================================== */}

        <div className="mb-6 flex items-center justify-between">

          <ChatHeader />

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Logout
          </button>

        </div>

        {/* =========================================
            Messages
        ========================================== */}

        <ChatMessages
          messages={messages}
          loading={loading}
          messagesEndRef={messagesEndRef}
        />

        {/* =========================================
            Chat Input
        ========================================== */}

        <ChatInput
          message={message}
          setMessage={setMessage}
          loading={loading}
          handleSend={handleSend}
        />

      </div>

    </main>

  );

}