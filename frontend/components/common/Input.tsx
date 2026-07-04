// ======================================================
// Reusable Input Component
// ======================================================

type InputProps = {
  type: string;
  name?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
    />
  );
}