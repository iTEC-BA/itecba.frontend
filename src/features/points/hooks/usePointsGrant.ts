import { usePointsStore } from '@/stores/pointsStore';
// src/features/points/hooks/usePointsGrant.ts
//
// Hook central de gamificación. Cualquier componente lo importa y llama a:
//   const { grant } = usePointsGrant();
//   grant("forum_post");
//
// Flujo:
//  1. Verifica autenticación.
//  2. Lee el valor de puntos desde la caché local (sin red).
//  3. Actualiza la UI inmediatamente (optimistic update).
//  4. En paralelo, envía el request al backend.
//  5. Si el backend rechaza → revierte el update optimista.

import { useCallback } from "react";
import { useAuthStore } from '@/stores/authStore';
import { getActivityFromCache, grantPointsAPI, getActivities } from "../services/points.service";
import type { GrantResult } from "../points.types";

export const usePointsGrant = () => {
  const { isAuthenticated } = useAuthStore();
  const { addPoints } = usePointsStore();;

  // Pre-calentamos la caché en segundo plano si está vacía
  // (sin bloquear — fire & forget)
  const warmCache = useCallback(() => {
    getActivities().catch(() => {});
  }, []);

  const grant = useCallback(
    async (
      activityKey: string,
      context: Record<string, unknown> = {},
    ): Promise<GrantResult> => {
      // ── 1. Verificar autenticación ─────────────────────────────────────────
      if (!isAuthenticated) {
        return { granted: false, reason: "not_authenticated" };
      }

      // ── 2. Leer valor desde la caché ───────────────────────────────────────
      let activity = getActivityFromCache(activityKey);
      if (!activity) {
        try {
          const activities = await getActivities();
          activity = activities.find((item) => item.key === activityKey) ?? null;
        } catch {
          warmCache();
        }
        if (!activity) return { granted: false, reason: "not_in_cache" };
      }

      // El backend valida cooldown y tope diario; actualizar después evita
      // mostrar puntos que luego fueron rechazados.
      let result: GrantResult;
      try {
        result = await grantPointsAPI(activityKey, context);
      } catch {
        return { granted: false, reason: "internal_error" };
      }

      if (result.granted && result.points) await addPoints(result.points);

      return result;
    },
    [isAuthenticated, addPoints, warmCache],
  );

  return { grant };
};
