import { useState, useCallback } from "react";
import { useAuth } from "@context/AuthContext";
import { auth } from "@/lib/firebase";
import { profileService } from "@features/profile/services/profileService";
import type { CareerOption } from "@features/profile/components/molecules/CareerSelector";

interface ProfileForm {
  name: string;
  dni: string;
  legajo: string;
  phone?: string;
  bio?: string;
  github?: string;
  startYear?: number;
}

interface UserProfileExtras {
  careers?: CareerOption[];
  phone?: string;
  bio?: string;
  github?: string;
  startYear?: number;
}

const getProfileExtras = (user: ReturnType<typeof useAuth>["user"]): UserProfileExtras =>
  (user ? (user as unknown as UserProfileExtras) : {});

const getInitialCareers = (user: ReturnType<typeof useAuth>["user"]): CareerOption[] => {
  if (!user) return [];
  const rawCareers = getProfileExtras(user).careers;
  if (Array.isArray(rawCareers) && rawCareers.length > 0) {
    return rawCareers.map((c: { code: string; name: string }) => ({
      code: c.code, 
      name: c.name
    }));
  }
  if (user.specialty) {
    return [{ 
      code: user.specialty.substring(0, 3).toUpperCase(), 
      name: user.specialty 
    }];
  }
  return [];
};

export const useEditProfile = (onSuccess?: () => void) => {
  const { user, updateProfile } = useAuth();
  const profileExtras = getProfileExtras(user);

  const [form, setForm] = useState<ProfileForm>({
    name:      user?.name      ?? "",
    dni:       user?.dni       ?? "",
    legajo:    user?.legajo    ?? "",
    phone:     profileExtras.phone     ?? "",
    bio:       profileExtras.bio       ?? "",
    github:    profileExtras.github    ?? "",
    startYear: profileExtras.startYear ?? undefined,
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

      if (!form.name.trim()) { setError("El nombre es obligatorio."); return; }
      if (!form.dni.trim())  { setError("El DNI es obligatorio."); return; }
      if (careers.length === 0) { setError("Seleccioná al menos 1 carrera."); return; }

      setSaving(true);
      setError(null);

      try {
        const token = (await auth.currentUser?.getIdToken()) ?? "";

        const payload = {
          displayName: form.name.trim(),
          dni:         form.dni.trim(),
          legajo:      form.legajo.trim(),
          phone:       form.phone?.trim() ?? "",
          bio:         form.bio?.trim() ?? "",
          github:      form.github?.trim() ?? "",
          specialty:   careers[0].name,
          careers:     careers.map((c) => ({ code: c.code, name: c.name })),
          ...(form.startYear !== undefined && { startYear: form.startYear }),
        };

        await profileService.updateProfile(user.id, token, payload);

        await updateProfile({
          name:      payload.displayName,
          dni:       payload.dni,
          legajo:    payload.legajo,
          specialty: payload.specialty,
          phone:     payload.phone,
          ...(payload.startYear !== undefined && { startYear: payload.startYear }),
        });

        onSuccess?.();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al guardar. Intentá de nuevo.");
      } finally {
        setSaving(false);
      }
    },
    [form, careers, user, updateProfile, onSuccess]
  );

  return { form, setField, careers, setCareers, saving, error, handleSubmit };
};