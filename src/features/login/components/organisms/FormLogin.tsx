import React from "react";
import logoItec from "../../../../assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { Icons } from "@/components/ui/Icons";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import LoadingState from "@/components/atoms/LoadingState";

const FormLogin: React.FC = () => {
  const { loginWithGoogle, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-12 w-full text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] relative group overflow-hidden">

        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner relative group-hover:shadow-sky-500/10 transition-shadow duration-500">
          <img
            src={logoItec}
            alt="Logo ITEC"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10"
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
          Portal ITEC
        </h2>
        <p className="text-slate-400 text-sm mb-10 leading-relaxed px-2">
          Accedé a tus beneficios, apuntes y credencial usando tu cuenta de la
          facultad.
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-itec-red-skye hover:bg-itec-red text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(212,19,19,0.15)] hover:shadow-[0_0_30px_rgba(212,19,19,0.35)] hover:-translate-y-1 border border-white/10 hover:border-white/20 cursor-pointer relative overflow-hidden"
        >
          <div className="w-6 h-6">
            <Icons type="google" />
          </div>
          Iniciar sesión con @frba
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
          Plataforma exclusiva UTN.BA
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center w-full bg-slate-900/50 rounded-3xl border border-white/5">
      <p className="text-slate-400 font-medium animate-pulse">
        Entrando a tu campus...
      </p>
    </div>
  );
};

export default FormLogin;
