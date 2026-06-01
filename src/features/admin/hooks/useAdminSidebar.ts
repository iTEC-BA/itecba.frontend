// src/features/admin/hooks/useAdminSidebar.ts
import { useState, useCallback } from "react";

export type AdminSection =
  | "dashboard"
  | "users"
  | "news"
  | "benefits"
  | "rewards"
  | "redemptions"
  | "tutorias";

export interface SidebarLink {
  id: AdminSection;
  label: string;
  icon: string;
}

// "Académico" y "Videos Rotos" se eliminaron del panel de admin:
// ahora viven como modales dentro de CoursesPage y GroupsPage.
export const SIDEBAR_LINKS: SidebarLink[] = [
  { id: "dashboard",   label: "Dashboard",    icon: "chart"  },
  { id: "users",       label: "Usuarios",     icon: "users"  },
  { id: "news",        label: "Avisos",       icon: "bell"   },
  { id: "benefits",    label: "Beneficios",   icon: "star"   },
  { id: "rewards",     label: "Recompensas",  icon: "gift"   },
  { id: "redemptions", label: "Canjes",       icon: "ticket" },
  { id: "tutorias",    label: "Tutorías",     icon: "video"  },
];

export const useAdminSidebar = () => {
  const [active, setActive] = useState<AdminSection>("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useCallback((s: AdminSection) => {
    setActive(s);
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close  = useCallback(() => setIsOpen(false), []);

  return { active, navigate, isOpen, toggle, close };
};
