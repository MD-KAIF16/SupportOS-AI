"use client";

// ======================================================
// Chat Form Component
// ======================================================

import { useState } from "react";

import { sendMessage } from "@/services/chat.service";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatForm() {

  // ==========================================
  // User Input
  // ==========================================

  const [message, setMessage] = useState("");

  // ==========================================
  // Conversation
  // ==========================================

  const [messages, setMessages] = useState<Message[]>([]);

  // ==========================================
  // Loading
  // ==========================================

  const [loading, setLoading] = useState(false);

  // ==========================================
  // Send Message
  // ==========================================

  const handleSend = async () => {

    if (!message.trim()) return;

    const currentMessage = message;

    // User Message

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentMessage,
      },
    ]);

    setMessage("");

    setLoading(true);

    try {

      const data = await sendMessage(currentMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);

    } catch {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. Please try again.",
        },
      ]);

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4 py-8">

      <div className="w-full max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">

        {/* Header */}

        <ChatHeader />

        {/* Messages */}

        <ChatMessages
          messages={messages}
        />

        {/* Input */}

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