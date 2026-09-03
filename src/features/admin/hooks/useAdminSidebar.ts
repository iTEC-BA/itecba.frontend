import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type AdminSection = "dashboard" | "users" | "news" | "benefits" | "redemptions" | "tutorias" | "pages" | "moderation";

export interface SidebarLink {
  id: AdminSection;
  label: string;
  icon: string;
  path: string;
  category: string;
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  { id: "dashboard",   label: "Dashboard",    icon: "chart",    path: "dashboard",   category: "General" },
  { id: "news",        label: "Avisos",       icon: "bell",     path: "avisos",      category: "General" },
  { id: "pages",       label: "Páginas",      icon: "lock",     path: "paginas",     category: "General" },
  { id: "moderation",  label: "Moderación",   icon: "verified", path: "moderacion",  category: "Contenido" },
  { id: "users",       label: "Usuarios",     icon: "users",    path: "usuarios",    category: "Comunidad" },
  { id: "benefits",    label: "Beneficios",   icon: "gift",     path: "beneficios",  category: "Comunidad" },
  { id: "redemptions", label: "Canjes",       icon: "ticket",   path: "canjes",      category: "Comunidad" },
  { id: "tutorias",    label: "Tutorías",     icon: "video",    path: "tutorias",    category: "Comunidad" },
];

const DEFAULT_SECTION: AdminSection = "dashboard";

const getSectionFromPath = (pathname: string): AdminSection => {
  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  const match = SIDEBAR_LINKS.find((link) => link.path === segment);
  return match?.id ?? DEFAULT_SECTION;
};

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
