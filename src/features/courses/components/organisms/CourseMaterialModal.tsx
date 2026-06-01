import React from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { SearchResultItem } from "@components/molecules/SearchResultItem";
import type { ResourceData } from "@features/resources/services/resourcesService";

interface Props { isOpen: boolean; onClose: () => void; relatedResources: ResourceData[]; }

export const CourseMaterialModal: React.FC<Props> = ({ isOpen, onClose, relatedResources }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/75 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-itec-box border border-itec-border rounded-t-3xl sm:rounded-xl w-full sm:max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/8 shrink-0">
          <div>
            <h2 className="text-base font-bold text-itec-text">Material de apoyo</h2>
            <p className="text-xs text-itec-gray">Archivos y recursos de esta materia.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-itec-gray hover:text-itec-text transition-all">
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {relatedResources.length ? (
            <div className="space-y-2">
              {relatedResources.map((r) => (
                <SearchResultItem key={r.id || (r as any)._id} type="aporte" title={r.title} subtitle={`${r.tipo} · ${r.autor}`} link={r.link} isExternal />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-itec-gray">
              <span className="text-3xl mb-3 opacity-40">📂</span>
              <p className="text-xs font-bold uppercase tracking-widest">Sin archivos aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
