// ======================================================
// Chat Messages Component
// ======================================================

import { RefObject } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
};

type ChatMessagesProps = {
  messages: Message[];
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
};

export default function ChatMessages({
  messages,
  loading,
  messagesEndRef,
}: ChatMessagesProps) {

  return (

    <div className="h-[500px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-6">

      {/* =========================================
          Empty State
      ========================================== */}

      {messages.length === 0 && !loading && (

        <div className="flex h-full items-center justify-center">

          <div className="text-center">

            <div className="mb-4 text-6xl">
              🤖
            </div>

            <h2 className="text-2xl font-bold text-slate-700">
              Welcome to SupportOS AI
            </h2>

            <p className="mt-3 text-slate-500">
              Ask anything and I'll help you instantly.
            </p>

          </div>

        </div>

      )}

      {/* =========================================
          Conversation
      ========================================== */}

      <div className="space-y-5">

        {messages.map((message, index) => (

          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-md transition-all duration-300 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-800"
              }`}
            >

              {/* Sender */}

              <p
                className={`mb-2 text-xs font-semibold ${
                  message.role === "user"
                    ? "text-blue-100"
                    : "text-slate-500"
                }`}
              >
                {message.role === "user"
                  ? "You"
                  : "SupportOS AI"}
              </p>

              {/* Message */}

              <p className="whitespace-pre-wrap break-words leading-7">

                {message.text}

              </p>

              {/* Timestamp */}

              <p
                className={`mt-3 text-right text-[11px] ${
                  message.role === "user"
                    ? "text-blue-100"
                    : "text-slate-400"
                }`}
              >
                {message.timestamp}
              </p>

            </div>

          </div>

        ))}

        {/* =========================================
            Typing Indicator
        ========================================== */}

        {loading && (

          <div className="flex justify-start">

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-md">

              <p className="mb-2 text-xs font-semibold text-slate-500">
                SupportOS AI
              </p>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "0.15s" }}
                ></span>

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "0.3s" }}
                ></span>

              </div>

            </div>

          </div>

        )}

        <div ref={messagesEndRef} />

      </div>

    </div>

  );

}