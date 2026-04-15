import React, { useState, Suspense, useMemo } from 'react';
import { Icons } from '@/components/atoms/Icons';

const AddDateModal = React.lazy(() => import('./AddDateModal').then(m => ({ default: m.AddDateModal })));

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  description: string;
  expiryDate?: string; // 🟢 FECHA DE CADUCIDAD REAL ISO
}

interface Props {
  isAdmin: boolean;
}

export const ImportantDatesWidget: React.FC<Props> = ({ isAdmin }) => {
  // Ejemplos (Asegúrate de que expiryDate tenga un formato válido ISO)
  const [dates, setDates] = useState<ImportantDate[]>([
    { id: '1', title: 'Inscripción a Cursada', date: '15 al 20 de Marzo', description: 'A través del sistema SIGA.', expiryDate: '2026-03-21T00:00:00' },
    { id: '2', title: 'Inicio 1er Cuatrimestre', date: '25 de Marzo', description: 'Comienzo oficial de clases.', expiryDate: '2026-03-26T00:00:00' },
    { id: '3', title: 'Exámenes Finales', date: '10 de Julio', description: 'Turno de julio. Anotarse 48hs antes.', expiryDate: '2026-07-15T00:00:00' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🟢 MAGIA AQUÍ: Filtramos las fechas para que no se muestren si expiryDate es menor a "Ahora mismo"
  const activeDates = useMemo(() => {
    const now = new Date().getTime(); // Hora exacta actual
    return dates.filter(item => {
      if (!item.expiryDate) return true; // Si no le configuras expiración, no lo borra
      const expirationTime = new Date(item.expiryDate).getTime();
      return expirationTime > now;
    });
  }, [dates]);

  return (
    <section className="bg-itec-surface border border-itec-gray rounded-3xl p-6 shadow-2xl h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center text-sm">📅</span> 
          Calendario
        </h2>
        {isAdmin && (
           <button onClick={() => setIsModalOpen(true)} className="py-1 px-2 flex items-center justify-center rounded-full bg-itec-bg border border-itec-gray text-gray-400 hover:text-white hover:border-orange-500 transition-colors cursor-pointer" title="Agregar Fecha">
             <Icons type="plus" className="w-4 h-4" />
             <span className='text-sm'>Agregar Fechas</span>
           </button>
        )}
      </div>

      {activeDates.length > 0 ? (
        <div className="relative border-l border-itec-gray/50 ml-3 space-y-8 pb-4">
          {activeDates.map((item, index) => (
            <div key={item.id} className="relative pl-6 group">
              <span className={`absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-itec-surface transition-colors ${index === 0 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'bg-gray-500 group-hover:bg-orange-400'}`}></span>
              <div>
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-1">{item.date}</p>
                <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{item.title}</h3>
                <p className="text-[12px] text-gray-400 leading-relaxed bg-itec-bg/50 p-2.5 rounded-lg border border-itec-gray/30">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-itec-bg border border-itec-gray border-dashed rounded-xl">
          <p className="text-gray-500 text-sm">No hay fechas próximas vigentes.</p>
        </div>
      )}

      {isAdmin && isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60" />}>
          <AddDateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={(newDate) => setDates(prev => [...prev, newDate])} />
        </Suspense>
      )}
    </section>
  );
};