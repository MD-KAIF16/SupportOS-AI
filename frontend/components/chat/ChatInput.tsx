"use client";

import React, { useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Sparkles } from "lucide-react";

type ChatInputProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  handleSend: () => void;
};

export default function ChatInput({
  message,
  setMessage,
  loading,
  handleSend,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-4 relative group">
      {/* Subtle Focus Ring Glow */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600/30 via-fuchsia-600/30 to-pink-600/30 opacity-0 group-within:opacity-100 transition duration-300 blur-sm pointer-events-none" />

      <div className="relative glass-panel rounded-2xl p-3 border border-white/10 bg-[#0a0a10]/90 backdrop-blur-xl flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask SupportOS AI anything... (Press Enter to send, Shift+Enter for new line)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none resize-none min-h-[44px] max-h-[160px] leading-relaxed"
        />

        {/* Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] px-2">
          {/* Quick Triggers (Attachment, Voice) */}
          <div className="flex items-center gap-1.5 text-gray-400">
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-white/[0.08] hover:text-purple-300 transition"
              title="Attach File / Document"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-white/[0.08] hover:text-purple-300 transition"
              title="Voice Input"
            >
              <Mic className="h-4 w-4" />
            </button>
            <span className="text-[11px] text-gray-500 hidden sm:inline ml-2">
              Supports RAG document grounding
            </span>
          </div>

          {/* Send Button */}
          <button
            type="button"
            disabled={loading || !message.trim()}
            onClick={handleSend}
            className="flex items-center gap-2 rounded-xl purple-glow-btn px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <>
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}