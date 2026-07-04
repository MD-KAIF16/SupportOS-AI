"use client";

import { useState } from "react";
import { sendMessage } from "@/services/chat.service";

export default function ChatPage() {

  // User message
  const [message, setMessage] = useState("");

  // Gemini reply
  const [reply, setReply] = useState("");

  // Send message to backend
  const handleSend = async () => {

    const data = await sendMessage(message);

    setReply(data.reply);

  };

  return (

    <main className="min-h-screen flex flex-col items-center justify-center gap-5 p-6">

      <h1 className="text-4xl font-bold">
        SupportOS AI Chat
      </h1>

      <input
        type="text"
        placeholder="Ask anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full max-w-xl rounded-lg border border-gray-300 p-3"
      />

      <button
        onClick={handleSend}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Send
      </button>

      <div className="w-full max-w-xl rounded-lg border border-gray-300 p-5">

        <h2 className="mb-2 text-xl font-semibold">
          Gemini Reply
        </h2>

        <p>{reply}</p>

      </div>

    </main>

  );
}