import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({ options, fullWidth, className = '', ...props }) => {
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <select
      className={`bg-[#0a0a0a] border border-[#262626] text-itec-text px-4 py-2 rounded-lg focus:outline-none focus:border-itec-blue transition-colors appearance-none cursor-pointer ${widthClass} ${className}`}
      {...props}
    >
      <option value="">Elegir...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};