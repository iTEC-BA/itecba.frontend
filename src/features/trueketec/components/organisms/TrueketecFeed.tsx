// src/features/trueketec/components/organisms/TrueketecFeed.tsx
import React from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { TrueketecCard } from "../molecules/TrueketecCard";
import type { TrueketecPost } from "../../types/trueketec.types";

interface Props {
  posts:       TrueketecPost[];
  total:       number;
  totalPages:  number;
  currentPage: number;
  loading:     boolean;
  onContact?:  (post: TrueketecPost) => void;
  onPage:      (page: number) => void;
}

export const TrueketecFeed: React.FC<Props> = ({
  posts, total, totalPages, currentPage,
  loading, onContact, onPage,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 rounded-xl border border-itec-border bg-itec-box animate-pulse" />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-itec-muted">
        <Inbox size={40} className="opacity-30" />
        <p className="text-sm font-medium">No hay solicitudes activas con esos filtros.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-itec-muted">
        {total} solicitud{total !== 1 ? "es" : ""} activa{total !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {posts.map((post) => (
          <TrueketecCard
            key={post._id}
            post={post}
            onContact={onContact}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => onPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 rounded-xl border border-itec-border px-3 py-2 text-sm text-itec-muted transition-colors hover:bg-itec-surface disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          <span className="text-xs text-itec-muted px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 rounded-xl border border-itec-border px-3 py-2 text-sm text-itec-muted transition-colors hover:bg-itec-surface disabled:opacity-30"
          >
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
