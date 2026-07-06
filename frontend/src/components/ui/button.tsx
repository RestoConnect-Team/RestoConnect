import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
}

export function Button({
  variant = 'solid',
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-5 h-11 rounded-lg text-[15px] font-semibold transition-colors flex-1 disabled:opacity-40 disabled:cursor-not-allowed';

  const variantClasses = {
    solid:
      'bg-[#cb006b] text-white hover:bg-[#a30056] active:bg-[#900050]',
    outline:
      'border-2 border-[#cb006b] text-[#cb006b] hover:bg-[#fce4f0]',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}