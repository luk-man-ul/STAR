import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center rounded-full font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantStyle = variant === 'primary' 
    ? 'bg-rose-600 text-white hover:bg-rose-700' 
    : 'border border-stone-300 text-stone-700 hover:bg-stone-50';
  
  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    />
  );
}
