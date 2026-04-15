import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/atoms/Input';

interface Props {
  label: string;
  value: string;
  suggestions: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const AutocompleteInput: React.FC<Props> = ({ 
  label, value, suggestions, onChange, placeholder = "Escribir...", disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = (suggestions || []).filter(s => 
    normalizeString(s).includes(normalizeString(value))
  );

  return (
    <div ref={containerRef} className={`relative flex flex-col transition-all duration-300 ${disabled ? 'opacity-40 grayscale' : ''}`}>
      <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 pl-1">{label}</label>
      <Input 
        fullWidth disabled={disabled}
        placeholder={placeholder} 
        value={value} 
        onChange={e => { onChange(e.target.value); setIsOpen(true); }} 
        onFocus={() => setIsOpen(true)} 
        className="cursor-text text-sm py-3.5 bg-slate-950/50 border-white/10 hover:border-emerald-500/50 focus:border-emerald-500 transition-all rounded-xl disabled:cursor-not-allowed" 
      />
      {isOpen && filteredSuggestions.length > 0 && !disabled && (
        <ul className="absolute z-50 w-full top-full mt-2 bg-slate-800 border border-white/10 rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {filteredSuggestions.map((s, idx) => (
            <li 
              key={idx} onClick={() => { onChange(s); setIsOpen(false); }} 
              className="cursor-pointer px-5 py-3 text-sm text-slate-300 hover:bg-emerald-600 hover:text-white border-b border-white/5 last:border-0 transition-colors"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};