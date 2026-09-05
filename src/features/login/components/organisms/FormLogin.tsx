import React from "react";
import { useAuthStore } from '@/stores/authStore';
import { Icons } from "@/components/ui/icons/Icons";
import LoadingState from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, ShieldCheck } from "lucide-react";

const FormLogin: React.FC = () => {
  const { loginWithGoogle, isAuthenticated, loading } = useAuthStore();

  if (loading) return <LoadingState />;

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-sm mx-auto text-itec-text space-y-4 bg-itec-box border border-itec-border p-4 sm:p-6 rounded-[2rem] shadow-sm">
        {/* Encabezado y Mascota */}
        <div className="text-center pb-1">
          <img 
            src="/mascot/TEC-Euforico.webp" 
            alt="Mascota iTEC" 
            width="130"
            className="mx-auto" 
            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/logo.png"; }}
          />
          <div className="mt-2">
            <h3 className="text-white text-2xl font-bold sm:text-3xl tracking-tight">
              Iniciá sesión
            </h3>
            <p className="text-itec-muted text-sm mt-2">
              Plataforma exclusiva para estudiantes
            </p>
          </div>
        </div>

        {/* Falso formulario para mantener el layout estructural */}
        <div className="space-y-4">
          <div>
            <label className="font-medium text-sm text-itec-muted mb-1.5 block">Correo Institucional</label>
            <div className="relative">
              <Input 
                disabled 
                fullWidth 
                value="usuario@frba.utn.edu.ar" 
                className="pl-10 py-2.5 opacity-50 cursor-not-allowed bg-black/20 border border-white/5 rounded-xl text-itec-gray" 
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted opacity-50" />
            </div>
          </div>
          
          <div>
            <label className="font-medium text-sm text-itec-muted mb-1.5 block">Contraseña</label>
            <div className="relative">
              <Input 
                disabled 
                fullWidth 
                type="password"
                value="••••••••••••" 
                className="pl-10 py-2.5 opacity-50 cursor-not-allowed bg-black/20 border border-white/5 rounded-xl text-itec-gray" 
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted opacity-50" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-itec-muted pt-1 pb-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-itec-emerald" />
              <span>Autenticación segura</span>
            </div>
            <a href="https://www.frba.utn.edu.ar/" target="_blank" rel="noreferrer" className="text-itec-red-skye hover:text-white transition-colors">
              ¿Olvidaste tu clave?
            </a>
          </div>

          {/* Botón Principal Funcional */}
          <div className="pt-2">
            <Button 
              onClick={loginWithGoogle} 
              variant="danger" 
              hierarchy="solid" 
              fullWidth 
              className="py-3 text-sm font-bold flex items-center justify-center gap-3"
            >
              <div className="w-5 h-5 flex items-center justify-center"><Icons type="google" className="size-5" /></div>
              Continuar con Google
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-itec-gray pt-2">
          ¿No tenés cuenta?{" "}
          <a href="https://www.frba.utn.edu.ar/" target="_blank" rel="noreferrer" className="font-medium text-itec-red-skye hover:text-white transition-colors">
            Solicitá tu correo UTN
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center w-full max-w-sm mx-auto bg-itec-box rounded-[2rem] border border-itec-border">
      <p className="text-itec-gray font-medium animate-pulse">Entrando a tu campus...</p>
    </div>
  );
};

export default FormLogin;
