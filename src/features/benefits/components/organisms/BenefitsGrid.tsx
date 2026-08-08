import React, { useMemo, useState } from "react";
import { Search, X, Gift } from "lucide-react";
import { useBenefits } from "@features/benefits/hooks/useBenefits";
import { BenefitCard } from "../molecules/BenefitCard";
import { BenefitFilterTabs } from "../molecules/BenefitFilterTabs";
import { BenefitInfoModal } from "../organisms/BenefitInfoModal";
import { RedeemBenefitModal } from "../organisms/RedeemBenefitModal";
import type { Benefit, RedemptionPayload } from "@features/benefits/types/benefits";
import { isFreeBenefit } from "@features/benefits/types/benefits";

export const BenefitsGrid: React.FC = () => {
  const { filteredBenefits, filter, setFilter, benefits, pointsBalance, isLoading, isRedeeming, error, handleRedeem } = useBenefits();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Benefit | null>(null);

  const visible = useMemo(() => {
    if (!search.trim()) return filteredBenefits;
    const q = search.toLowerCase();
    return filteredBenefits.filter(b => b.title.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q));
  }, [filteredBenefits, search]);

  const counts = useMemo(() => ({
    all: benefits.length,
    free: benefits.filter((b) => isFreeBenefit(b)).length,
    points: benefits.filter((b) => !isFreeBenefit(b)).length,
  }), [benefits]);

  const onConfirmRedeem = async (payload: RedemptionPayload) => {
    if (!selected) return;
    const ok = await handleRedeem(payload, selected._id, selected.pointsCost);
    if (ok) setSelected(null);
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Cabecera de filtros y búsqueda */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <BenefitFilterTabs active={filter} onChange={setFilter} counts={counts} />
        
        <div className="relative w-full shrink-0 md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/30"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-white/40 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-itec-red/20 bg-itec-red/10 px-4 py-3 text-sm text-itec-red">
          {error}
        </div>
      )}

      {/* Grilla de Tarjetas */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 py-20 text-center">
          <Gift className="h-10 w-10 text-white/20" />
          <p className="text-sm font-bold text-white/60">No se encontraron resultados</p>
          <p className="text-xs text-white/40">Probá con otro término de búsqueda u otra categoría.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visible.map((b) => (
            <BenefitCard key={b._id} benefit={b} userPoints={pointsBalance} onSelect={setSelected} />
          ))}
        </div>
      )}

      {/* Modales */}
      {selected && isFreeBenefit(selected) && (
        <BenefitInfoModal benefit={selected} onClose={() => setSelected(null)} />
      )}

      {selected && !isFreeBenefit(selected) && (
        <RedeemBenefitModal
          benefit={selected}
          userPoints={pointsBalance}
          isLoading={isRedeeming}
          onClose={() => setSelected(null)}
          onConfirm={onConfirmRedeem}
        />
      )}
    </section>
  );
};
