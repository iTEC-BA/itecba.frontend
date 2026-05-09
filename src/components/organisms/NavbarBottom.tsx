import { Link, useLocation } from "react-router-dom";
import { Icons } from "../ui/icons/Icons";
import Raccoon from "../ui/icons/Raccoon";
import { useAuth } from "../../context/AuthContext";

export const NavbarBottom = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center justify-center flex-col gap-0.5 min-w-0 flex-1 ${
      isActive(path) ? "text-[#e01540]" : "text-[#9aa3b0]"
    }`;

  return (
    <nav className="h-16 w-full bg-itec-sidebar border-t border-white/5 sticky bottom-0 z-[99] flex items-center justify-around px-2 shrink-0 pb-safe">
      <div className="flex gap-1 justify-around w-full items-center">
        {/* Inicio */}
        <Link to="/" className={linkClass("/")}>
          <div className="w-6 h-6">
            <Icons type="home" className="w-full h-full" />
          </div>
          <span className="text-[9px] font-medium truncate">Inicio</span>
        </Link>

        {/* BuscaTEC */}
        <Link to="/buscatec" className={linkClass("/buscatec")}>
          <div className="w-6 h-6">
            <Icons type="search" className="w-full h-full" />
          </div>
          <span className="text-[9px] font-medium truncate">Buscar</span>
        </Link>

        {/* FAB central — Chatbot / Raccoon */}
        <Link to="/faqs" className="flex items-center justify-center flex-col flex-1">
          <span
            className={`rounded-2xl p-2 transition-colors ${
              isActive("/faqs") ? "bg-[#e01540]" : "bg-itec-red"
            }`}
          >
            <Raccoon size={28} fill1="#ffffff" fill2="#ffffff" fill3="#0C1014" />
          </span>
          <span className="text-[9px] font-medium text-[#9aa3b0] mt-0.5">Chat IA</span>
        </Link>

        {/* Grupos */}
        <Link to="/grupos" className={linkClass("/grupos")}>
          <div className="w-6 h-6">
            <Icons type="users" className="w-full h-full" />
          </div>
          <span className="text-[9px] font-medium truncate">Grupos</span>
        </Link>

        {/* Perfil / Login */}
        <Link
          to={isAuthenticated ? "/perfil" : "/login"}
          className={linkClass(isAuthenticated ? "/perfil" : "/login")}
        >
          <div className="w-6 h-6">
            <Icons type="user" className="w-full h-full" />
          </div>
          <span className="text-[9px] font-medium truncate">
            {isAuthenticated ? "Perfil" : "Entrar"}
          </span>
        </Link>
      </div>
    </nav>
  );
};