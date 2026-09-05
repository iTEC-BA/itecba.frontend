import React from "react";
import logoItec from "@assets/logo.png";
import { useAuth } from "@context/AuthContext";
import { Icons } from "@/components/ui/icons/Icons";
import LoadingState from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button"; 

const FormLogin: React.FC = () => {
  const { loginWithGoogle, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[80vh] px-4 w-full">
        <div className="bg-itec-box border border-itec-border rounded-[2rem] p-8 sm:p-12 w-full max-w-md flex flex-col items-center gap-8 text-center transition-all">
          <div className="flex justify-center w-full">
            <img src={logoItec} alt="Logo ITEC" className="w-24 h-24 sm:w-28 sm:h-28 object-contain transition-transform duration-500 hover:scale-105" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-itec-text tracking-tight">
              Portal iTEC <span className="text-itec-red">BA</span>
            </h1>
            <p className="text-itec-description text-sm leading-relaxed">
              Accedé a tus beneficios, organizá tus materias, descargá apuntes y conectá con la comunidad usando tu cuenta institucional.
            </p>
          </div>
          <div className="w-full flex flex-col gap-5">
            <Button onClick={loginWithGoogle} variant="danger" hierarchy="solid" fullWidth className="py-4 text-sm font-bold" icon={<div className="w-5 h-5"><Icons type="google" /></div>} text="Iniciar sesión con @frba" />
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-itec-gray uppercase tracking-widest mt-2">
              <span className="w-2 h-2 rounded-full bg-itec-groups"></span>
              Plataforma exclusiva UTN.BA
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center w-full bg-itec-box rounded-xl border border-itec-border">
      <p className="text-itec-gray font-medium animate-pulse">Entrando a tu campus...</p>
    </div>
  );
};

export default FormLogin;
