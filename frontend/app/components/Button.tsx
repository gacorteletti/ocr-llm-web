"use client";

import Link from "next/link";

interface ButtonProps {
  type?: "button" | "submit";
  onClick?: () => void; // optional click handler
  className?: string; // additional custom styles
  children: React.ReactNode;
}

export default function Button({
  type = "button",
  onClick,
  className = "",
  children,
}: ButtonProps) {
  const baseClasses =
    "py-2 px-4 font-semibold rounded focus:outline-none focus:ring bg-blue-500 text-white hover:bg-blue-950";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
}
