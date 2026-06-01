// design_tokens_fixed
import React, { useState } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import type { ImportantDate } from "./ImportantDatesWidget";

interface Props { isOpen: boolean; onClose: () => void; onAdd: (d: ImportantDate) => void; }

export const AddDateModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(title && date) { onAdd({ id: Date.now().toString(), title, date, description: "" }); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4  transition-all">
      <div className="w-full sm:max-w-sm rounded-t-[2rem] sm:rounded-xl border border-itec-border bg-itec-box p-6 shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300">
        
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-itec-border sm:hidden" />
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-white">Nueva Fecha</h2>
          <button onClick={onClose} className="rounded-full bg-itec-surface p-2 text-itec-muted hover:text-white active:scale-95"><Icons type="close" className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-itec-muted mb-2 block">Título</label>
            <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-xl border border-itec-border bg-itec-surface px-4 py-3 text-sm text-white outline-none focus:border-itec-sky/50 text-itec-text" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-itec-muted mb-2 block">Fecha</label>
            <input required value={date} onChange={e=>setDate(e.target.value)} className="w-full rounded-xl border border-itec-border bg-itec-surface px-4 py-3 text-sm text-white outline-none focus:border-itec-sky/50 text-itec-text" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-itec-blue hover:bg-blue-600 text-white py-3 text-sm font-bold active:scale-[0.98] transition-all mt-2">Guardar</button>
        </form>
      </div>
    </div>
  );
};
