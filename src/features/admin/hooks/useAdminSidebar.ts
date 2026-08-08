// src/features/admin/hooks/useAdminSidebar.ts
import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type AdminSection =
  | "dashboard"
  | "users"
  | "news"
  | "benefits"
  | "redemptions"
  | "tutorias"
  | "pages";

export interface SidebarLink {
  id: AdminSection;
  label: string;
  icon: string;
  path: string; // segmento de URL relativo a /admin (ej: "usuarios")
}

// "Académico" y "Videos Rotos" se eliminaron del panel de admin:
// ahora viven como modales dentro de CoursesPage y GroupsPage.
export const SIDEBAR_LINKS: SidebarLink[] = [
  { id: "dashboard",   label: "Dashboard",    icon: "chart",  path: "dashboard"   },
  { id: "users",       label: "Usuarios",     icon: "users",  path: "usuarios"    },
  { id: "news",        label: "Avisos",       icon: "bell",   path: "avisos"      },
  { id: "benefits",    label: "Beneficios",   icon: "gift",   path: "beneficios"  },
  { id: "redemptions", label: "Canjes",       icon: "ticket", path: "canjes"      },
  { id: "tutorias",    label: "Tutorías",     icon: "video",  path: "tutorias"    },
  { id: "pages",       label: "Páginas",      icon: "lock",   path: "paginas"     },
];

const DEFAULT_SECTION: AdminSection = "dashboard";

// Deriva la sección activa a partir del segmento de URL actual (/admin/:segmento)
const getSectionFromPath = (pathname: string): AdminSection => {
  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  const match = SIDEBAR_LINKS.find((link) => link.path === segment);
  return match?.id ?? DEFAULT_SECTION;
};

// 🔄 La navegación del panel ahora vive en la URL (react-router-dom) en lugar
// de un useState<AdminSection> local: esto permite acceder directamente a
// /admin/usuarios, /admin/avisos, etc., compartir el link y usar "atrás/adelante".
export const useAdminSidebar = () => {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const active = useMemo<AdminSection>(
    () => getSectionFromPath(location.pathname),
    [location.pathname]
  );

  const navigate = useCallback(
    (s: AdminSection) => {
      const link = SIDEBAR_LINKS.find((l) => l.id === s);
      routerNavigate(`/admin/${link?.path ?? s}`);
      setIsOpen(false);
    },
    [routerNavigate]
  );

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close  = useCallback(() => setIsOpen(false), []);

  return { active, navigate, isOpen, toggle, close };
};
