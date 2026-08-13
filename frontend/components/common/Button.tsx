import React from "react";

type ButtonProps = {
  text: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

export default function Button({
  text,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  icon,
  className = "",
}: ButtonProps) {
  let baseStyles = "w-full flex items-center justify-center gap-2 rounded-xl py-3 px-5 font-medium text-sm transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer";
  
  let variantStyles = "";
  if (variant === "primary") {
    variantStyles = "purple-glow-btn text-white font-semibold";
  } else if (variant === "secondary") {
    variantStyles = "bg-white/[0.06] hover:bg-white/[0.12] text-gray-200 border border-white/10 hover:border-purple-500/30";
  } else if (variant === "ghost") {
    variantStyles = "bg-transparent hover:bg-white/[0.06] text-gray-400 hover:text-white";
  } else if (variant === "danger") {
    variantStyles = "bg-rose-600/80 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/20";
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{text}</span>
    </button>
  );
}