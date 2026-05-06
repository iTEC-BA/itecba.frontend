// src/components/molecules/TopNavbar.tsx
// Mejora: agrega botón hamburguesa (☰) en mobile para abrir el sidebar drawer.

import { Link } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { Icons } from "@components/ui/icons/Icons";
import { UniversalSearch } from "@features/home/components/organisms/UniversalSearch";
import { NotificationBell } from "@features/home/components/organisms/NotificationBell";
import logo from "@assets/logo.png";
import { RewardsWidgetPoints } from "@features/rewards/components/atoms/RewardsWidgetPoints";
import { useSidebarMobile } from "@hooks/useSidebarMobile";

export const TopNavbar = () => {
  const { user } = useAuth();
  const { toggle } = useSidebarMobile();

  return (
    <header className="shrink-0 z-[100] h-16 flex items-center px-4 bg-itec-sidebar border-b border-white/5">
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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

        {/* ── Centro: buscador (oculto en mobile muy pequeño) ── */}
        <div className="hidden sm:flex flex-1 max-w-xl mx-auto items-center gap-0">
          <UniversalSearch />
        </div>

        {/* ── Derecha: redes, puntos, notificaciones, perfil ── */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <div className="hidden lg:flex flex-row items-center gap-0.5">
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-white/10"
            >
              <Icons type="youtube" className="w-5 h-5" />
              <span className="text-sm font-medium">43K</span>
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02" />
              </svg>
              <span className="text-sm font-medium">65K</span>
            </a>
            <a
              href="https://www.udemy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="m19 2l-5 4.5v11l5-4.5zM6.5 5C4.55 5 2.45 5.4 1 6.5v14.66c0 .25.25.5.5.5c.1 0 .15-.07.25-.07c1.35-.65 3.3-1.09 4.75-1.09c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.31 4.75 1.06c.1.05.15.03.25.03c.25 0 .5-.25.5-.5V6.5c-.6-.45-1.25-.75-2-1V19c-1.1-.35-2.3-.5-3.5-.5c-1.7 0-4.15.65-5.5 1.5V6.5C10.55 5.4 8.45 5 6.5 5" />
              </svg>
              <span className="text-sm font-medium">309K</span>
            </a>
            <a
              href="https://discord.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 16 16">
                <path fill="currentColor" d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011a.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0a8 8 0 0 0-.412-.833a.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02a.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595a.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085a8 8 0 0 1-1.249.594a.05.05 0 0 0-.03.03a.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019a13.2 13.2 0 0 0 4.001-2.02a.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613c0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613c0 .888-.631 1.612-1.438 1.612" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-white/10"
            >
              <Icons type="instagram" className="w-5 h-5" />
            </a>
          </div>
          <div className="hidden lg:block h-5 w-px mx-1 bg-white/10"></div>

          {/* Puntos de recompensa */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border text-sm bg-white/5 border-white/10 mr-1">
            <RewardsWidgetPoints />
          </div>

          {/* Categoría */}
          <div className="relative">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <Icons type="category" className="w-5 h-5" />
            </button>
          </div>

          {/* Notificaciones */}
          <div className="relative">
            <NotificationBell />
          </div>

          {/* Foto de perfil / login */}
          <div className="relative ml-1">
            {user?.photoURL ? (
              <Link
                to="/perfil"
                className="w-8 h-8 rounded-lg overflow-hidden flex cursor-pointer hover:opacity-80 transition-opacity border border-white/10"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium transition-colors bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <Icons type="google" className="w-4 h-4" />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};