// src/features/points/components/PointsActivityManager.tsx
//
// Panel de admin para gestionar las actividades de puntos.
// Añadir en la sección de admin (RewardsManagement u otra) como:
//   import { PointsActivityManager } from "@features/points/components/PointsActivityManager";
//   <PointsActivityManager />

import React, { useState, useEffect, useCallback } from "react";
import { getAuth }              from "firebase/auth";
import { getAdminActivities, updateActivity } from "../services/points.service";
import type { PointActivity }   from "../points.types";

const cell = "px-4 py-3 text-sm text-gray-300";
const input = "w-full bg-itec-bg border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-itec-red";

export const PointsActivityManager: React.FC = () => {
  const [activities, setActivities] = useState<PointActivity[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [edited,     setEdited]     = useState<Record<string, Partial<PointActivity>>>({});

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fbUser = getAuth().currentUser;
      if (!fbUser) throw new Error("No autenticado");
      const token = await fbUser.getIdToken();
      const data  = await getAdminActivities(token);
      setActivities(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const handleChange = (id: string, field: keyof PointActivity, value: unknown) => {
    setEdited((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [field]: value },
    }));
  };

  const handleSave = async (activity: PointActivity) => {
    const id      = activity._id!;
    const changes = edited[id];
    if (!changes || Object.keys(changes).length === 0) return;

    setSaving(id);
    try {
      const fbUser = getAuth().currentUser!;
      const token  = await fbUser.getIdToken();
      const updated = await updateActivity(id, changes, token);
      setActivities((prev) => prev.map((a) => (a._id === id ? updated : a)));
      setEdited((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } catch (err) {
      alert(`Error al guardar: ${(err as Error).message}`);
    } finally {
      setSaving(null);
    }
  };

  const getValue = <K extends keyof PointActivity>(
    activity: PointActivity,
    field: K,
  ): PointActivity[K] => {
    const id = activity._id!;
    return (edited[id]?.[field] as PointActivity[K]) ?? activity[field];
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 text-sm py-8">
      <span className="w-4 h-4 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
      Cargando actividades...
    </div>
  );

  if (error) return (
    <div className="text-red-400 text-sm py-4">Error: {error}</div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-base">Actividades de Puntos</h3>
        <button
          onClick={fetchActivities}
          className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
        >
          Refrescar
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-xs text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Actividad</th>
              <th className="px-4 py-3">Puntos</th>
              <th className="px-4 py-3">Cooldown (min)</th>
              <th className="px-4 py-3">Cap diario</th>
              <th className="px-4 py-3">Activa</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {activities.map((act) => {
              const id       = act._id!;
              const isDirty  = !!(edited[id] && Object.keys(edited[id]).length > 0);
              const isSaving = saving === id;

              return (
                <tr key={id} className="hover:bg-white/3 transition-colors">
                  <td className={cell}>
                    <div className="font-medium text-white">{act.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 font-mono">{act.key}</div>
                  </td>

                  <td className={cell}>
                    <input
                      type="number"
                      min={0}
                      className={input}
                      value={String(getValue(act, "points"))}
                      onChange={(e) => handleChange(id, "points", Number(e.target.value))}
                    />
                  </td>

                  <td className={cell}>
                    <input
                      type="number"
                      min={0}
                      className={input}
                      value={String(getValue(act, "cooldownMinutes"))}
                      onChange={(e) => handleChange(id, "cooldownMinutes", Number(e.target.value))}
                    />
                  </td>

                  <td className={cell}>
                    <input
                      type="number"
                      min={0}
                      className={input}
                      value={String(getValue(act, "dailyCap"))}
                      onChange={(e) => handleChange(id, "dailyCap", Number(e.target.value))}
                    />
                  </td>

                  <td className={cell}>
                    <button
                      onClick={() => handleChange(id, "isActive", !getValue(act, "isActive"))}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        getValue(act, "isActive") ? "bg-green-500" : "bg-gray-600"
                      }`}
                      aria-label={getValue(act, "isActive") ? "Desactivar" : "Activar"}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          getValue(act, "isActive") ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>

                  <td className={cell}>
                    <button
                      onClick={() => handleSave(act)}
                      disabled={!isDirty || isSaving}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isDirty
                          ? "bg-itec-red text-white hover:bg-red-600"
                          : "bg-white/5 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isSaving ? "Guardando…" : "Guardar"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Los cambios aplican inmediatamente. La caché del cliente se invalida al guardar.
      </p>
    </div>
  );
};
