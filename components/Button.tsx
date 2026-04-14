import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "pdf";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const sizeClass =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-lg"
      : "px-4 py-2";

  const baseStyle =
    "rounded-lg font-semibold transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105",
    pdf: "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:scale-105 border border-emerald-500/50",
  };

  return (
    <button
      className={`${baseStyle} ${sizeClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}