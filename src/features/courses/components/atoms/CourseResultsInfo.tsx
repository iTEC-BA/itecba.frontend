// src/features/courses/components/atoms/CourseResultsInfo.tsx
// Muestra "N cursos encontrados" con info de página actual.
import React from "react";

interface Props {
  total:       number;
  page:        number;
  totalPages:  number;
  pageSize:    number;
}

export const CourseResultsInfo: React.FC<Props> = ({ total, page, totalPages, pageSize }) => {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  return (
    <p className="text-xs text-itec-gray/60 mb-3">
      Mostrando <span className="text-itec-text font-semibold">{from}–{to}</span> de{" "}
      <span className="text-itec-text font-semibold">{total}</span>{" "}
      {total === 1 ? "curso" : "cursos"}
      {totalPages > 1 && (
        <> · página <span className="text-itec-text font-semibold">{page}</span> de {totalPages}</>
      )}
    </p>
  );
};
