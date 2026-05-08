import React, { useState, useEffect } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { RewardTypeBadge } from "@features/rewards/components/atoms/RewardTypeBadge";
import { PointsBadge } from "@features/rewards/components/atoms/PointsBadge";
import { RewardStatusDot } from "@features/rewards/components/atoms/RewardStatusDot";
import { RewardTierBadge } from "@features/rewards/components/atoms/RewardTierBadge";
import { RewardFormModal } from "@features/rewards/components/organisms/RewardFormModal";
import { DeleteRewardModal } from "@features/rewards/components/organisms/DeleteRewardModal";
import { rewardsService } from "@features/rewards/services/rewardsService";
import { useRewardAdmin } from "@features/rewards/hooks/useRewardAdmin";
import type { Reward, RewardFormData } from "@features/rewards/types/rewards";
import { getAuth } from "firebase/auth";

const getToken = async () => {
  const u = getAuth().currentUser;
  if (!u) throw new Error("No autenticado");
  return u.getIdToken();
};

export const RewardsManagement: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deletingReward, setDeletingReward] = useState<Reward | null>(null);
  const [search, setSearch] = useState("");

  const fetchRewards = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const data = await rewardsService.getAllRewards(token);
      setRewards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando rewards:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchRewards(); }, []);

  const adminHook = useRewardAdmin(fetchRewards);

  const handleSubmit = async (data: RewardFormData): Promise<boolean> => {
    if (editingReward) {
      const id = (editingReward as any)._id || editingReward.id;
      const ok = await adminHook.updateReward(id, data);
      if (ok) setEditingReward(null);
      return ok;
    } else {
      const ok = await adminHook.createReward(data);
      if (ok) setIsAddOpen(false);
      return ok;
    }
  };

  const handleDelete = async () => {
    if (!deletingReward) return;
    const ok = await adminHook.deleteReward(deletingReward);
    if (ok) setDeletingReward(null);
  };

  const filtered = rewards.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-itec-box border border-itec-border rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-itec-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-itec-rewards/12 border border-itec-rewards/20 flex items-center justify-center">
            <Icons type="star" className="size-4 text-itec-rewards" />
          </div>
          <div>
            <p className="text-sm font-bold text-itec-text leading-none">Beneficios</p>
            <p className="text-[10px] text-itec-text/40 mt-0.5">
              {rewards.length} beneficios
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-itec-rewards/12 border border-itec-rewards/25 text-itec-rewards text-xs font-bold hover:bg-itec-rewards/20 transition-all active:scale-95"
        >
          <Icons type="plus" className="size-3.5" />
          Agregar
        </button>
      </div>

      <div className="px-4 py-3 border-b border-itec-border">
        <div className="relative">
          <Icons
            type="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-itec-text/30"
          />
          <input
            type="text"
            placeholder="Buscar beneficio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-itec-bg border border-itec-border rounded-xl pl-8 pr-3 py-2.5 text-xs text-itec-text placeholder:text-itec-text/30 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      <div className="divide-y divide-itec-border/50">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 px-5 py-3 animate-pulse">
              <div className="h-full bg-white/4 rounded-xl" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-itec-text/30 text-sm">Sin resultados</p>
          </div>
        ) : (
          filtered.map((r: any) => {
            const id = r._id || r.id;
            return (
              <div
                key={id}
                className="group flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <RewardStatusDot active={r.isActive !== false} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-itec-text truncate">{r.title}</p>
                    {r.tier && <RewardTierBadge tier={r.tier} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <RewardTypeBadge type={r.type} />
                    <PointsBadge points={r.pointsCost} size="xs" showLabel />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setEditingReward({ ...r, id })}
                    className="h-8 px-3 flex items-center gap-1 rounded-lg bg-itec-blue-skye/10 border border-itec-blue-skye/20 text-itec-blue-skye text-xs font-bold hover:bg-itec-blue-skye/20 transition-colors"
                  >
                    <Icons type="edit" className="size-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => setDeletingReward({ ...r, id })}
                    className="h-8 px-3 flex items-center gap-1 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400 text-xs font-bold hover:bg-red-500/15 transition-colors"
                  >
                    <Icons type="trash" className="size-3" />
                    Borrar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {(isAddOpen || !!editingReward) && (
        <RewardFormModal
          editingReward={editingReward}
          isLoading={adminHook.isSubmitting}
          onClose={() => { setIsAddOpen(false); setEditingReward(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {deletingReward && (
        <DeleteRewardModal
          reward={deletingReward}
          isLoading={adminHook.isSubmitting}
          onClose={() => setDeletingReward(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};
