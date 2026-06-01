// src/hooks/usePagination.ts
import { useState, useMemo, useCallback } from "react";

export const usePagination = <T>(items: T[], pageSize: number = 8) => {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  );

  // Mantener página válida cuando el total baja
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  );

  const reset = useCallback(() => setPage(1), []);

  return { paged, page: safePage, setPage, totalPages, reset };
};
