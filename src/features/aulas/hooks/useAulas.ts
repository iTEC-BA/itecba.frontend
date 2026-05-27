// src/features/aulas/hooks/useAulas.ts
// Gestiona la lista de aulas con caché en localStorage.
// - Primera visita: descarga del backend y guarda en caché con versión+timestamp.
// - Visitas siguientes: sirve desde caché (sin llamadas al servidor).
// - Tras operación de escritura del admin: invalidateAulasCache() limpia el caché.
// - TTL de seguridad: 24 horas.

import { useState, useEffect, useCallback } from "react";
import { aulasService } from "../services/aulas.service";
import type { AulaResumen, AulasFilters, SedeAula, FuncionAula } from "../types/aulas.types";

const CACHE_KEY = "itecba:aulas:v2";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

interface CacheEntry {
  aulas:   AulaResumen[];
  version: string;
  ts:      number;
}

const readCache = (): CacheEntry | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.ts > CACHE_TTL) return null;
    return entry;
  } catch {
    return null;
  }
};

const writeCache = (aulas: AulaResumen[], version: string): void => {
  try {
    const entry: CacheEntry = { aulas, version, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch { /* quota exceeded → ignorar */ }
};

export const invalidateAulasCache = (): void => {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* noop */ }
};

interface UseAulasResult {
  aulas:      AulaResumen[];
  filtered:   AulaResumen[];
  loading:    boolean;
  error:      string | null;
  filters:    AulasFilters;
  setFilters: (f: AulasFilters) => void;
  reload:     () => void;
}

export const useAulas = (): UseAulasResult => {
  const cached = readCache();
  const [aulas,   setAulas]   = useState<AulaResumen[]>(cached?.aulas ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error,   setError]   = useState<string | null>(null);
  const [filters, setFilters] = useState<AulasFilters>({});

  const fetchAulas = useCallback(async (force = false) => {
    if (!force) {
      const hit = readCache();
      if (hit) { setAulas(hit.aulas); setLoading(false); return; }
    }
    setLoading(true);
    setError(null);
    try {
      const { aulas: data, version } = await aulasService.getList();
      setAulas(data);
      writeCache(data, version);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar aulas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAulas(); }, [fetchAulas]);

  // Filtrado en cliente — sin llamadas adicionales al servidor
  const filtered = aulas.filter((a) => {
    if (filters.sede    && a.sede    !== filters.sede)    return false;
    if (filters.funcion && a.funcion !== filters.funcion) return false;
    if (filters.texto) {
      const q = filters.texto.toLowerCase();
      const match =
        a.numero.toLowerCase().includes(q) ||
        (a.carrera    ?? "").toLowerCase().includes(q) ||
        (a.descripcion ?? "").toLowerCase().includes(q) ||
        a.funcion.toLowerCase().includes(q) ||
        a.sede.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const applyFilters = useCallback((f: AulasFilters) => {
    setFilters((_prev) => ({ ..._prev, ...f }));
  }, []);

  return {
    aulas,
    filtered,
    loading,
    error,
    filters,
    setFilters: applyFilters,
    reload: () => fetchAulas(true),
  };
};
