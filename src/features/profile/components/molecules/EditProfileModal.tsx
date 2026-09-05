import React from "react";
import { useEditProfile } from "@features/profile/hooks/useEditProfile";
import { CareerSelector } from "@features/profile/components/molecules/CareerSelector";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { LayoutModal } from "@/components/templates/LayoutModal";
import { Icons } from "@/components/ui/icons/Icons";

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { form, setField, careers, setCareers, saving, error, handleSubmit } = useEditProfile(onClose);

  const labelCls = "block text-[10px] font-bold text-itec-muted uppercase tracking-[0.15em] mb-2";

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title="Editar perfil"
      description="Actualizá tus datos personales de contacto y trayectoria."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-1">
        {/* Sección de Datos Institucionales (Bloqueados) */}
        <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Icons type="lock" className="w-4 h-4 text-itec-gray" />
            <h3 className="text-xs font-bold text-itec-gray uppercase tracking-widest">
              Datos Institucionales (No modificables)
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Nombre completo</label>
              <Input fullWidth value={form.name} disabled className="opacity-50 cursor-not-allowed bg-black/20" />
            </div>
            <div>
              <label className={labelCls}>DNI</label>
              <Input fullWidth value={form.dni} disabled className="opacity-50 cursor-not-allowed bg-black/20" />
            </div>
            <div>
              <label className={labelCls}>Legajo</label>
              <Input fullWidth value={form.legajo} disabled className="opacity-50 cursor-not-allowed bg-black/20" />
            </div>
            <div>
              <label className={labelCls}>Año de ingreso</label>
              <Input fullWidth type="number" value={form.startYear ?? ""} disabled className="opacity-50 cursor-not-allowed bg-black/20" />
            </div>
          </div>
        </div>

        {/* Sección de Datos Editables */}
        <div className="bg-itec-box border border-itec-border rounded-[1.5rem] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Icons type="user" className="w-4 h-4 text-itec-text" />
            <h3 className="text-xs font-bold text-itec-text uppercase tracking-widest">
              Información Pública y Contacto
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Teléfono</label>
              <Input fullWidth value={form.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} placeholder="+54 9..." />
            </div>
            <div>
              <label className={labelCls}>Carreras</label>
              <CareerSelector value={careers} onChange={setCareers} max={5} />
            </div>
            <div>
              <label className={labelCls}>GitHub / Portfolio</label>
              <Input fullWidth value={form.github ?? ""} onChange={(e) => setField("github", e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Biografía (Opcional)</label>
              <Input fullWidth value={form.bio ?? ""} onChange={(e) => setField("bio", e.target.value)} placeholder="Un poco sobre vos..." />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="flex gap-3 flex-row sm:justify-end pt-4 border-t border-white/5">
          <Button variant="slate" hierarchy="ghost" type="button" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" hierarchy="solid" type="submit" isLoading={saving}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </LayoutModal>
  );
};
