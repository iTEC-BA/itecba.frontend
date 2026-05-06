// src/features/admin/components/organisms/RewardsManagement.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icons } from "@/components/ui/icons/Icons";
import { Reward, RewardType } from "@features/rewards/types/rewards";
import { rewardsService } from "@features/rewards/services/rewardsService";
import { adminRewardsService } from "../../services/adminRewardsService";
import { getAuth } from "firebase/auth";

export const RewardsManagement: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    title: "",
    description: "",
    pointsCost: 100,
    type: "mentorship" as RewardType,
    icon: "star",
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchRewards = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        const data = await rewardsService.getAvailableRewards(token);
        setRewards(data);
      }
    } catch (error) {
      console.error("Error cargando beneficios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        await adminRewardsService.createReward(formData, token);
        setIsModalOpen(false);
        setFormData(initialFormState);
        await fetchRewards(); // Refrescar vista
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-itec-box border border-itec-gray/10 p-5 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-itec-text flex items-center gap-2">
            <Icons type="star" className="w-5 h-5 text-itec-rewards" />
            Gestión de Beneficios
          </h2>
          <p className="text-sm text-itec-text mt-1">
            Administra los beneficios canjeables por puntos.
          </p>
        </div>
        <Button
          variant="admin"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
          icon="settings"
          text="Agregar Beneficio"
        />
      </div>

      {isLoading ? (
        <div className="animate-pulse h-40 bg-itec-box border border-itec-gray/10"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward: any) => {
            const uniqueKey = reward._id || reward.id; // Clave única segura
            return (
              <div
                key={uniqueKey}
                className=" bg-itec-box border border-itec-gray/10 rounded-xl p-5 flex flex-col hover:border-itec-blue/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-md bg-[#1a1a1a] flex items-center justify-center text-itec-rewards">
                    <Icons type={reward.icon as any} className="w-4 h-4" />
                  </div>
                  <h3 className="text-itec-textfont-semibold flex-1 truncate">
                    {reward.title}
                  </h3>
                </div>
                <p className="text-sm text-itec-text mb-4 line-clamp-2 flex-1">
                  {reward.description}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-[#333]">
                  <span className="text-xs px-2 py-1 bg-[#1a1a1a] rounded text-gray-300 capitalize">
                    {reward.type.replace("_", " ")}
                  </span>
                  <span className="text-itec-blue font-bold">
                    {reward.pointsCost} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL MANTIENE SU ESTRUCTURA ORIGINAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Agregar Beneficio
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-itec-text hover:text-white"
              >
                <Icons type="close" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-itec-text mb-1">
                  Título del beneficio
                </label>
                <Input
                  type="text"
                  required
                  fullWidth
                  value={formData.title}
                  placeholder="Ej: Mentoría Web"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-itec-text mb-1">
                  Descripción
                </label>
                <textarea
                  className="w-full bg-[#0a0a0a] border border-[#262626] text-itec-text px-4 py-2 rounded-lg focus:outline-none focus:border-itec-blue resize-none"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-itec-text mb-1">
                    Costo en Puntos
                  </label>
                  <Input
                    type="number"
                    required
                    fullWidth
                    min="1"
                    value={formData.pointsCost.toString()}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pointsCost: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-itec-text mb-1">
                    Tipo de Canje
                  </label>
                  <select
                    className="w-full bg-[#0a0a0a] border border-[#262626] text-itec-text px-4 py-[10px] rounded-lg focus:outline-none focus:border-itec-blue appearance-none"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as RewardType,
                      })
                    }
                  >
                    <option value="mentorship">Mentoría / Llamada</option>
                    <option value="group_access">Acceso a Grupo</option>
                    <option value="discount">Descuento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-itec-text mb-1">
                  Ícono (Nombre exacto en UI/Icons)
                </label>
                <Input
                  type="text"
                  required
                  fullWidth
                  value={formData.icon}
                  placeholder="Ej: star, users, bookmark"
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Crear Beneficio"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
