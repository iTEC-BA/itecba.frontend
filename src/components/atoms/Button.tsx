import React from 'react';
import { Icons } from '../ui/Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'admin';
  fullWidth?: boolean;
  icon?: string;
  text: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  icon,
  text,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer";
  const widthStyles = fullWidth ? "w-full" : "";
  
  const variants = {
    primary: "bg-itec-blue text-itec-text hover:bg-blue-800",
    secondary: "bg-itec-gray text-itec-text hover:bg-gray-600",
    admin: "text-itec-gray hover:bg-itec-red hover:text-itec-text"
  };

  return (
    <button className={`flex justify-center items-center ${baseStyles} ${variants[variant]} ${widthStyles} ${className}`} {...props}>
      {icon ? <Icons type={icon} className="size-3"/> : null}
      {text ? text : ''}
      {children ? children : ''}
    </button>
  );
};