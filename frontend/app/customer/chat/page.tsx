"use client";

import ChatForm from "@/components/chat/ChatForm";

/**
 * Customer AI Support Chat Page.
 */
export default function CustomerChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <ChatForm />
    </div>
  );
}
