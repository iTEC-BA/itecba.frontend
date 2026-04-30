import { useState, useMemo } from "react";

export const useSidebarLinks = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const linksRigth = useMemo(
    () => [
      { path: "/", label: "Inicio", iconName: "home", iconColor: "text-itec-text" },
      { path: "/cursos", label: "Cursos", iconName: "play", iconColor: "text-itec-courses" },
      { path: "/grupos", label: "Grupos", iconName: "users", iconColor: "text-itec-groups" },
      { path: "/progreso", label: "Mi Progreso", iconName: "bookmark", iconColor: "text-itec-progress" },
      { path: "/recursos", label: "Recursos", iconName: "folder", iconColor: "text-itec-text" },
      { path: "/ingreso", label: "Ingreso", iconName: "entry", iconColor: "text-itec-text" },
      { path: "/grado", label: "Calificaciones", iconName: "degree", iconColor: "text-itec-text" },
      { path: "/beneficios", label: "Beneficios", iconName: "star", iconColor: "text-itec-rewards" },
      { path: "/faqs", label: "Ayuda y FAQs", iconName: "info", iconColor: "text-itec-text" },
    ],
    [],
  );

  const linksCenter = useMemo(
    () => [
      { path: "/", label: "Inicio", iconName: "home", iconColor: "text-itec-text" },
      { path: "/cursos", label: "Cursos", iconName: "play", iconColor: "text-itec-text" },
      { path: "/grupos", label: "Grupos", iconName: "users", iconColor: "text-itec-text" },
      { path: "/progreso", label: "Progreso", iconName: "bookmark", iconColor: "text-itec-text" },
    ],
    [],
  );

  const visibleLinksRigth = isExpanded ? linksRigth : linksRigth.slice(0, 5);
  const visibleLinksCenter = isExpanded ? linksCenter : linksCenter.slice(0, 5);
  const links = linksRigth.concat(linksCenter);
  return {
    visibleLinks: visibleLinksRigth,
    visibleLinksCenter,
    isExpanded,
    toggleExpand,
    totalLinks: links.length,
  };
};
