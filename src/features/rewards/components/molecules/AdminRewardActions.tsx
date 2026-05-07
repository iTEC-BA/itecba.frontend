import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import type { Reward } from "../../types/rewards";

interface Props {
  reward: Reward;
  onEdit: (r: Reward) => void;
  onDelete: (r: Reward) => void;
  layout?: "row" | "column";
}

export const AdminRewardActions: React.FC<Props> = ({
  reward,
  onEdit,
  onDelete,
  layout = "row",
}) => {
  const wrapCls = layout === "column" ? "flex flex-col gap-2" : "flex items-center gap-2";
  return (
    <div className={wrapCls}>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(reward); }}
        className="h-9 px-3 flex items-center gap-1.5 rounded-xl bg-itec-blue-skye/10 border border-itec-blue-skye/20 text-itec-blue-skye text-xs font-bold hover:bg-itec-blue-skye/20 transition-all active:scale-95"
      >
        <Icons type="edit" className="size-3.5" />
        Editar
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(reward); }}
        className="h-9 px-3 flex items-center gap-1.5 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-xs font-bold hover:bg-red-500/15 transition-all active:scale-95"
      >
        <Icons type="trash" className="size-3.5" />
        Borrar
      </button>
    </div>
  );
};
