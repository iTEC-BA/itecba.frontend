// src/features/pageAccess/context/PageAccessContext.tsx
//
// Provider único, montado una vez en App.tsx, que mantiene en memoria el mapa
// completo de estados de páginas (config/pageAccess) sincronizado en tiempo
// real vía Firestore onSnapshot. Todo componente que necesite saber si una
// página está activa/oculta/"próximamente" consume este contexto — no vuelve
// a pedir nada a Firestore ni al backend.
import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { subscribeToPageAccess } from "../services/pageAccessService";
import {
  DEFAULT_PAGE_ACCESS_STATE,
  type PageAccessMap,
  type PageAccessState,
} from "../types/pageAccess.types";

interface PageAccessContextType {
  pages: PageAccessMap;
  loading: boolean;
  getState: (path: string) => PageAccessState;
}

const PageAccessContext = createContext<PageAccessContextType | undefined>(undefined);

export const PageAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<PageAccessMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPageAccess(
      (updated) => {
        setPages(updated);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const getState = useMemo(
    () => (path: string): PageAccessState => pages[path] ?? DEFAULT_PAGE_ACCESS_STATE,
    [pages]
  );

  return (
    <PageAccessContext.Provider value={{ pages, loading, getState }}>
      {children}
    </PageAccessContext.Provider>
  );
};

export const usePageAccess = () => {
  const ctx = useContext(PageAccessContext);
  if (ctx === undefined) throw new Error("usePageAccess debe usarse dentro de PageAccessProvider");
  return ctx;
};

// Atajo para un único path: re-renderiza solo cuando cambia ESA página.
export const usePageAccessState = (path: string): PageAccessState => {
  const { getState } = usePageAccess();
  return getState(path);
};
