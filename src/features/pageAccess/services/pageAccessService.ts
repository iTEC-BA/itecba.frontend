// src/features/pageAccess/services/pageAccessService.ts
//
// Lee config/pageAccess con onSnapshot: gracias al persistentLocalCache
// configurado en src/lib/firebase.ts, la primera respuesta llega desde
// IndexedDB (instantánea, sin red) y luego Firestore sincroniza en segundo
// plano. No hay polling ni fetch repetido al backend para saber el estado
// de las páginas.
import { doc, onSnapshot, setDoc, deleteField, getDoc } from "firebase/firestore";
import { db } from "@lib/firebase";
import {
  DEFAULT_PAGE_ACCESS_STATE,
  type PageAccessMap,
  type PageAccessState,
} from "../types/pageAccess.types";

const CONFIG_DOC = doc(db, "config", "pageAccess");

export const subscribeToPageAccess = (
  onChange: (pages: PageAccessMap) => void,
  onError?: (err: unknown) => void
) => {
  return onSnapshot(
    CONFIG_DOC,
    { includeMetadataChanges: false },
    (snap) => {
      const data = snap.data();
      onChange((data?.pages as PageAccessMap) ?? {});
    },
    (err) => {
      console.error("❌ Error suscribiéndose a pageAccess:", err);
      onError?.(err);
    }
  );
};

export const pageAccessService = {
  // Crea/actualiza el estado de una página, mergeando campo a campo con el
  // estado actual (enabled/comingSoon/hidden/label) — así togglear un solo
  // campo (ej. "enabled") no borra los demás campos de esa misma página.
  // setDoc(..., { merge: true }) solo mergea a nivel de documento: el valor
  // que le pasamos para pages.<path> se escribe completo, por eso primero
  // leemos el estado actual de esa página puntual y lo combinamos acá.
  setPageState: async (path: string, patch: Partial<PageAccessState>): Promise<void> => {
    const snap = await getDoc(CONFIG_DOC);
    const currentPages = (snap.data()?.pages as PageAccessMap) ?? {};
    const currentState = currentPages[path] ?? DEFAULT_PAGE_ACCESS_STATE;

    const merged: PageAccessState = {
      ...currentState,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(CONFIG_DOC, { pages: { [path]: merged } }, { merge: true });
  },

  // Elimina la config custom de una página → vuelve al default (habilitada, visible).
  removePageState: async (path: string): Promise<void> => {
    await setDoc(CONFIG_DOC, { pages: { [path]: deleteField() } }, { merge: true });
  },
};
