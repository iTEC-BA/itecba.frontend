import React, { useState, useRef, useEffect } from "react";
import { CARRERAS_LIST } from "@features/profile/data/carreras";
import { cn } from "@/lib/utils";
export interface CareerOption {
  code: string;
  name: string;
  colorClass?: string;
}
interface CareerSelectorProps {
  value: CareerOption[];
  onChange: (careers: CareerOption[]) => void;
  max?: number;
  disabled?: boolean;
}
export const CareerSelector: React.FC<CareerSelectorProps> = ({
  value, onChange, max = 2, disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const filtered = CARRERAS_LIST.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const toggle = (career: CareerOption) => {
    if (value.find((v) => v.code === career.code)) {
      onChange(value.filter((v) => v.code !== career.code));
    } else if (value.length < max) {
      onChange([...value, career]);
    }
  };
  const isSelected = (code: string) => value.some((v) => v.code === code);
  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "min-h-[40px] w-full bg-itec-surface border border-itec-border rounded-xl",
          "flex flex-wrap gap-1.5 p-2 cursor-pointer transition-all",
          "focus-within:border-itec-border",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {value.length === 0 && (
          <span className="text-itec-muted text-sm px-1 self-center">
            Seleccioná tu carrera...
          </span>
        )}
        {value.map((c) => (
          <span
            key={c.code}
            className={cn(
              "inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border border-itec-border",
              c.colorClass ?? "bg-itec-box2  text-itec-text"
            )}
          >
            {c.name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggle(c); }}
              className="text-current opacity-60 hover:opacity-100 ml-0.5"
            >
              ×
            </button>
          </span>
        ))}
        <span className="ml-auto self-center text-itec-muted text-xs pr-1">
          {open ? "▲" : "▼"}
        </span>
      </div>
      {open && (
        <div className={cn(
          "absolute z-50 top-full mt-1.5 w-full",
          "bg-itec-box border border-itec-border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
          "overflow-hidden max-h-56 flex flex-col"
        )}>
          <div className="p-2 border-b border-itec-border shrink-0">
            <input
              autoFocus
              type="text"
              placeholder="Buscar carrera..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-itec-surface border border-itec-border text-itec-text text-sm px-3 py-2 rounded-xl outline-none placeholder:text-itec-muted"
            />
          </div>
          <div className="overflow-y-auto custom-scrollbar">
            {filtered.map((c) => {
              const sel = isSelected(c.code);
              const atMax = value.length >= max && !sel;
              return (
                <button
                  key={c.code}
                  type="button"
                  disabled={atMax}
                  onClick={() => toggle(c)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all",
                    sel
                      ? "bg-itec-sky/10 text-itec-sky"
                      : "text-itec-text hover:bg-itec-surface",
                    atMax && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0",
                    sel ? "bg-itec-sky border-itec-border" : "border-itec-border"
                  )}>
                    {sel && "✓"}
                  </span>
                  <span className="font-bold">{c.name}</span>
                  <span className="ml-auto text-[10px] text-itec-muted">{c.code}</span>
                </button>
              );
            })}
          </div>
          <div className="p-2 border-t border-itec-border shrink-0">
            <p className="text-[10px] text-itec-muted text-center">
              {value.length}/{max} seleccionadas
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
