import { useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Home, MessageCircle, Search, MapPin, 
  BookOpen, Video, Folder, Users, Newspaper, 
  Calculator, Calendar, Wrench, Settings, Gift, 
  LineChart, User, FileText, 
  Handshake
} from "lucide-react";

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
          { path: "/", label: "Inicio", icon: Home },
          { path: "/foro", label: "Comunidad", icon: MessageCircle },
          { path: "/trueketec", label: "TruekeTEC", icon: Handshake, requireAuth: true },
          { path: "/buscatec", label: "BuscaTEC", icon: Search },
          { path: "/aulas", label: "Buscar aula", icon: MapPin },
        ],
      },
      {
        title: "Aprender",
        links: [
          { path: "/cursos", label: "Cursos", icon: BookOpen, badge: "Nuevo" },
          { path: "/guiatec", label: "GuíaTEC", icon: Video, tag: { text: "Free", color: "green" as const } },
          { path: "/recursos", label: "BiblioTEC", icon: Folder },
        ],
      },
      {
        title: "Comunidad",
        links: [
          { path: "/grupos", label: "Grupos", icon: Users },
          { path: "/faqs", label: "Novedades", icon: Newspaper },
        ],
      },
      {
        title: "Herramientas",
        links: [
          { path: "/grado", label: "Calc. promedio", icon: Calculator },
          { path: "/calendario", label: "Calendario académico", icon: Calendar },
          { path: "/plugins", label: "Plugins y apps", icon: Wrench },
        ],
      },
    ],
    []
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
    footerLinks,
  };
};