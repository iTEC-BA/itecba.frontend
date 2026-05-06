import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({ fullWidth, className = '', ...props }) => {
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <input
      className={`bg-[#0a0a0a] border border-[#262626] text-itec-text px-4 py-2 rounded-lg focus:outline-none focus:border-itec-blue transition-colors ${widthClass} ${className}`}
      {...props}
    />
  );
};