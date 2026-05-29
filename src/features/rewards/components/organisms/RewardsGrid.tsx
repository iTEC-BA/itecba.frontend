import React, { useState, useMemo } from "react";
import { Icons } from "@components/ui/icons/Icons";
import { RewardCard } from "../molecules/RewardCard";
import { RewardCardFeatured } from "../molecules/RewardCardFeatured";
import { RewardFilterTabs } from "../molecules/RewardFilterTabs";
import { RedeemModal } from "./RedeemModal";
import { RewardSuccessModal } from "./RewardSuccessModal";
import { DeleteRewardModal } from "./DeleteRewardModal";
import { RewardFormModal } from "./RewardFormModal";
import { SkeletonCard } from "../atoms/SkeletonCard";
import { EmptyState } from "../atoms/EmptyState";
import { useRewards } from "../../hooks/useRewards";
import { useRewardAdmin } from "../../hooks/useRewardAdmin";
import { useRewardStore } from "../../store/useRewardStore";
import type { Reward, RedemptionPayload, RewardFormData } from "../../types/rewards";

interface Props {
  isAdmin?: boolean;
}

export const RewardsGrid: React.FC<Props> = ({ isAdmin = false }) => {
  const {
    rewards,
    pointsBalance,
    isLoading,
    isRedeeming,
    handleRedeem,
    refreshRewards,
  } = useRewards();

  const {
    filterType,
    searchQuery,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    editingReward,
    deletingReward,
    setFilterType,
    setSearchQuery,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  } = useRewardStore();

  const [selected, setSelected] = useState<Reward | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    title: string;
    cost: number;
    newBalance: number;
  } | null>(null);

  const adminHook = useRewardAdmin(refreshRewards);

  const filteredRewards = useMemo(() => {
    let list = rewards;
    if (filterType !== "all") {
      list = list.filter((r) => r.type === filterType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rewards, filterType, searchQuery]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: rewards.length };
    rewards.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [rewards]);

  const onConfirm = async (payload: RedemptionPayload) => {
    if (!selected) return;
    const id = (selected as any)._id || selected.id;
    const ok = await handleRedeem(payload, id, selected.pointsCost);
    if (ok) {
      const newBalance = pointsBalance - selected.pointsCost;
      setSuccessInfo({
        title: selected.title,
        cost: selected.pointsCost,
        newBalance,
      });
      setSelected(null);
    }
  };

  const handleAdminSubmit = async (data: RewardFormData): Promise<boolean> => {
    if (isEditModalOpen && editingReward) {
      const id = (editingReward as any)._id || editingReward.id;
      const ok = await adminHook.updateReward(id, data);
      if (ok) closeEditModal();
      return ok;
    } else {
      const ok = await adminHook.createReward(data);
      if (ok) closeAddModal();
      return ok;
    }
  };

  const handleAdminDelete = async () => {
    if (!deletingReward) return;
    const ok = await adminHook.deleteReward(deletingReward);
    if (ok) closeDeleteModal();
  };

  const featuredRewards = filteredRewards.filter((r) => r.tier === "gold" || r.tier === "platinum");
  const regularRewards = filteredRewards.filter((r) => r.tier !== "gold" && r.tier !== "platinum");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard variant="featured" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Icons
            type="search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-itec-text/30"
          />
          <input
            type="text"
            placeholder="Buscar beneficios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-itec-card border border-white/8 rounded-2xl pl-10 pr-4 py-3 text-sm text-itec-text placeholder:text-itec-text/30 focus:outline-none focus:border-white/20 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-white/10 text-itec-text/50 hover:text-itec-text"
            >
              <Icons type="close" className="size-3" />
            </button>
          )}
        </div>
        <RewardFilterTabs
          activeFilter={filterType}
          onFilter={setFilterType}
          counts={typeCounts}
        />
      </div>

      {filteredRewards.length === 0 ? (
        <EmptyState
          emoji="🎁"
          title={searchQuery ? "Sin resultados" : "Sin beneficios disponibles"}
          subtitle={
            searchQuery
              ? `No encontramos beneficios para "${searchQuery}"`
              : "Próximamente habrá nuevos beneficios para canjear."
          }
          action={
            searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-itec-blue-skye font-bold hover:underline"
              >
                Limpiar búsqueda
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          {featuredRewards.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-itec-rewards/60 flex items-center gap-2">
                <Icons type="star" className="size-3" />
                Beneficios destacados
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredRewards.map((r: any) => {
                  const id = r._id || r.id;
                  return (
                    <RewardCardFeatured
                      key={id}
                      reward={{ ...r, id }}
                      userPoints={pointsBalance}
                      onSelect={setSelected}
                      onEdit={isAdmin ? openEditModal : undefined}
                      onDelete={isAdmin ? openDeleteModal : undefined}
                      isAdmin={isAdmin}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {regularRewards.length > 0 && (
            <div className="space-y-4">
              {featuredRewards.length > 0 && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-itec-text/40">
                  Más beneficios
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {regularRewards.map((r: any) => {
                  const id = r._id || r.id;
                  return (
                    <RewardCard
                      key={id}
                      reward={{ ...r, id }}
                      userPoints={pointsBalance}
                      onSelect={setSelected}
                      onEdit={isAdmin ? openEditModal : undefined}
                      onDelete={isAdmin ? openDeleteModal : undefined}
                      isAdmin={isAdmin}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {selected && (
        <RedeemModal
          reward={selected}
          userPoints={pointsBalance}
          isLoading={isRedeeming}
          onClose={() => setSelected(null)}
          onConfirm={onConfirm}
        />
      )}

      {successInfo && (
        <RewardSuccessModal
          rewardTitle={successInfo.title}
          pointsCost={successInfo.cost}
          newBalance={successInfo.newBalance}
          onClose={() => setSuccessInfo(null)}
        />
      )}

      {isAdmin && (isAddModalOpen || isEditModalOpen) && (
        <RewardFormModal
          editingReward={isEditModalOpen ? editingReward : null}
          isLoading={adminHook.isSubmitting}
          onClose={isEditModalOpen ? closeEditModal : closeAddModal}
          onSubmit={handleAdminSubmit}
        />
      )}

      {isAdmin && isDeleteModalOpen && deletingReward && (
        <DeleteRewardModal
          reward={deletingReward}
          isLoading={adminHook.isSubmitting}
          onClose={closeDeleteModal}
          onConfirm={handleAdminDelete}
        />
      )}
    </section>
  );
};
