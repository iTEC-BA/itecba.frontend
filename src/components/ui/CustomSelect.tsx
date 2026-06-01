import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CustomSelect: React.FC<Props> = ({ 
  label, value, options, onChange, placeholder = "Seleccionar...", disabled = false ,className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lógica interna e independiente de click-outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || '';
  return (
    <div ref={containerRef} className={cn("relative flex flex-col transition-all duration-300",disabled ? 'grayscale' : '')}>
      {label && <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 pl-1">{label}</label>}
      <div onClick={() => !disabled && setIsOpen(!isOpen)}>
        <Input 
          fullWidth readOnly disabled={disabled}
          placeholder={placeholder} 
          value={selectedLabel} 
          className={cn("cursor-pointer text-xs rounded-md disabled:cursor-not-allowed select-none border border-itec-border hover:border-itec-description p-2", className)} 
        />
      </div>
      {isOpen && !disabled && (
        <ul className="absolute z-100 w-full top-full mt-2 bg-itec-card border border-itec-border rounded-md max-h-60 overflow-y-scroll">
          {options.map((opt) => (
            <li 
              key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} 
              className="cursor-pointer px-4 py-3 text-xs text-slate-300 hover:bg-itec-bg hover:text-itec-text border-b border-white/5 last:border-0 transition-colors"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};