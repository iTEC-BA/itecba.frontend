// src/features/pageAccess/components/PageGate.tsx
//
// Envolvé cualquier <Route element={...}/> con <PageGate path="/ruta">.
// - Si la página está deshabilitada → muestra la página de error 404 existente.
// - Si está en "comingSoon" → muestra ComingSoonPage.
// - Los admins siempre ven el contenido real (para poder probar/gestionar la
//   sección aunque esté desactivada para el resto).
// - Mientras el estado inicial de Firestore no llegó (loading), se renderiza
//   el contenido normalmente para no bloquear la primera carga (el caso común
//   es que la página esté habilitada).
import React from "react";
import { usePageAccessState, usePageAccess } from "../context/PageAccessContext";
import { useAuth } from "@context/AuthContext";
import { ComingSoonPage } from "./ComingSoonPage";
import { ErrorPage } from "@pages/ErrorPage"; // named export, no default

interface PageGateProps {
  path: string;
  children: React.ReactNode;
}

export const PageGate: React.FC<PageGateProps> = ({ path, children }) => {
  const { isAdmin } = useAuth();
  const { loading } = usePageAccess();
  const state = usePageAccessState(path);

  if (isAdmin) return <>{children}</>;
  if (loading) return <>{children}</>;

  if (!state.enabled) return <ErrorPage />;
  if (state.comingSoon) return <ComingSoonPage label={state.label} />;

  return <>{children}</>;
};
