import React, { useState } from "react";
import { useAuthStore } from '@/stores/authStore';
import { Icons } from "@/components/ui/icons/Icons";
import LoadingState from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { useToast } from "@features/notifications/components/atoms/Toast";

const FormLogin: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, isAuthenticated, loading } = useAuthStore();
  const { toast } = useToast();
  const [showEmailAlt, setShowEmailAlt] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <LoadingState />;

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      toast.error(err?.message || 'Error al iniciar sesión.');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'register') {
        await registerWithEmail(form.email, form.password, form.name);
      } else {
        await loginWithEmail(form.email, form.password);
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        toast.error('Credenciales incorrectas o usuario no registrado.');
      } else if (err.code === 'auth/email-already-in-use') {
        toast.error('El correo ya está en uso. Intentá iniciar sesión.');
      } else {
        toast.error(err?.message || 'No se pudo procesar la solicitud.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-sm mx-auto text-itec-text space-y-4 bg-itec-box border border-itec-border p-4 sm:p-6 rounded-[2rem] shadow-sm">
        <div className="text-center pb-1">
          <img 
            src="/mascot/TEC-Euforico.webp" alt="Mascota iTEC" width="130" className="mx-auto" 
            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/logo.png"; }}
          />
          <div className="mt-2">
            <h3 className="text-white text-2xl font-bold sm:text-3xl tracking-tight">Iniciá sesión</h3>
            <p className="text-itec-muted text-sm mt-2">Plataforma exclusiva para estudiantes</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-medium text-sm text-itec-muted mb-1.5 block">Correo Institucional</label>
            <div className="relative">
              <Input disabled fullWidth value="usuario@frba.utn.edu.ar" className="pl-10 py-2.5 opacity-50 cursor-not-allowed bg-black/20 border border-white/5 rounded-xl text-itec-gray" />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted opacity-50" />
            </div>
          </div>
          <div>
            <label className="font-medium text-sm text-itec-muted mb-1.5 block">Contraseña</label>
            <div className="relative">
              <Input disabled fullWidth type="password" value="••••••••••••" className="pl-10 py-2.5 opacity-50 cursor-not-allowed bg-black/20 border border-white/5 rounded-xl text-itec-gray" />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted opacity-50" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-itec-muted pt-1 pb-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-itec-emerald" />
              <span>Autenticación segura</span>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={handleGoogle} variant="danger" hierarchy="solid" fullWidth className="py-3 text-sm font-bold flex items-center justify-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center"><Icons type="google" className="size-5" /></div>
              Continuar con Google
            </Button>
          </div>
          
          <div className="flex items-center justify-center">
             <button type="button" onClick={() => setShowEmailAlt(!showEmailAlt)} className="text-[10px] uppercase font-bold text-itec-gray hover:text-white transition-colors mt-2 tracking-widest">
               Ingreso manual (No-Google)
             </button>
          </div>

          {showEmailAlt && (
            <div className="pt-3 border-t border-itec-border mt-1 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-itec-muted">
                <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? 'text-white' : ''}>Iniciar sesión</button>
                <span>·</span>
                <button type="button" onClick={() => setMode('register')} className={mode === 'register' ? 'text-white' : ''}>Crear cuenta</button>
              </div>

              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                {mode === 'register' && (
                  <Input fullWidth placeholder="Tu Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="py-2.5 px-3 bg-transparent border border-itec-border rounded-xl" />
                )}
                <Input type="email" required fullWidth placeholder="usuario@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="py-2.5 px-3 bg-transparent border border-itec-border rounded-xl" />
                <Input type="password" required fullWidth placeholder="contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="py-2.5 px-3 bg-transparent border border-itec-border rounded-xl" />
                <Button type="submit" variant="secondary" hierarchy="solid" fullWidth isLoading={submitting} className="py-2.5 text-xs font-bold">
                  {mode === 'register' ? 'Registrarse' : 'Ingresar'}
                </Button>
              </form>
            </div>
          )}
        </div>
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
