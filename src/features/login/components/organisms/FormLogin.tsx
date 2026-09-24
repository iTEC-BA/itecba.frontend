import React, { useState } from "react";
import { useAuthStore } from '@/stores/authStore';
import { Icons } from "@/components/ui/icons/Icons";
import LoadingState from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail,  ShieldCheck } from "lucide-react";
import { useToast } from "@features/notifications/components/atoms/Toast";
import { getErrorDetails } from "@/lib/error-utils";

const FormLogin: React.FC = () => {
  const { loginWithGoogle, isAuthenticated, loading } = useAuthStore();
  const { toast } = useToast();
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  if (loading) return <LoadingState />;

  const handleGoogle = async () => {
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const error = getErrorDetails(err);
      toast.error(error.message || 'Error al iniciar sesión.');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-sm mx-auto text-itec-text space-y-4 bg-itec-box border border-itec-border/50 p-4 sm:p-6 rounded-4xl shadow-sm">
        <div className="text-center pb-1">
          <img 
            src="/mascot/TEC-Euforico.webp" alt="Mascota iTEC" width="130" className="mx-auto" 
            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/logo.png"; }}
          />
          <div className="mt-2">
            <h3 className="text-white text-2xl font-bold sm:text-3xl tracking-tight">Iniciá sesión</h3>
            <div className="rounded-xl border border-itec-border/50 bg-black/10 p-3 text-center text-xs text-itec-muted mt-2">
                El acceso está reservado exclusivamente para estudiantes y usuarios autorizados.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-medium text-sm text-itec-muted mb-1.5 block">Correo Institucional</label>
            <div className="relative">
              <Input disabled fullWidth value="usuario@frba.utn.edu.ar" className="pl-10 py-2.5 opacity-50 cursor-not-allowed bg-black/20 border border-itec-border/50 rounded-xl text-itec-gray" />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted opacity-50" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-itec-muted py-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-itec-emerald" />
              <span>Autenticación segura</span>
            </div>
          </div>

          <div className="pt-1">
            <Button onClick={handleGoogle} variant="danger" hierarchy="solid" fullWidth isLoading={googleSubmitting} className="py-3 text-sm font-bold flex items-center justify-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center"><Icons type="google" className="size-5" /></div>
              Continuar con Google
            </Button>
          </div>

          <div className="space-y-2 text-center text-sm">
            <p className="text-itec-muted">¿Necesitás acceso?</p>
            <a
              href="https://www.instagram.com/itecba/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs font-medium text-itec-red underline-offset-4 hover:underline"
            >
              Solicitar acceso (enviar mensaje)
            </a>
            <a
              href="https://www.frba.utn.edu.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs font-medium text-itec-red underline-offset-4 hover:underline"
            >
              Solicitar correo @frba.utn.edu.ar
            </a>
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center w-full max-w-sm mx-auto bg-itec-box rounded-4xl border border-itec-border/50">
      <p className="text-itec-gray font-medium animate-pulse">Entrando a tu campus...</p>
    </div>
  );
};

export default FormLogin;
