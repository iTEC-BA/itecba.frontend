import { useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { usePageAccess } from "@features/pageAccess/context/PageAccessContext";
import { 
  Home, MessageCircle, MapPin, 
  BookOpen, Video, Folder, Users, Calendar, Wrench, Settings, Gift, 
  LineChart, User, FileText, 
  Handshake,
  LandPlot,
  MessageCircleQuestionMark
} from "lucide-react";

export const useSidebarLinks = () => {
  const { isAuthenticated, user } = useAuth();
  const { getState } = usePageAccess();

  // Aplica el estado configurado desde /admin/paginas a cada link:
  //   - "hidden": el link se saca directamente del sidebar.
  //   - "comingSoon": el link se mantiene visible pero se le agrega el tag
  //     "Próximamente" (si el link no traía ya un tag propio, ej. el badge
  //     de puntos de "Recompensas" — ese no se pisa).
  // No se filtra por "enabled" acá: una página deshabilitada sigue visible
  // en el sidebar (el usuario ve el bloqueo real al entrar, vía PageGate)
  // salvo que además se marque explícitamente como oculta.
  const applyPageAccess = (links: any[]) =>
    links
      .filter((l) => !getState(l.path).hidden)
      .map((l) => {
        const state = getState(l.path);
        if (state.comingSoon && !l.tag) {
          return { ...l, tag: { text: "Próximamente", color: "gold" as const } };
        }
        return l;
      });

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
        links: applyPageAccess([
          { path: "/", label: "Inicio", icon: Home },
          { path: "/foro", label: "Comunidad", icon: MessageCircle },
          { path: "/trueketec", label: "TruekeTEC", icon: Handshake, requireAuth: true },
          { path: "/aulas", label: "Buscar aula", icon: MapPin },
        ]),
      },
      {
        title: "Aprender",
        links: applyPageAccess([
          { path: "/cursos", label: "Cursos", icon: BookOpen},
          { path: "/guiatec", label: "GuíaTEC", icon: Video},
          { path: "/recursos", label: "BiblioTEC", icon: Folder },
        ]),
      },
      {
        title: "Comunidad",
        links: applyPageAccess([
          { path: "/grupos", label: "Grupos", icon: Users },
          { path: "/faqs", label: "Preguntas Frecuentes", icon: MessageCircleQuestionMark },
        ]),
      },
      {
        title: "Herramientas",
        links: applyPageAccess([
          { path: "/grado", label: "Plan de Estudios", icon: LandPlot },
          { path: "/calendario", label: "Calendario académico", icon: Calendar },
          { path: "/plugins", label: "Plugins y apps", icon: Wrench },
        ]),
      },
    ],
    [getState]
  );

  const footerLinks = useMemo(
    () => [
      // Protegido: Solo Admins
      { path: "/admin", label: "Panel Admin", icon: Settings, requireAdmin: true },
      // Protegido: Solo Usuarios Logueados
      { path: "/beneficios", label: "Recompensas", icon: Gift, tag: { text: user?.points || 0, color: "gold" as const }, requireAuth: true },
      { path: "/progreso", label: "Seguidor de carrera", icon: LineChart, requireAuth: true },
      // Dinámico: Cambia si está logueado o no
      { 
        path: isAuthenticated ? "/perfil" : "/login", 
        label: isAuthenticated ? getFormattedName() : "Iniciar Sesión", 
        icon: User 
      },
      { path: "/terminos", label: "Términos y cond.", icon: FileText },
    ],
    [isAuthenticated, getFormattedName, user?.points]
  );

  return {
    sections,
    footerLinks: applyPageAccess(footerLinks),
  };
};
