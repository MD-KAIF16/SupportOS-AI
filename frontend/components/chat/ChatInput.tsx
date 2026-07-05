// ======================================================
// Chat Input Component
// ======================================================

import Input from "../common/Input";
import Button from "../common/Button";

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

  // ==========================================
  // Send message on Enter key
  // ==========================================

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (e.key === "Enter") {

      e.preventDefault();

      handleSend();

    }

  };

  return (

    <div className="mt-6 flex items-end gap-3">

      {/* ================= Input ================= */}

      <div className="flex-1">

        <Input
          type="text"
          placeholder="Ask anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

      </div>

      {/* ================= Send Button ================= */}

      <div className="w-36">

        <Button
          text={loading ? "Thinking..." : "Send"}
          disabled={loading}
          onClick={handleSend}
        />

      </div>

    </div>

  );

}