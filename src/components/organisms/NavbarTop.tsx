// src/components/molecules/TopNavbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { Icons } from "@components/ui/icons/Icons";
// import { UniversalSearch } from "@features/home/components/organisms/UniversalSearch";

import logo from "@assets/logo.png";
import { RewardsWidgetPoints } from "@features/rewards/components/atoms/RewardsWidgetPoints";
import { useSidebarMobile } from "@hooks/useSidebarMobile";
import { Suspense } from "react";
import { NotificationBell } from "@/features/notifications/components/organisms/NotificationBell";
import { Settings } from "lucide-react";

export const NavbarTop = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toggle } = useSidebarMobile();

  return (
    <header className="shrink-0 z-100 h-16 flex items-center px-4 bg-itec-sidebar border-b border-white/5">
      <div className="w-full mx-auto flex items-center gap-3">
        {/* ── Izquierda: hamburguesa (solo mobile) + logo ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Botón hamburguesa — visible solo en mobile (<md) */}
          <button
            onClick={toggle}
            aria-label="Abrir menú"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-transparent hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            {/* Icono de tres líneas */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link
            to="/"
            className="w-max h-8 rounded-lg flex items-center justify-center flex-row gap-3"
          >
            <img src={logo} alt="ITEC Logo" className="size-7 object-contain" />
            <span className="hidden sm:block text-xl font-bold tracking-tight text-white">
              iTEC <span className="text-itec-red">BA</span>
            </span>
          </Link>
        </div>

        {/* ── Centro: buscador (oculto en mobile muy pequeño) ──
        <div className="hidden sm:flex flex-1 max-w-xl mx-auto items-center gap-0">
          <UniversalSearch />
        </div> */}

        {/* ── Derecha: redes, puntos, notificaciones, perfil ── */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <div className="flex flex-row items-center gap-4 text-xs">
            <a
              href="https://www.youtube.com/@itecBA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-itec-gray hover:text-itec-text"
            >
              <Icons type="youtube" className="size-4" />
              <span className="hidden md:inline font-medium">43K</span>
            </a>
            <a
              href="https://www.instagram.com/itecba"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-itec-gray hover:text-itec-text"
            >
              <Icons type="instagram" className="size-4" />
              <span className="hidden md:inline font-medium">65K</span>
            </a>
            <a
              href="https://discord.gg/kGAHwb2qKV"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-itec-gray hover:text-itec-text"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011a.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0a8 8 0 0 0-.412-.833a.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02a.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595a.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085a8 8 0 0 1-1.249.594a.05.05 0 0 0-.03.03a.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019a13.2 13.2 0 0 0 4.001-2.02a.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613c0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613c0 .888-.631 1.612-1.438 1.612"
                />
              </svg>
              <span className="hidden md:inline font-medium">309K</span>
            </a>
          </div>

          <div className="h-4 w-px mx-1 bg-white/10"></div>
          {isAuthenticated && (
            <div className="flex items-center justify-between gap-2">
              {/* Categoría */}
              {isAdmin && (
                <Link
                className="relative bg-itec-box/50 border border-white/5 rounded-xl hover:bg-itec-border transition-colors cursor-pointer flex items-center justify-center text-gray-400 hover:text-white"
                to="/admin"
                aria-label="Panel de administraci�n"
              >
                <Settings className="size-4" />
              </Link>
              )}
              {/* Notificaciones */}
              <div className="relative bg-itec-box/50 border border-white/5 rounded-xl hover:bg-itec-border transition-colors cursor-pointer">
                <Suspense
                  fallback={
                    <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse" />
                  }
                >
                  <NotificationBell />
                </Suspense>
              </div>
              {/* Puntos de recompensa */}
              <div className="px-2.5 py-1">
                <RewardsWidgetPoints />
              </div>
            </div>
          )}
          {/* Foto de perfil / login */}

          <div className="relative text-xs">
            {user?.photoURL ? (
              <Link
                to="/perfil"
                className="size-6.5 rounded-lg overflow-hidden flex cursor-pointer hover:opacity-80 transition-opacity border border-itec-border"
              >
                <img
                  src={user.photoURL}
                  alt={user.name || "Perfil"}
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-itec-border font-medium transition-colors bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <Icons type="google" className="size-4" />
                <span className="">Iniciar sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
