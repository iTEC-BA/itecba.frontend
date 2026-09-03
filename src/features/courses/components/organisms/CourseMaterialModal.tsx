import React from "react";
import { LayoutModal } from "@/components/templates/LayoutModal";
import { SearchResultItem } from "@components/molecules/SearchResultItem";
import type { ResourceData } from "@features/resources/services/resourcesService";

interface Props { isOpen: boolean; onClose: () => void; relatedResources: ResourceData[]; }

export const CourseMaterialModal: React.FC<Props> = ({ isOpen, onClose, relatedResources }) => {
  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Material de apoyo" description="Archivos y recursos de esta materia." maxWidth="max-w-lg">
      <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {relatedResources.length ? (
          <div className="space-y-2">
            {relatedResources.map((r) => (
              <SearchResultItem key={r.id || (r as any)._id} type="aporte" title={r.title} subtitle={`${r.tipo} · ${r.autor}`} link={r.link} isExternal />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 border border-dashed border-itec-border rounded-xl text-itec-gray">
            <span className="text-3xl mb-3 opacity-40">📂</span>
            <p className="text-xs font-bold uppercase tracking-widest">Sin archivos aún</p>
          </div>
        )}
      </div>
    </LayoutModal>
  );
};
