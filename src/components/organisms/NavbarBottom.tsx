import { Link, useLocation } from "react-router-dom";
import Raccoon from "../ui/icons/Raccoon";
import { Icons } from "../ui/icons/Icons";
import { useAuthStore } from '@/stores/authStore';

export const NavbarBottom = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center justify-center flex-col gap-0.5 min-w-0 flex-1 ${
      isActive(path) ? "text-[#e01540]" : "text-[#9aa3b0]"
    }`;

  return (
    <nav className="h-16 w-full bg-itec-sidebar border-t border-white/5 sticky bottom-0 z-30 flex items-center justify-around px-2 shrink-0 pb-safe">
      <div className="flex gap-1 justify-around w-full items-center">
        {/* Inicio */}
        <Link to="/" className={linkClass("/")}>
          <Icons type="home" className="size-6" />
          <span className="text-[9px] font-medium truncate">Inicio</span>
        </Link>

        {/* Aulas */}
        <Link to="/aulas" className={linkClass("/aulas")}>
          <Icons type="entry" className="size-6" />
          <span className="text-[9px] font-medium truncate">Aulas</span>
        </Link>

        {/* FAB central — Chatbot / Raccoon */}
        <Link to="/faqs" className="relative flex items-center justify-center flex-col flex-1">
          <span className="relative flex items-center justify-center h-6">
            <span className="absolute bottom-0 size-14 flex flex-col items-center justify-center">
              <Raccoon size={55} fill1="#888888" fill2="#ffffff" fill3="#0C1014" />
            </span>
          </span>
          <span className="text-[9px] font-medium text-[#9aa3b0]">ChatItec</span>
        </Link>

        {/* Grupos */}
        <Link to="/grupos" className={linkClass("/grupos")}>
          <Icons type="users" className="size-6" />
          <span className="text-[9px] font-medium truncate">Grupos</span>
        </Link>

        {/* Perfil / Login */}
        <Link
          to={isAuthenticated ? "/notificaciones" : "/plugins"}
          className={linkClass(isAuthenticated ? "/notificaciones" : "/plugins")}
        >
          <Icons type={isAuthenticated ? "bellDot" : "grid"} className="size-6" />
          <span className="text-[9px] font-medium truncate">
            {isAuthenticated ? "Notificaciones" : "Plugins"}
          </span>
        </Link>
      </div>
    </nav>
  );
};
