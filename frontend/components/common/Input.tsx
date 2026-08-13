import React from "react";

type InputProps = {
  type: string;
  name?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  className?: string;
};

export default function Input({
  type,
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
  icon,
  className = "",
}: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`w-full rounded-xl glass-input px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 transition duration-200 ${
          icon ? "pl-11" : ""
        } ${className}`}
      />
    </div>
  );
}