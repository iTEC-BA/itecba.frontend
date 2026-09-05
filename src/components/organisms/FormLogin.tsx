import React from "react";
import { useAuth } from "@context/AuthContext";
import { Icons } from "@/components/ui/icons/Icons";
import { MainLayout } from "@/components/templates/MainLayout";
import { LoadingState } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const FormLogin: React.FC = () => {
  const { loginWithGoogle, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 w-full py-8">
        <div className="w-full max-w-md bg-itec-box border border-itec-border rounded-[2rem] p-8 sm:p-10 flex flex-col items-center gap-6 text-center relative overflow-hidden shadow-xl">
          
          {/* Línea superior flat roja institucional */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-itec-red-skye" />

          {/* Mascota */}
          <img
            src="/mascot/TEC-Euforico.webp"
            alt="Mascota iTEC"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain transition-transform duration-500 hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/logo.png"; }}
          />

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Portal iTEC <span className="text-itec-red-skye">BA</span>
            </h1>
            <p className="text-itec-muted text-sm leading-relaxed">
              Ingresá con tu cuenta institucional para acceder a todos los beneficios y herramientas de la comunidad.
            </p>
          </div>

          {/* Formulario visual (Desactivado para proteger al usuario y forzar Google Auth) */}
          <div className="w-full flex flex-col gap-4 mt-2">
            <div className="relative text-left">
              <label className="block text-[10px] font-bold text-itec-muted uppercase tracking-[0.15em] mb-1.5">
                Correo Institucional
              </label>
              <div className="relative">
                <Input 
                  fullWidth 
                  disabled 
                  placeholder="usuario@frba.utn.edu.ar" 
                  className="opacity-50 cursor-not-allowed bg-black/20 pl-10" 
                />
                <Icons type="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted opacity-50" />
                <Icons type="lock" className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-itec-red-skye/70" />
              </div>
            </div>

            <div className="relative text-left">
              <label className="block text-[10px] font-bold text-itec-muted uppercase tracking-[0.15em] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Input 
                  fullWidth 
                  type="password"
                  disabled 
                  placeholder="••••••••" 
                  className="opacity-50 cursor-not-allowed bg-black/20 pl-10" 
                />
                <Icons type="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted opacity-50" />
                <Icons type="lock" className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-itec-red-skye/70" />
              </div>
            </div>
          </div>

          {/* Botón de login real */}
          <div className="w-full flex flex-col gap-4 mt-2 pt-6 border-t border-white/5">
            <Button
              onClick={loginWithGoogle}
              variant="danger"
              hierarchy="solid"
              fullWidth
              className="py-3.5 text-sm font-bold"
            >
               <Icons type="google" className="w-4 h-4 mr-2" /> Iniciar sesión con Google
            </Button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-itec-gray uppercase tracking-widest mt-1">
              <span className="w-2 h-2 rounded-full bg-itec-emerald animate-pulse"></span>
              Plataforma exclusiva UTN.BA
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Fallback de carga post-login
  return (
    <div className="flex h-64 items-center justify-center w-full bg-itec-box rounded-xl border border-itec-border mt-10">
      <p className="text-itec-gray font-medium animate-pulse">
        Entrando a tu campus...
      </p>
    </div>
  );
};

export default FormLogin;
