import React from "react";
import { useEditProfile } from "@features/profile/hooks/useEditProfile";
import { CareerSelector } from "@features/profile/components/molecules/CareerSelector";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { LayoutModal } from "@/components/templates/LayoutModal";

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { form, setField, careers, setCareers, saving, error, handleSubmit } = useEditProfile(onClose);

  const labelCls = "block text-[10px] font-black text-itec-muted uppercase tracking-[0.15em] mb-2";

  return (
    <LayoutModal
      isOpen={true} // Se asume abierto porque el padre controla el renderizado
      onClose={onClose}
      title="Editar perfil"
      description="Actualizá tus datos académicos y de contacto."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Nombre completo</label>
            <Input
              fullWidth
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className={labelCls}>DNI</label>
            <Input
              fullWidth
              value={form.dni}
              onChange={(e) => setField("dni", e.target.value)}
              placeholder="Documento"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Legajo</label>
            <Input
              fullWidth
              value={form.legajo}
              onChange={(e) => setField("legajo", e.target.value)}
              placeholder="Legajo"
            />
          </div>
          <div>
            <label className={labelCls}>Año de ingreso</label>
            <Input
              fullWidth
              type="number"
              min="1990"
              max={new Date().getFullYear()}
              value={form.startYear ?? ""}
              onChange={(e) => setField("startYear", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ej: 2022"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Teléfono</label>
            <Input
              fullWidth
              value={form.phone ?? ""}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+54 9..."
            />
          </div>
          <div>
            <label className={labelCls}>Carreras</label>
            <CareerSelector value={careers} onChange={setCareers} max={2} />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 flex-row sm:justify-end pt-4 border-t border-white/5 mt-6">
          <Button
            variant="slate"
            hierarchy="ghost"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            hierarchy="solid"
            type="submit"
            isLoading={saving}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </LayoutModal>
  );
};