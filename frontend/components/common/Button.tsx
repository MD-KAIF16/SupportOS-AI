// ======================================================
// Reusable Button Component
// ======================================================

type ButtonProps = {
  text: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  text,
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {text}
    </button>
  );
}