import React from "react";
import { usePageAccessState, usePageAccess } from "../context/PageAccessContext";
import { useAuthStore } from '@/stores/authStore';
import { ComingSoonPage } from "./ComingSoonPage";
import { DisabledPage } from "./DisabledPage";

interface PageGateProps {
  path: string;
  children: React.ReactNode;
}

export const PageGate: React.FC<PageGateProps> = ({ path, children }) => {
  const { isAdmin } = useAuthStore();
  const { loading } = usePageAccess();
  const state = usePageAccessState(path);

  // El admin tiene paso libre, la pantalla de carga no interrumpe el montaje
  if (isAdmin) return <>{children}</>;
  if (loading) return <>{children}</>;

  if (!state.enabled) return <DisabledPage label={state.label} />;
  if (state.comingSoon) return <ComingSoonPage label={state.label} />;

  return <>{children}</>;
};
