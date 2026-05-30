import { useState, useMemo } from "react";

export const usePagination = <T>(items: T[], pageSize: number = 8) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paged = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  const reset = () => setPage(1);

  return { paged, page, setPage, totalPages, reset };
};
