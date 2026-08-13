"use client";

import ChatForm from "@/components/chat/ChatForm";

/**
 * Admin AI Chat Console Page.
 */
export default function AdminChatPage() {
  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <ChatForm />
    </div>
  );
}
