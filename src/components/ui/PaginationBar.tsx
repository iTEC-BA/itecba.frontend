import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page:       number;
  totalPages: number;
  onChange:   (p: number) => void;
}

export const PaginationBar: React.FC<Props> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-3">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/8 text-itec-text/50 hover:text-itec-text hover:border-white/16 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="size-4" />
      </button>

      <span className="text-xs text-itec-text/50">
        <span className="text-itec-text font-bold">{page}</span>
        {" / "}
        {totalPages}
      </span>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/8 text-itec-text/50 hover:text-itec-text hover:border-white/16 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
};
