import React, { useState, useMemo } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { AddDateModal } from "./AddDateModal";

export interface ImportantDate { id: string; title: string; date: string; description: string; expiryDate?: string; }
interface Props { isAdmin: boolean; }

export const ImportantDatesWidget: React.FC<Props> = ({ isAdmin }) => {
  const [dates, setDates] = useState<ImportantDate[]>([
    { id: "1", title: "Inscripción a Cursada", date: "15 al 20 de Marzo", description: "Sistema SIGA.", expiryDate: "2026-03-21T00:00:00" },
    { id: "2", title: "Inicio 1er Cuatrimestre", date: "25 de Marzo", description: "Comienzo de clases.", expiryDate: "2026-03-26T00:00:00" }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeDates = useMemo(() => dates.filter(item => !item.expiryDate || new Date(item.expiryDate).getTime() > Date.now()), [dates]);

  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f1115] p-6 shadow-2xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-[60px]" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Académico</p>
          <h2 className="text-lg font-bold tracking-tight text-white">Fechas Clave</h2>
        </div>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="rounded-full bg-white/5 p-2 text-slate-400 transition-all hover:bg-white/10 hover:text-white active:scale-95">
            <Icons type="plus" className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {activeDates.length > 0 ? (
          <div className="space-y-6 border-l border-white/10 ml-2 pl-5 pb-4">
            {activeDates.map((item) => (
              <div key={item.id} className="relative group">
                <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-slate-600 ring-4 ring-[#0f1115] transition-all group-hover:bg-indigo-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/80">{item.date}</p>
                <h3 className="text-[14px] font-semibold text-slate-200 mt-1">{item.title}</h3>
                {item.description && <p className="mt-1.5 text-[12px] text-slate-400">{item.description}</p>}
              </div>
            ))}
          </div>
        ) : (
           <p className="text-sm text-slate-500 text-center mt-10">No hay fechas vigentes.</p>
        )}
      </div>

      {isAdmin && <AddDateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={(d) => setDates(p => [...p, d])} />}
    </section>
  );
};
