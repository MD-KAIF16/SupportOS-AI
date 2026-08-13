"use client";

import { Sparkles, Bot, Trash2 } from "lucide-react";
import Logo from "../common/Logo";

type ChatHeaderProps = {
  onClearHistory?: () => void;
};

export default function ChatHeader({ onClearHistory }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 blur-sm" />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a0a0f] border border-white/10 text-purple-400">
            <Bot className="h-5 w-5" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              SupportOS <span className="text-purple-400">AI</span> Assistant
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/20">
              <Sparkles className="h-2.5 w-2.5 text-purple-400" />
              Gemini RAG + LangGraph
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Knowledge Base RAG & Contextual Memory Active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-300">Agents Ready</span>
        </div>

        {onClearHistory && (
          <button
            onClick={onClearHistory}
            className="flex h-9 w-9 items-center justify-center rounded-xl glass-panel text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Clear Chat Session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}