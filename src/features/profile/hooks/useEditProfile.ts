import { useState, useCallback } from "react";
import { useAuth } from "@context/AuthContext";
import type { CareerOption } from "@features/profile/components/molecules/CareerSelector";
import { CARRERAS_LIST } from "@features/profile/data/carreras";
interface ProfileForm {
  name: string;
  dni: string;
  legajo: string;
  phone?: string;
  startYear?: number;
}
export const useEditProfile = (onSuccess?: () => void) => {
  const { user, updateProfile } = useAuth();
  const getInitialCareers = (): CareerOption[] => {
    if (!user?.specialty) return [];
    const specs = Array.isArray((user as any).specialty)
      ? (user as any).specialty
      : [(user as any).specialty];
    return specs
      .map((s: string) => CARRERAS_LIST.find((c) => c.name === s))
      .filter(Boolean) as CareerOption[];
  };
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name ?? "",
    dni: user?.dni ?? "",
    legajo: user?.legajo ?? "",
    phone: (user as any)?.phone ?? "",
    startYear: (user as any)?.startYear ?? undefined,
  });
  const [careers, setCareers] = useState<CareerOption[]>(getInitialCareers);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setField = useCallback(
    <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      if (!form.name.trim()) {
        setError("El nombre es obligatorio.");
        return;
      }
      if (!form.dni.trim()) {
        setError("El DNI es obligatorio.");
        return;
      }
      if (careers.length === 0) {
        setError("Seleccioná al menos 1 carrera.");
        return;
      }
      setSaving(true);
      setError(null);
      try {
        await updateProfile({
          name: form.name.trim(),
          dni: form.dni.trim(),
          legajo: form.legajo.trim(),
          phone: form.phone?.trim(),
          specialty: careers[0].name,
          ...(careers as any),
          startYear: form.startYear,
        } as any);
        onSuccess?.();
      } catch (err: any) {
        setError(err.message ?? "Error al guardar. Intentá de nuevo.");
      } finally {
        setSaving(false);
      }
    },
    [form, careers, user, updateProfile, onSuccess],
  );
  return { form, setField, careers, setCareers, saving, error, handleSubmit };
};
