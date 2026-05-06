import React from 'react';
import { Icons } from '../ui/icons/Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'admin' | 'inicio' | 'servicios' | 'nosotros' | 'proyectos' | 'contacto';
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
  const baseStyles = "px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer";
  const widthStyles = fullWidth ? "w-full" : "";
  
  const variants = {
    primary: "bg-itec-blue text-itec-text hover:bg-blue-800",
    secondary: "bg-itec-gray text-itec-text hover:bg-gray-600",
    admin: "text-itec-gray hover:bg-itec-red hover:text-itec-text",
    inicio: "bg-blue-600 text-white hover:bg-blue-700",
    servicios: "bg-emerald-600 text-white hover:bg-emerald-700",
    nosotros: "bg-violet-600 text-white hover:bg-violet-700",
    proyectos: "bg-amber-500 text-itec-text hover:bg-amber-600",
    contacto: "bg-rose-600 text-white hover:bg-rose-700"
  };

  return (
    <button className={`flex justify-center items-center ${baseStyles} ${variants[variant]} ${widthStyles} ${className}`} {...props}>
      {icon ? <Icons type={icon} className="size-3"/> : null}
      {text ? text : ''}
      {children ? children : ''}
    </button>
  );
};