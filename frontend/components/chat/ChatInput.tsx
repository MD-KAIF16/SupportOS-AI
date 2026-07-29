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

  // =====================================================
  // Enter Key
  // =====================================================

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (e.key === "Enter" && !loading) {

      e.preventDefault();

      handleSend();

    }

  };

  return (

    <div className="mt-6 flex items-end gap-4">

      {/* =========================================
          Input
      ========================================== */}

      <div className="flex-1">

        <Input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

      </div>

      {/* =========================================
          Button
      ========================================== */}

      <div className="w-40">

        <Button
          text={loading ? "Thinking..." : "Send"}
          disabled={loading || !message.trim()}
          onClick={handleSend}
        />

      </div>

    </div>

  );

}