// ======================================================
// Reusable Input Component
// ======================================================

type InputProps = {
  type: string;
  name?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function Input({
  type,
  name,
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        py-3
        text-slate-800
        placeholder:text-slate-400
        caret-blue-600
        outline-none
        transition
        focus:border-blue-600
        focus:ring-4
        focus:ring-blue-100
      "
    />
  );
}