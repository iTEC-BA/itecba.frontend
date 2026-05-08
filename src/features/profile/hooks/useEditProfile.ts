// useEditProfile.ts — reescrito por fix-profile.sh
// Flujo: validar → obtener token Firebase → PATCH /api/users/:uid/profile → sync AuthContext
import { useState, useCallback } from "react";
import { useAuth } from "@context/AuthContext";
import { auth } from "@/lib/firebase";
import { profileService } from "@features/profile/services/profileService";
import type { CareerOption } from "@features/profile/components/molecules/CareerSelector";
import { CARRERAS_LIST } from "@features/profile/data/carreras";

interface ProfileForm {
  name: string;
  dni: string;
  legajo: string;
  phone?: string;
  startYear?: number;
}

const getInitialCareers = (user: ReturnType<typeof useAuth>["user"]): CareerOption[] => {
  if (!user) return [];
  const rawCareers = (user as any).careers;
  if (Array.isArray(rawCareers) && rawCareers.length > 0) {
    return rawCareers.map((c: { code: string; name: string }) => {
      const found = CARRERAS_LIST.find((l) => l.code === c.code);
      return found ?? { code: c.code, name: c.name };
    });
  }
  if (user.specialty) {
    const found = CARRERAS_LIST.find((l) => l.name === user.specialty);
    return found ? [found] : [];
  }
  return [];
};

export const useEditProfile = (onSuccess?: () => void) => {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState<ProfileForm>({
    name:      user?.name      ?? "",
    dni:       user?.dni       ?? "",
    legajo:    user?.legajo    ?? "",
    phone:     (user as any)?.phone     ?? "",
    startYear: (user as any)?.startYear ?? undefined,
  });

  const [careers, setCareers] = useState<CareerOption[]>(() => getInitialCareers(user));
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const setField = useCallback(
    <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user?.id) return;

      // — Validaciones —
      if (!form.name.trim()) { setError("El nombre es obligatorio."); return; }
      if (!form.dni.trim())  { setError("El DNI es obligatorio."); return; }
      if (careers.length === 0) { setError("Seleccioná al menos 1 carrera."); return; }

      setSaving(true);
      setError(null);

      try {
        // 1. Obtener token de Firebase (necesario para autenticar el PATCH al backend)
        const token = (await auth.currentUser?.getIdToken()) ?? "";

        const payload = {
          displayName: form.name.trim(),
          dni:         form.dni.trim(),
          legajo:      form.legajo.trim(),
          phone:       form.phone?.trim() ?? "",
          specialty:   careers[0].name,
          careers:     careers.map((c) => ({ code: c.code, name: c.name })),
          ...(form.startYear !== undefined && { startYear: form.startYear }),
        };

        // 2. Actualizar en el backend (valida + persiste en Firestore via Admin SDK)
        await profileService.updateProfile(user.id, token, payload);

        // 3. Sincronizar estado local (AuthContext) para que la UI refleje los cambios
        await updateProfile({
          name:      payload.displayName,
          dni:       payload.dni,
          legajo:    payload.legajo,
          specialty: payload.specialty,
          ...(payload as any),
        });

        onSuccess?.();
      } catch (err: any) {
        setError(err.message ?? "Error al guardar. Intentá de nuevo.");
      } finally {
        setSaving(false);
      }
    },
    [form, careers, user, updateProfile, onSuccess]
  );

  return { form, setField, careers, setCareers, saving, error, handleSubmit };
};
