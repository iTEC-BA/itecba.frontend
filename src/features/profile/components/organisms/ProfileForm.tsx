import React, { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@components/ui/Button";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";

export const ProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dni: "",
    specialty: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        dni: user.dni || "",
        specialty: (user as any).specialty || "",
        phone: (user as any).phone || "",
      }));
    }
  }, [user]);

  const handleRequestCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.dni || !formData.phone || !formData.specialty) {
      setError("Completá nombre, DNI, teléfono y carrera.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        dni: formData.dni,
        legajo: formData.dni,
        specialty: formData.specialty,
        phone: formData.phone,
      } as any);
    } catch {
      setError("Ocurrió un error al guardar tus datos.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <GlassCard variant="elevated" className="p-5 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">TarjeTEC</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-itec-text">Solicitar credencial</h2>
            <p className="mt-2 max-w-2xl text-sm text-itec-muted">
              Completá tus datos para generar tu credencial y activar beneficios, acceso y seguimiento académico.
            </p>
          </div>
          <div className="rounded-2xl border border-itec-border bg-itec-surface px-4 py-3 text-sm font-bold text-itec-text">
            Credencial digital
          </div>
        </div>

        <form onSubmit={handleRequestCard} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">Nombre completo</label>
            <Input fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Tu nombre y apellido" />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">DNI</label>
            <Input fullWidth value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} placeholder="Documento" />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">Teléfono</label>
            <Input fullWidth value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+54 9..." />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">Carrera</label>
            <Input fullWidth value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} placeholder="Ingeniería..." />
          </div>

          {error && (
            <div className="md:col-span-2 rounded-2xl border border-itec-accent/20 bg-itec-accent/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="slate" hierarchy="outline" type="button">
              Más tarde
            </Button>
            <Button variant="primary" hierarchy="solid" type="submit" isLoading={isSaving}>
              Generar TarjeTEC
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
