import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useBrokenVideos } from "../../hooks/useBrokenVideos";
import { BrokenVideoItem } from "../molecules/BrokenVideoItem";
import { PaginationBar }   from "@components/ui/PaginationBar";
import { usePagination }   from "@hooks/usePagination";
import { AlertOctagon, Check, RefreshCw, X } from "lucide-react";

const PAGE_SIZE = 5;

interface Props {
  isOpen:  boolean;
  onClose: () => void;
}

export const BrokenVideosModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    items,
    loading,
    statusMsg,
    fetchBroken,
    fixVideo,
    deleteVideo,
    clearReports,
  } = useBrokenVideos();

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (isOpen) fetchBroken();
  }, [isOpen, fetchBroken]);

  const { paged, page, setPage, totalPages } = usePagination(items, PAGE_SIZE);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 bg-black/80  flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-itec-box border border-white/[0.08] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[88vh] animate-in slide-in-from-bottom-full sm:fade-in sm:zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-itec-red/15 rounded-xl flex items-center justify-center">
              <AlertOctagon className="size-4 text-itec-red"/>
            </div>
            <div>
              <h2 className="text-base font-bold text-itec-text">
                Videos reportados
              </h2>
              <p className="text-[11px] text-itec-gray mt-0.5">
                {items.length > 0
                  ? `${items.length} video${items.length > 1 ? "s" : ""} con reportes`
                  : "Sin incidencias pendientes"}
              </p>
            </div>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-itec-red text-white text-[10px] font-bold rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchBroken}
              disabled={loading}
              variant="slate"
              hierarchy="ghost"
              className="w-8 h-8 p-0"
              title="Actualizar"
              icon={<RefreshCw className="w-4 h-4" />}
            />
            <Button
              onClick={onClose}
              variant="slate"
              hierarchy="ghost"
              className="w-8 h-8 p-0"
              icon={<X className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">

          {/* Mensaje de estado (éxito/error de acción) */}
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
                <Check className="size-4" />
              </div>
              <p className="text-sm font-bold text-itec-text">
                Sin videos reportados
              </p>
              <p className="text-xs text-itec-gray mt-1">
                Todo el contenido está en orden.
              </p>
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
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-5 pb-4 pt-2 border-t border-white/[0.06] shrink-0">
            <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};