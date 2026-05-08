import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<Props> = ({ 
  label, value, options, onChange, placeholder = "Seleccionar...", disabled = false 
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
    <div ref={containerRef} className={`relative flex flex-col transition-all duration-300 ${disabled ? 'grayscale' : ''}`}>
      <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 pl-1">{label}</label>
      <div onClick={() => !disabled && setIsOpen(!isOpen)}>
        <Input 
          fullWidth readOnly disabled={disabled}
          placeholder={placeholder} 
          value={selectedLabel} 
          className="cursor-pointer text-sm py-3.5 bg-slate-950/50 border-itec-border hover:border-emerald-500/50 focus:border-emerald-500 transition-all rounded-xl disabled:cursor-not-allowed select-none" 
        />
      </div>
      {isOpen && !disabled && (
        <ul className="absolute z-100 w-full top-full mt-2 bg-slate-800 border border-itec-border rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <li 
              key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} 
              className="cursor-pointer px-5 py-3 text-sm text-slate-300 hover:bg-emerald-600 hover:text-itec-textborder-b border-white/5 last:border-0 transition-colors"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};