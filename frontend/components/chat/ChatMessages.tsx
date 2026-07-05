// ======================================================
// Chat Messages Component
// ======================================================

type Message = {
  role: "user" | "assistant";
  text: string;
};

type ChatMessagesProps = {
  messages: Message[];
};

export default function ChatMessages({
  messages,
}: ChatMessagesProps) {

  return (

    <div className="h-[450px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-6">

      {/* Empty State */}

      {messages.length === 0 && (

        <div className="flex h-full items-center justify-center">

          <div className="text-center">

            <h2 className="text-xl font-semibold text-slate-700">
              👋 Welcome
            </h2>

            <p className="mt-2 text-slate-500">
              Ask anything to SupportOS AI...
            </p>

          </div>

        </div>

      )}

      {/* Conversation */}

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

            {/* Chat Bubble */}

            <div
              className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-md ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-800"
              }`}
            >

              {/* Sender */}

              <p
                className={`mb-2 text-xs font-bold ${
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

              <p className="leading-7 whitespace-pre-wrap break-words">

                {message.text}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}