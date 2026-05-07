// src/features/profile/hooks/useMultiCareer.ts
// Gestión de multi-carrera con persistencia en Firestore via AuthContext
import { useMemo } from "react";
import { useAuth } from "@context/AuthContext";
import { CARRERAS_LIST } from "@features/profile/data/carreras";
import type { CareerOption } from "@features/profile/components/molecules/CareerSelector";

interface MultiCareerReturn {
  /** Carreras activas del usuario (max 2) */
  careers:        CareerOption[];
  /** Carrera principal (primera) */
  primaryCareer:  CareerOption | null;
  /** ¿El usuario cursa doble carrera? */
  isDoubleMajor:  boolean;
  /** Año de inicio (si existe) */
  startYear?:     number;
}

export const useMultiCareer = (): MultiCareerReturn => {
  const { user } = useAuth();

  const careers = useMemo<CareerOption[]>(() => {
    // Soporta campo "careers" (nuevo) o fallback a "specialty" (legado)
    if (Array.isArray((user as any)?.careers) && (user as any).careers.length > 0) {
      return (user as any).careers.map((c: { code: string; name: string }) => {
        const found = CARRERAS_LIST.find((l) => l.code === c.code);
        return found ?? { code: c.code, name: c.name };
      });
    }
    if (user?.specialty) {
      const found = CARRERAS_LIST.find((l) => l.name === user.specialty);
      return found ? [found] : [];
    }
    return [];
  }, [user]);

  return {
    careers,
    primaryCareer:  careers[0] ?? null,
    isDoubleMajor:  careers.length > 1,
    startYear:      (user as any)?.startYear,
  };
};
