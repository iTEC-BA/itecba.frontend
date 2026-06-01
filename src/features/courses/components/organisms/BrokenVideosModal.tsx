// src/features/courses/components/organisms/BrokenVideosModal.tsx
// Modal de videos reportados. Solo para admins. Usa LayoutModal global.
import React, { useEffect } from "react";
import { LayoutModal }      from "@/components/templates/LayoutModal";
import { Button }           from "@/components/ui/Button";
import { PaginationBar }    from "@/components/ui/PaginationBar";
import { usePagination }    from "@/hooks/usePagination";
import { useBrokenVideos }  from "../../hooks/useBrokenVideos";
import { BrokenVideoItem }  from "../molecules/BrokenVideoItem";
import { RefreshCw, Check } from "lucide-react";

const PAGE_SIZE = 5;

interface Props { isOpen: boolean; onClose: () => void; }

export const BrokenVideosModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { items, loading, statusMsg, fetchBroken, fixVideo, deleteVideo, clearReports } =
    useBrokenVideos();

  useEffect(() => { if (isOpen) fetchBroken(); }, [isOpen, fetchBroken]);

  const { paged, page, setPage, totalPages } = usePagination(items, PAGE_SIZE);

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title="Videos reportados"
      description={items.length > 0 ? `${items.length} video${items.length > 1 ? "s" : ""} con reportes` : "Sin incidencias pendientes"}
      maxWidth="max-w-2xl"
    >
      <div className="p-5 space-y-3">
        {/* Acciones header */}
        <div className="flex items-center justify-between">
          {items.length > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
              {items.length}
            </span>
          )}
          <Button
            onClick={fetchBroken}
            disabled={loading}
            variant="slate"
            hierarchy="ghost"
            className="ml-auto w-8 h-8 p-0"
            icon={<RefreshCw className="size-4" />}
          />
        </div>

        {statusMsg && (
          <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
            {statusMsg}
          </p>
        )}

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-itec-gray/30 border-t-itec-blue-skye rounded-full animate-spin" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-3">
              <Check className="size-4 text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-itec-text">Sin videos reportados</p>
            <p className="text-xs text-itec-gray mt-1">Todo el contenido está en orden.</p>
          </div>
        )}

        {!loading && paged.map((item) => (
          <BrokenVideoItem
            key={`${item.courseId}-${item.video._id}`}
            item={item}
            onFix={fixVideo}
            onDelete={deleteVideo}
            onClearReports={clearReports}
          />
        ))}

        {totalPages > 1 && (
          <div className="pt-2 border-t border-white/6">
            <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </LayoutModal>
  );
};
