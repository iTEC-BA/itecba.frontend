import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer";
  const widthStyles = fullWidth ? "w-full" : "";
  
  const variants = {
    primary: "bg-itec-blue text-itec-text hover:bg-blue-800",
    secondary: "bg-itec-gray text-itec-text hover:bg-gray-600",
    danger: "bg-itec-red text-white hover:bg-red-700"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};