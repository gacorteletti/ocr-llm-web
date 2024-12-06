"use client";

interface ButtonProps {
  type?: "button" | "submit";
  onClick?: () => void; // optional click handler
  className?: string; // additional custom styles
  disabled?: boolean; // disabled property
  children: React.ReactNode;
}

export default function Button({
  type = "button",
  onClick,
  className = "",
  disabled = false,
  children,
}: ButtonProps) {
  const baseClass =
    "py-2 px-4 font-semibold rounded focus:outline-none focus:ring bg-blue-500 text-white hover:bg-blue-950";
  const disabledClass =
    "py-2 px-4 font-semibold rounded focus:outline-none focus:ring bg-blue-950 text-white cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${disabled ? disabledClass : baseClass} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
