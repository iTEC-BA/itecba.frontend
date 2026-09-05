import React, { useEffect, useState } from "react";
import { useAuthStore } from '@/stores/authStore';
import { auth } from "@/lib/firebase";
import { profileService } from "@features/profile/services/profileService";
import { Input } from "@/components/ui/Input";
import { Button } from "@components/ui/Button";
import { User, CreditCard, Phone, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";

export const ProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    name:      "",
    email:     "",
    dni:       "",
    specialty: "",
    phone:     "",
    legajo:    "",
  });
  const [error,    setError]    = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name:      user.name      ?? "",
        email:     user.email     ?? "",
        dni:       user.dni       ?? "",
        specialty: (user as any).specialty ?? "",
        phone:     (user as any).phone     ?? "",
        legajo:    user.legajo    ?? "",
      }));
    }
  }, [user]);

  const handleRequestCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.dni || !formData.phone || !formData.specialty) {
      setError("Completá nombre, DNI, teléfono y carrera principal para continuar.");
      return;
    }

    if (!user?.id) { setError("Sesión no válida."); return; }

    setIsSaving(true);
    try {
      const token = (await auth.currentUser?.getIdToken()) ?? "";

      const payload = {
        displayName: formData.name.trim(),
        dni:         formData.dni.trim(),
        legajo:      formData.legajo.trim() || formData.dni.trim(),
        specialty:   formData.specialty.trim(),
        phone:       formData.phone.trim(),
      };

      await profileService.updateProfile(user.id, token, payload);

      await updateProfile({
        name:      payload.displayName,
        dni:       payload.dni,
        legajo:    payload.legajo,
        specialty: payload.specialty,
        ...(payload as any),
      });
    } catch {
      setError("Ocurrió un error al guardar tus datos.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-transparent text-itec-text rounded-xl pl-10 py-2.5 outline-none focus:border-itec-red-skye transition-colors";

  return (
    <div className="w-full bg-itec-box border border-itec-border rounded-[2rem] overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Lado izquierdo: Mascota y contexto */}
        <div className="md:w-1/3 bg-itec-red/5 border-b md:border-b-0 md:border-r border-itec-red/10 p-8 flex flex-col items-center justify-center text-center">
          <img
            src="/mascot/TEC-Euforico.webp"
            alt="Mascota iTEC"
            className="w-32 h-32 object-contain mb-6 transition-transform duration-300 hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/logo.png"; }}
          />
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Tu Credencial iTEC</h2>
          <p className="text-sm text-itec-text/70 leading-relaxed">
            Completá tus datos de manera opcional para generar tu <strong className="text-itec-red-skye">TarjeTEC</strong>. Con ella activarás beneficios exclusivos, acceso rápido y seguimiento detallado de tu carrera.
          </p>
        </div>

        {/* Lado derecho: Formulario segmentado */}
        <div className="md:w-2/3 p-8">
          <form onSubmit={handleRequestCard} className="flex flex-col gap-8">
            
            {/* --- Sección 1: Datos Personales --- */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <User className="w-4 h-4 text-itec-red-skye" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Datos Personales</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Nombre completo</label>
                  <div className="relative">
                    <Input fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Tu nombre y apellido" className={inputClass} />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">DNI</label>
                  <div className="relative">
                    <Input fullWidth value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} placeholder="Documento" className={inputClass} />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Teléfono</label>
                  <div className="relative">
                    <Input fullWidth value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+54 9..." className={inputClass} />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted" />
                  </div>
                </div>
              </div>
            </div>

            {/* --- Sección 2: Información Académica --- */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <BookOpen className="w-4 h-4 text-itec-red-skye" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Perfil Académico</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Legajo</label>
                  <div className="relative">
                    <Input fullWidth value={formData.legajo} onChange={(e) => setFormData({ ...formData, legajo: e.target.value })} placeholder="Ej: 123456-7" className={inputClass} />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Carrera principal</label>
                  <div className="relative">
                    <Input fullWidth value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} placeholder="Ej: Sistemas" className={inputClass} />
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted" />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/5">
              <Button variant="danger" hierarchy="solid" type="submit" isLoading={isSaving} className="px-8 py-3 text-sm">
                Generar TarjeTEC
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
