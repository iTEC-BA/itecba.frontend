import React, { useState, useEffect } from "react";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import type { Reward, RewardFormData, RewardType, RewardTier } from "../../types/rewards";
import { REWARD_TYPE_CONFIG } from "../../types/rewards";

interface Props {
  editingReward?: Reward | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: RewardFormData) => Promise<boolean>;
}

const INITIAL_FORM: RewardFormData = {
  title: "",
  description: "",
  pointsCost: 100,
  type: "mentorship",
  icon: "star",
  tier: "bronze",
  stock: 0,
};

const ICONS = ["star", "users", "message", "lightning", "book", "calendar", "gift", "trophy", "rocket", "heart"];
const TYPES = Object.keys(REWARD_TYPE_CONFIG) as RewardType[];
const TIERS: RewardTier[] = ["bronze", "silver", "gold", "platinum"];

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[11px] font-bold text-itec-text/50 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

export const RewardFormModal: React.FC<Props> = ({
  editingReward,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<RewardFormData>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editingReward;

  useEffect(() => {
    if (editingReward) {
      setForm({
        title: editingReward.title,
        description: editingReward.description,
        pointsCost: editingReward.pointsCost,
        type: editingReward.type,
        icon: editingReward.icon,
        tier: editingReward.tier ?? "bronze",
        stock: editingReward.stock ?? 0,
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [editingReward]);

  const update = (patch: Partial<RewardFormData>) =>
    setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) { setError("El título es obligatorio"); return; }
    if (!form.description.trim()) { setError("La descripción es obligatoria"); return; }
    if (form.pointsCost < 1) { setError("El costo debe ser mayor a 0"); return; }
    const ok = await onSubmit(form);
    if (!ok) setError("Ocurrió un error. Intentá nuevamente.");
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-itec-card border border-white/8 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300 max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-itec-rewards/12 border border-itec-rewards/20 flex items-center justify-center">
              <Icons type={isEditing ? "edit" : "plus"} className="size-4 text-itec-rewards" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-itec-text/40 mb-0.5">
                {isEditing ? "Editar beneficio" : "Nuevo beneficio"}
              </p>
              <h2 className="text-base font-black text-itec-text">
                {isEditing ? editingReward?.title : "Crear beneficio"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-itec-text/60 hover:text-itec-text transition-colors"
          >
            <Icons type="close" className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {error && (
            <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
              <p className="text-xs text-red-400 font-semibold">{error}</p>
            </div>
          )}

          <div>
            <Label>Título *</Label>
            <Input
              type="text"
              required
              fullWidth
              placeholder="Ej: Mentoría con tutor de sistemas"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </div>

          <div>
            <Label>Descripción *</Label>
            <textarea
              required
              rows={3}
              placeholder="Descripción detallada del beneficio..."
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              className="w-full bg-itec-bg border border-white/8 text-itec-text text-sm px-4 py-3 rounded-2xl focus:outline-none focus:border-itec-blue-skye transition-colors resize-none placeholder:text-itec-text/25"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Costo en puntos *</Label>
              <Input
                type="number"
                required
                fullWidth
                min={1}
                value={form.pointsCost}
                onChange={(e) => update({ pointsCost: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Stock (0 = ilimitado)</Label>
              <Input
                type="number"
                fullWidth
                min={0}
                value={form.stock}
                onChange={(e) => update({ stock: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label>Tipo *</Label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => {
                const cfg = REWARD_TYPE_CONFIG[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update({ type: t })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      form.type === t
                        ? `${cfg.cls} shadow-sm`
                        : "bg-white/3 border-white/8 text-itec-text/50 hover:border-white/15"
                    }`}
                  >
                    <Icons type={cfg.icon} className="size-3" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>Nivel / Tier</Label>
            <div className="flex flex-wrap gap-2">
              {TIERS.map((tier) => {
                const tierEmoji = { bronze: "🥉", silver: "🥈", gold: "🥇", platinum: "💎" }[tier];
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => update({ tier })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all capitalize ${
                      form.tier === tier
                        ? "bg-itec-rewards/12 border-itec-rewards/30 text-itec-rewards"
                        : "bg-white/3 border-white/8 text-itec-text/50 hover:border-white/15"
                    }`}
                  >
                    {tierEmoji} {tier}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>Ícono</Label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => update({ icon: ic })}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    form.icon === ic
                      ? "bg-itec-rewards/12 border-itec-rewards/30 text-itec-rewards"
                      : "bg-white/3 border-white/8 text-itec-text/50 hover:border-white/15"
                  }`}
                >
                  <Icons type={ic} className="size-4" />
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="px-6 pb-6 pt-4 border-t border-white/5 flex gap-3 shrink-0">
          <Button
            type="button"
            variant="slate" hierarchy="ghost"
            onClick={onClose}
            fullWidth
            className="h-11 rounded-2xl text-sm font-bold"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit({ preventDefault: () => {} } as React.FormEvent);
            }}
            fullWidth
            disabled={isLoading}
            className="h-11 rounded-2xl text-sm font-bold"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEditing ? "Guardando..." : "Creando..."}
              </span>
            ) : (
              isEditing ? "Guardar cambios" : "Crear beneficio"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
