import React from "react";
import { useEditProfile } from "@features/profile/hooks/useEditProfile";
import { CareerSelector } from "@features/profile/components/molecules/CareerSelector";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { LayoutModal } from "@/components/templates/LayoutModal";
import { Icons } from "@/components/ui/icons/Icons";
import { Lock, User, Phone, BookOpen, Calendar, ShieldCheck } from "lucide-react";

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { form, setField, careers, setCareers, saving, error, handleSubmit } = useEditProfile(onClose);

  const labelCls = "block text-xs font-semibold text-itec-muted mb-1.5";

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title="Configuración de Perfil"
      description="Actualizá tu información pública y de contacto."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        
        {/* Sección de Datos Institucionales (Bloqueados Visualmente en Rojo y Sin Bordes Internos) */}
        <div className="bg-itec-red/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Lock className="w-32 h-32 text-itec-red-skye" />
          </div>
          <div className="flex items-center gap-2 mb-6 border-b border-itec-red/10 pb-3 relative z-10">
            <ShieldCheck className="w-5 h-5 text-itec-red-skye" />
            <h3 className="text-sm font-bold text-white">Datos Institucionales</h3>
            <span className="ml-auto text-[10px] bg-itec-red/20 text-itec-red-skye px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Solo Lectura</span>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2 relative z-10">
            <div className="relative">
              <label className={labelCls}>Nombre completo</label>
              <div className="relative">
                <Input fullWidth value={form.name} disabled className="opacity-50 cursor-not-allowed bg-black/40 border-transparent pl-10 text-itec-red-skye" />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-red-skye opacity-50" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-itec-red-skye/70" />
              </div>
            </div>
            <div className="relative">
              <label className={labelCls}>DNI</label>
              <div className="relative">
                <Input fullWidth value={form.dni} disabled className="opacity-50 cursor-not-allowed bg-black/40 border-transparent pl-10 text-itec-red-skye" />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-red-skye opacity-50" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-itec-red-skye/70" />
              </div>
            </div>
            <div className="relative">
              <label className={labelCls}>Legajo</label>
              <div className="relative">
                <Input fullWidth value={form.legajo} disabled className="opacity-50 cursor-not-allowed bg-black/40 border-transparent pl-10 text-itec-red-skye" />
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-red-skye opacity-50" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-itec-red-skye/70" />
              </div>
            </div>
            <div className="relative">
              <label className={labelCls}>Año de ingreso</label>
              <div className="relative">
                <Input fullWidth type="number" value={form.startYear ?? ""} disabled className="opacity-50 cursor-not-allowed bg-black/40 border-transparent pl-10 text-itec-red-skye" />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-red-skye opacity-50" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-itec-red-skye/70" />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Datos Editables (Rojo Dominante) */}
        <div className="bg-itec-box border border-itec-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
            <User className="w-5 h-5 text-itec-red-skye" />
            <h3 className="text-sm font-bold text-white">Información Pública</h3>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelCls}>Teléfono de Contacto</label>
              <div className="relative">
                <Input fullWidth value={form.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} placeholder="+54 9..." className="pl-10 focus:border-itec-red-skye bg-white/5 border-transparent" />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted" />
              </div>
            </div>
            <div>
              <label className={labelCls}>GitHub / Portfolio (URL)</label>
              <div className="relative">
                <Input fullWidth value={form.github ?? ""} onChange={(e) => setField("github", e.target.value)} placeholder="https://..." className="pl-10 focus:border-itec-red-skye bg-white/5 border-transparent" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted flex items-center justify-center">
                  <Icons type="github" className="size-4" />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Carreras Activas</label>
              <CareerSelector value={careers} onChange={setCareers} max={5} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Biografía Breve</label>
              <textarea 
                value={form.bio ?? ""} 
                onChange={(e) => setField("bio", e.target.value)} 
                placeholder="Contanos un poco sobre vos..." 
                className="w-full bg-white/5 border border-transparent text-itec-text rounded-xl p-3 text-sm min-h-[100px] outline-none focus:border-itec-red-skye transition-colors resize-y custom-scrollbar"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="flex gap-3 flex-row justify-end pt-2">
          <Button variant="slate" hierarchy="ghost" type="button" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="danger" hierarchy="solid" type="submit" isLoading={saving}>
            Guardar Cambios
          </Button>
        </div>
      </form>
    </LayoutModal>
  );
};
