"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { sendMessage, getChatHistory } from "@/services/chat.service";
import { useAuth } from "@/context/AuthContext";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

type DocumentContext = {
  title: string;
  content: string;
  score?: number;
};

type Message = {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  documents?: DocumentContext[];
};

export default function ChatForm() {
  const router = useRouter();
  const { token } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load past conversation history on mount
  useEffect(() => {
    if (!token) return;

    async function loadHistory() {
      try {
        setFetchingHistory(true);
        const res = await getChatHistory(token!);
        if (res.success && Array.isArray(res.history)) {
          const loadedMsgs: Message[] = [];
          res.history.forEach((item: any) => {
            const timeStr = item.created_at
              ? new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "";
            if (item.question) {
              loadedMsgs.push({
                role: "user",
                text: item.question,
                timestamp: timeStr,
              });
            }
            if (item.answer) {
              loadedMsgs.push({
                role: "assistant",
                text: item.answer,
                timestamp: timeStr,
              });
            }
          });
          setMessages(loadedMsgs);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setFetchingHistory(false);
      }
    }

    loadHistory();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!message.trim()) return;

    if (!token) {
      router.replace("/");
      return;
    }

    const currentMessage = message;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentMessage,
        timestamp: now,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await sendMessage(currentMessage, token);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.reply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          documents: response.data.documents || [],
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I encountered an issue processing your request. Please check your network or try again.",
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

  const handleClearHistory = () => {
    setMessages([]);
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      setMessage(lastUserMsg.text);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col flex-1">
      <ChatHeader onClearHistory={handleClearHistory} />
      <ChatMessages
        messages={messages}
        loading={loading || fetchingHistory}
        messagesEndRef={messagesEndRef}
        onRegenerate={handleRegenerate}
      />
      <ChatInput
        message={message}
        setMessage={setMessage}
        loading={loading}
        handleSend={handleSend}
      />
    </div>
  );
}