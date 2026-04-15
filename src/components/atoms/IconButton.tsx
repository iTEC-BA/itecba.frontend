import React from 'react';

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => {
  return (
    <button 
      className={`text-gray-400 hover:text-itec-text transition-colors p-1.5 rounded-md hover:bg-itec-gray cursor-pointer ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};