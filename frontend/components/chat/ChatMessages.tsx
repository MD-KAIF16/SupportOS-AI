"use client";

import { RefObject, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCw, 
  Sparkles,
  FileText
} from "lucide-react";

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

type ChatMessagesProps = {
  messages: Message[];
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onRegenerate?: () => void;
};

export default function ChatMessages({
  messages,
  loading,
  messagesEndRef,
  onRegenerate,
}: ChatMessagesProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [likedIndex, setLikedIndex] = useState<number | null>(null);
  const [dislikedIndex, setDislikedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[600px] min-h-[400px] rounded-2xl glass-panel border border-white/[0.08] relative">
      {/* Empty State */}
      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center p-6">
          <div className="relative mb-6">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 opacity-40 blur-lg animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0a0a12] border border-white/10 text-purple-400 shadow-2xl">
              <Sparkles className="h-10 w-10" />
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            How can SupportOS AI help you today?
          </h3>
          <p className="mt-2 text-sm text-gray-400 max-w-md leading-relaxed">
            I can answer product questions using your Knowledge Base, help manage support tickets, or assist with customer issues.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
            <div className="glass-panel p-3.5 rounded-xl text-left border border-white/[0.08] hover:border-purple-500/30 transition text-xs text-gray-300">
              💡 <span className="font-semibold text-purple-300">"How do I reset my password?"</span>
            </div>
            <div className="glass-panel p-3.5 rounded-xl text-left border border-white/[0.08] hover:border-purple-500/30 transition text-xs text-gray-300">
              ⚡ <span className="font-semibold text-purple-300">"What is your refund policy?"</span>
            </div>
          </div>
        </div>
      )}

      {/* Message List */}
      {messages.map((message, index) => {
        const isUser = message.role === "user";

        return (
          <div
            key={index}
            className={`flex items-start gap-3 sm:gap-4 ${
              isUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-bold shadow-lg ${
                isUser
                  ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-purple-500/20"
                  : "bg-[#12111f] border border-purple-500/30 text-purple-400 shadow-purple-950/40"
              }`}
            >
              {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble Container */}
            <div
              className={`group relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-5 shadow-xl transition-all duration-200 ${
                isUser
                  ? "bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 text-white"
                  : "glass-panel border border-white/[0.1] text-gray-100"
              }`}
            >
              {/* Header metadata */}
              <div className="flex items-center justify-between mb-2 text-[11px] font-semibold text-gray-400">
                <span className={isUser ? "text-purple-300" : "text-purple-400"}>
                  {isUser ? "You" : "SupportOS AI"}
                </span>
                <span className="text-[10px] text-gray-500">{message.timestamp}</span>
              </div>

              {/* Message Content: Claude-inspired Rich Text / Markdown */}
              {isUser ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-100">
                  {message.text}
                </p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-purple-400 prose-code:text-purple-300 prose-code:bg-purple-950/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#07070d] prose-pre:border prose-pre:border-white/10">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              )}

              {/* Document Sources Indicator */}
              {message.documents && message.documents.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Retrieved Knowledge Sources ({message.documents.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {message.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-1 text-[11px] text-purple-300 border border-purple-500/20"
                        title={doc.content}
                      >
                        📄 {doc.title} {doc.score ? `(${Math.round(doc.score * 100)}%)` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assistant Message Actions Toolbar */}
              {!isUser && (
                <div className="mt-3 pt-2 flex items-center justify-between border-t border-white/[0.06] text-gray-400 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(message.text, index)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.08] hover:text-white transition flex items-center gap-1 text-[11px]"
                      title="Copy response"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setLikedIndex(likedIndex === index ? null : index)}
                      className={`p-1.5 rounded-lg hover:bg-white/[0.08] transition ${
                        likedIndex === index ? "text-purple-400 bg-purple-500/10" : ""
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => setDislikedIndex(dislikedIndex === index ? null : index)}
                      className={`p-1.5 rounded-lg hover:bg-white/[0.08] transition ${
                        dislikedIndex === index ? "text-rose-400 bg-rose-500/10" : ""
                      }`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {index === messages.length - 1 && onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      className="p-1.5 rounded-lg hover:bg-white/[0.08] hover:text-purple-300 transition flex items-center gap-1 text-[11px]"
                      title="Regenerate answer"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Thinking / Streaming Loading Indicator */}
      {loading && (
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#12111f] border border-purple-500/30 text-purple-400 shadow-purple-950/40">
            <Bot className="h-4 w-4 animate-spin" />
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-bounce [animation-delay:0.15s]" />
              <span className="h-2 w-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.3s]" />
            </div>
            <span className="text-xs text-purple-300 font-medium">
              Consulting RAG Knowledge Base & Generating Response...
            </span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}