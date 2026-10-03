import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const menuRef = useRef<HTMLUListElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const updateMenuPosition = () => {
    const trigger = containerRef.current?.getBoundingClientRect();
    if (!trigger) return;
    setMenuPosition({
      top: trigger.bottom + 8,
      left: trigger.left,
      width: trigger.width,
    });
  };

  // Lógica interna e independiente de click-outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    const handleViewportChange = () => updateMenuPosition();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen]);

  const selectedLabel = options.find(o => o.value === value)?.label || '';
  return (
    <div ref={containerRef} className={cn("relative flex flex-col transition-all duration-300",disabled ? 'grayscale' : '')}>
      {label && <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 pl-1">{label}</label>}
      <div onClick={() => !disabled && setIsOpen(!isOpen)}>
        <Input 
          fullWidth readOnly disabled={disabled}
          placeholder={placeholder} 
          value={selectedLabel} 
          className={cn("cursor-pointer text-xs rounded-md disabled:cursor-not-allowed select-none border border-itec-border/50 hover:border-itec-description p-2", className)} 
        />
      </div>
      {isOpen && !disabled && createPortal(
        <ul
          ref={menuRef}
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            width: menuPosition.width,
          }}
          className="fixed z-[100] bg-itec-card border border-itec-border/50 rounded-md max-h-60 overflow-y-auto"
        >
          {options.map((opt) => (
            <li 
              key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} 
              className="cursor-pointer px-4 py-3 text-xs text-slate-300 hover:bg-itec-bg hover:text-itec-text border-b border-itec-border/50 last:border-0 transition-colors"
            >
              {opt.label}
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </div>
  );
};