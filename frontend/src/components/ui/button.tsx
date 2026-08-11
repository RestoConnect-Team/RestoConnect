import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "discreet";
  children: React.ReactNode;
}

export function Button({
  variant = "solid",
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    "cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  const variantClasses = {
    solid:
      "bg-[#cb006b] text-white hover:bg-[#a30056] active:bg-[#900050] text-[15px] font-semibold px-5 h-10",
    outline:
      "border-2 border-[#cb006b] text-[#cb006b] hover:bg-[#fce4f0] text-[15px] font-semibold px-5 h-10",
    discreet:
      "border-1 border-gray-200 text-gray-600 hover:text-[#cb006b] text-[13px] hover:border-[#cb006b] text-xs px-3 h-8",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
