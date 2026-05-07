// src/features/admin/hooks/useAdminSidebar.ts
import { useState, useCallback } from "react";

export type AdminSection =
  | "dashboard"
  | "users"
  | "news"
  | "benefits"
  | "rewards"
  | "redemptions"
  | "materias"
  | "tutorias";

export interface SidebarLink {
  id:     AdminSection;
  label:  string;
  emoji:  string;
  badge?: number;
  description?: string;
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  { id: "dashboard",   label: "Dashboard",       emoji: "🏠", description: "Resumen general" },
  { id: "users",       label: "Usuarios",         emoji: "👥", description: "Roles y privilegios" },
  { id: "news",        label: "Avisos",           emoji: "📢", description: "Comunicados globales" },
  { id: "benefits",    label: "Beneficios",       emoji: "🏷️", description: "Descuentos TarjeTEC" },
  { id: "rewards",     label: "Recompensas",      emoji: "🎁", description: "Sistema de puntos" },
  { id: "redemptions", label: "Canjes",           emoji: "🧾", description: "Historial de canjes" },
  { id: "materias",    label: "Académico",        emoji: "📚", description: "Materias y carreras" },
  { id: "tutorias",    label: "Tutorías",         emoji: "🎓", description: "Sesiones personalizadas" },
];

interface UseAdminSidebarReturn {
  active:     AdminSection;
  navigate:   (s: AdminSection) => void;
  mobileOpen: boolean;
  openMobile:  () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

export const useAdminSidebar = (): UseAdminSidebarReturn => {
  const [active,     setActive]     = useState<AdminSection>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate     = useCallback((s: AdminSection) => {
    setActive(s);
    setMobileOpen(false); // Auto-cierra en mobile
  }, []);
  const openMobile   = useCallback(() => setMobileOpen(true),  []);
  const closeMobile  = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);

  return { active, navigate, mobileOpen, openMobile, closeMobile, toggleMobile };
};
