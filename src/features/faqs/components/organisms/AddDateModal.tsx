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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm transition-all">
      <div className="w-full sm:max-w-sm rounded-t-[2rem] sm:rounded-3xl border border-white/10 bg-[#0f1115] p-6 shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300">
        
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/10 sm:hidden" />
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-white">Nueva Fecha</h2>
          <button onClick={onClose} className="rounded-full bg-white/5 p-2 text-slate-400 hover:text-white active:scale-95"><Icons type="close" className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Título</label>
            <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Fecha</label>
            <input required value={date} onChange={e=>setDate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-white text-black py-3 text-sm font-bold active:scale-[0.98] transition-transform mt-2">Guardar</button>
        </form>
      </div>
    </div>
  );
};
