// src/features/aulas/hooks/useAulaDetalle.ts
import { useState, useEffect } from "react";
import { aulasService } from "../services/aulas.service";
import type { Aula } from "../types/aulas.types";

interface UseAulaDetalleResult {
  aula:    Aula | null;
  loading: boolean;
  error:   string | null;
  reload:  () => void;
}

export const useAulaDetalle = (slug: string): UseAulaDetalleResult => {
  const [aula,    setAula]    = useState<Aula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [tick,    setTick]    = useState(0);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    aulasService
      .getBySlug(slug)
      .then(({ aula: data }) => setAula(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar el aula"))
      .finally(() => setLoading(false));
  }, [slug, tick]);

  return { aula, loading, error, reload: () => setTick((t) => t + 1) };
};
