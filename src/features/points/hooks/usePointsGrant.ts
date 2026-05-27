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
import { useAuth }     from "@context/AuthContext";
import { getAuth }     from "firebase/auth";
import { getActivityFromCache, grantPointsAPI, getActivities } from "../services/points.service";
import type { GrantResult } from "../points.types";

export const usePointsGrant = () => {
  const { isAuthenticated, addPoints } = useAuth();

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
      const activity = getActivityFromCache(activityKey);
      if (!activity) {
        // Intenta calentar la caché para la próxima vez
        warmCache();
        return { granted: false, reason: "not_in_cache" };
      }

      // ── 3. Optimistic update ───────────────────────────────────────────────
      addPoints(activity.points);

      // ── 4. Llamar al backend (necesitamos el token fresco) ─────────────────
      let token: string;
      try {
        const fbUser = getAuth().currentUser;
        if (!fbUser) throw new Error("no_user");
        token = await fbUser.getIdToken();
      } catch {
        // No pudimos obtener token → revertir
        addPoints(-activity.points);
        return { granted: false, reason: "not_authenticated" };
      }

      let result: GrantResult;
      try {
        result = await grantPointsAPI(activityKey, token, context);
      } catch {
        // Error de red → revertir
        addPoints(-activity.points);
        return { granted: false, reason: "internal_error" };
      }

      // ── 5. Si el backend rechazó → revertir ────────────────────────────────
      if (!result.granted) {
        addPoints(-activity.points);
      }

      return result;
    },
    [isAuthenticated, addPoints, warmCache],
  );

  return { grant };
};
