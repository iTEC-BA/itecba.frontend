import { useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

export const useSidebarLinks = () => {
  const { isAuthenticated, user } = useAuth();

  const getFormattedName = useCallback(() => {
    if (!user?.name) return "Estudiante";
    const email = user.email || "";
    const username = email.split("@")[0];
    return username || "Estudiante";
  }, [user]);

  const sections = useMemo(
    () => [
      {
        title: "Principal",
        links: [
          { path: "/", label: "Inicio", iconName: "home" },
          { path: "/buscatec", label: "BuscaTEC", iconName: "search" },
          { path: "/aulas", label: "Buscar aula", iconName: "map-pin" },
        ],
      },
      {
        title: "Aprender",
        links: [
          { path: "/cursos", label: "Cursos", iconName: "book", badge: "Nuevo" },
          { path: "/guiatec", label: "GuíaTEC", iconName: "video", tag: { text: "Free", color: "green" as const } },
          { path: "/recursos", label: "BiblioTEC", iconName: "folder" },
        ],
      },
      {
        title: "Comunidad",
        links: [
          { path: "/grupos", label: "Grupos", iconName: "users" },
          { path: "/faqs", label: "Novedades", iconName: "news" },
        ],
      },
      {
        title: "Herramientas",
        links: [
          { path: "/grado", label: "Calc. promedio", iconName: "calculator" },
          { path: "/calendario", label: "Calendario académico", iconName: "calendar" },
          { path: "/plugins", label: "Plugins y apps", iconName: "tool" },
        ],
      },
    ],
    []
  );

  const footerLinks = useMemo(
    () => [
      // Protegido: Solo Admins
      { path: "/admin", label: "Panel Admin", iconName: "settings", requireAdmin: true },
      // Protegido: Solo Usuarios Logueados
      { path: "/beneficios", label: "Recompensas", iconName: "gift", tag: { text: user?.points, color: "gold" as const }, requireAuth: true },
      { path: "/progreso", label: "Seguidor de carrera", iconName: "chart-line", requireAuth: true },
      // Dinámico: Cambia si está logueado o no
      { 
        path: isAuthenticated ? "/perfil" : "/login", 
        label: isAuthenticated ? getFormattedName() : "Iniciar Sesión", 
        iconName: "user" 
      },
      { path: "/terminos", label: "Términos y cond.", iconName: "file-text" },
    ],
    [isAuthenticated, getFormattedName, user?.points]
  );

  return {
    sections,
    footerLinks,
  };
};