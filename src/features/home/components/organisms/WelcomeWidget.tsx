import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { BentoCard } from "@features/home/components/atoms/BentoCard";
import { GlowDot } from "@features/home/components/atoms/GlowDot";
import { Icons } from "@components/ui/icons/Icons";

export const WelcomeWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const firstName = user?.name ? user.name.split(" ")[0] : null;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <BentoCard className="flex-1 p-4 sm:p-5" glow="blue" hover>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <GlowDot color="green" />
              <span className="text-[10px] font-bold text-itec-gray uppercase tracking-widest">
                Plataforma activa
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-itec-text leading-tight">
              {firstName ? (
                <>
                  {greeting},{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-itec-red to-itec-red-skye">
                    {firstName}
                  </span>{" "}
                  👋
                </>
              ) : (
                <>
                  Bienvenido a{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-itec-red to-itec-red-skye">
                    iTEC BA
                  </span>
                </>
              )}
            </h1>
            <p className="text-itec-gray text-[12px] mt-1 leading-relaxed">
              {isAuthenticated
                ? "Tu campus universitario, todo en un lugar."
                : "La plataforma estudiantil de UTN Buenos Aires."}
            </p>
          </div>
          {user?.photoURL && (
            <Link to="/perfil" className="shrink-0">
              <img
                src={user.photoURL}
                alt="Perfil"
                className="w-10 h-10 rounded-xl border border-itec-border object-cover hover:opacity-80 transition-opacity"
              />
            </Link>
          )}
        </div>

        {!isAuthenticated && (
          <Link
            to="/login"
            className="mt-4 inline-flex items-center gap-2 bg-itec-red hover:bg-itec-red-skye text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-itec-red/20"
          >
            <Icons type="google" className="w-4 h-4" />
            Iniciar sesión con @frba
          </Link>
        )}

        {isAuthenticated && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {user?.specialty && (
              <span className="text-[10px] font-medium bg-itec-blue-skye/10 text-itec-blue-skye border border-itec-blue-skye/20 px-2.5 py-1 rounded-full">
                Ing. {user.specialty}
              </span>
            )}
            {(user as any)?.points != null && (
              <span className="text-[10px] font-medium bg-itec-rewards/10 text-itec-rewards border border-itec-rewards/20 px-2.5 py-1 rounded-full">
                ⭐ {(user as any).points} pts
              </span>
            )}
          </div>
        )}
      </BentoCard>

      <div className="flex flex-row sm:flex-col gap-2.5 sm:w-36">
        <Link
          to="/beneficios"
          className="flex-1 group flex flex-col items-center justify-center gap-1.5 p-3 bg-itec-box border border-white/[0.07] rounded-2xl hover:border-itec-rewards/40 hover:bg-itec-rewards/5 transition-all duration-200 text-center"
        >
          <div className="w-8 h-8 bg-itec-rewards/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Icons type="gift" className="w-4 h-4 text-itec-rewards" />
          </div>
          <span className="text-[10px] font-semibold text-itec-gray group-hover:text-itec-rewards transition-colors leading-tight">
            Beneficios
          </span>
        </Link>
        <Link
          to="/progreso"
          className="flex-1 group flex flex-col items-center justify-center gap-1.5 p-3 bg-itec-box border border-white/[0.07] rounded-2xl hover:border-itec-groups/40 hover:bg-itec-groups/5 transition-all duration-200 text-center"
        >
          <div className="w-8 h-8 bg-itec-groups/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Icons type="chart-line" className="w-4 h-4 text-itec-groups" />
          </div>
          <span className="text-[10px] font-semibold text-itec-gray group-hover:text-itec-groups transition-colors leading-tight">
            Progreso
          </span>
        </Link>
      </div>
    </div>
  );
};
