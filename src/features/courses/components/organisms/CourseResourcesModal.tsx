import React from "react";
import { Icons } from "@/components/ui/icons/Icons";

interface Resource { id: string; title: string; materia: string; driveUrl: string; }
interface Props { isOpen: boolean; onClose: () => void; resources: Resource[]; }

export const CourseResourcesModal: React.FC<Props> = ({ isOpen, onClose, resources }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/75 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-itec-box border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-itec-blue/20 border border-itec-blue-skye/25 text-itec-blue-skye flex items-center justify-center text-base">📚</div>
            <div>
              <h2 className="text-sm font-black text-itec-text">Archivos de la clase</h2>
              <p className="text-[10px] text-itec-gray uppercase tracking-widest">{resources.length} recurso{resources.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-itec-gray hover:text-itec-text transition-all">
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {resources.length ? (
            <div className="space-y-2">
              {resources.map((r) => (
                <a key={r.id} href={r.driveUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 hover:border-itec-blue-skye/30 rounded-xl transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-itec-red/10 border border-itec-red/20 text-itec-red flex items-center justify-center shrink-0 text-base">📄</div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-itec-text truncate group-hover:text-itec-blue-skye transition-colors">{r.title}</p>
                    <p className="text-[10px] text-itec-gray truncate mt-0.5">{r.materia}</p>
                  </div>
                  <div className="w-4 h-4 text-itec-gray group-hover:text-itec-blue-skye transition-colors shrink-0">
                    <Icons type="external-link" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-itec-gray">
              <span className="text-3xl mb-3 opacity-40">📭</span>
              <p className="text-xs font-bold uppercase tracking-widest">Sin archivos vinculados</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/8 shrink-0">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-itec-blue-skye text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98]">
            Volver al curso
          </button>
        </div>
      </div>
    </div>
  );
};
