import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from '@/stores/authStore';
import { Icons } from "@components/ui/icons/Icons";
import { ChartLine, ChevronRight, GraduationCap, Star } from "lucide-react";

export const WelcomeWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const firstName = user?.name ? user.name.split(" ")[0] : null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  // ── ESTADO: NO AUTENTICADO ────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <section className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-white/10 bg-itec-box p-6 sm:p-8">
        <div className="flex-1">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-itec-emerald/20 bg-itec-emerald/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
            Sistema en línea
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Bienvenido a iTEC BA
          </h1>
          <p className="text-sm text-white/50 max-w-md leading-relaxed">
            La plataforma colaborativa e independiente construida exclusivamente por y para estudiantes de la UTN FRBA.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-itec-red/33 px-6 py-3.5 text-sm font-bold  transition-colors hover:bg-gray-200 active:scale-95"
        >
          <Icons type="google" className="h-4 w-4" />
          Ingresar con @frba
        </Link>
      </section>
    );
  }

  // ── ESTADO: AUTENTICADO (Bento Grid Flat) ─────────────────────────────────
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
      
      {/* ── 1. TARJETA PRINCIPAL (Bienvenida y Perfil) - Ocupa 6 a 8 columnas ── */}
      <section className="md:col-span-6 lg:col-span-8 flex items-center gap-4 sm:gap-5 rounded-2xl border border-white/10 bg-itec-box p-5 sm:p-6 transition-colors hover:border-white/20">
        {user?.photoURL ? (
          <Link to="/perfil" className="shrink-0 group">
            <img
              src={user.photoURL}
              alt="Perfil"
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-white/10 bg-white/5 object-cover transition-transform group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/75">
            <GraduationCap className="h-8 w-8" />
          </div>
        )}
        
        <div className="flex flex-col justify-center min-w-0">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-itec-emerald" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex gap-2">
            <GraduationCap className="h-4 w-4" />
            {greeting}
            </span>
          </div>
          <h1 className="truncate text-xl sm:text-3xl font-bold tracking-tight text-white mb-1">
            Hola, {firstName}
          </h1>
          <p className="truncate text-xs sm:text-sm text-white/50">
            Tu campus universitario en un solo lugar.
          </p>
        </div>
      </section>

      {/* ── 2. TARJETA PUNTOS / BENEFICIOS - Ocupa 3 a 2 columnas ── */}
      <Link
        to="/beneficios"
        className="md:col-span-3 lg:col-span-2 group flex flex-col justify-center rounded-2xl border border-white/10 bg-white/2 p-5 transition-all hover:bg-white/2 hover:border-itec-rewards/30"
      >
        <div className="mb-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-itec-rewards/20 bg-itec-rewards/10 text-itec-rewards transition-transform group-hover:scale-110">
          <Star className="h-4 w-4" fill="currentColor" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-baseline gap-1">
            {user && 'points' in user ? user.points : 0} <span className="text-xs text-white/40 font-normal">pts</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-itec-rewards transition-colors flex items-center gap-1 mt-1">
            Beneficios <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </Link>

      {/* ── 3. TARJETA CARRERA / PROGRESO - Ocupa 3 a 2 columnas ── */}
      <Link
        to="/progreso"
        className="md:col-span-3 lg:col-span-2 group flex flex-col justify-center rounded-2xl border border-white/10 bg-white/2 p-5 transition-all hover:bg-white/2 hover:border-itec-groups/30"
      >
        <div className="mb-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-itec-groups/20 bg-itec-groups/10 text-itec-groups transition-transform group-hover:scale-110">
          <ChartLine className="h-4 w-4" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm sm:text-base font-bold text-white truncate leading-tight mt-0.5 uppercase">
            {user?.specialty ? `${user.specialty}` : "Mi Carrera"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-itec-groups transition-colors flex items-center gap-1 mt-1.5">
            Progreso <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </Link>

    </div>
  );
};