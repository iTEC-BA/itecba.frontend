import React from 'react';

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => {
  return (
    <button 
      className={`text-itec-text hover:text-itec-text transition-colors p-1.5 rounded-md hover:bg-itec-gray cursor-pointer ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};