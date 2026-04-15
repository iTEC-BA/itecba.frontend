import React from 'react';
import { Icons } from '@/components/atoms/Icons';

interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SearchInput: React.FC<Props> = ({ value, onChange, disabled, placeholder }) => (
  <div className="flex-1 relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
      <Icons type="search" className="w-5 h-5" />
    </div>
    <input
      type="text"
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-950/50 border border-white/5 text-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 placeholder:text-slate-600 shadow-inner disabled:opacity-50 hover:bg-slate-900/60"
    />
  </div>
);