import React from "react";
import { Icons } from "@components/ui/icons/Icons";

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  colorCls: string;
}

interface Props {
  totalRewards: number;
  affordableCount: number;
  pointsBalance: number;
  redeemedCount?: number;
}

export const RewardStats: React.FC<Props> = ({
  totalRewards,
  affordableCount,
  pointsBalance,
  redeemedCount = 0,
}) => {
  const stats: Stat[] = [
    {
      label: "Disponibles",
      value: totalRewards,
      icon: "gift",
      colorCls: "text-itec-text/70",
    },
    {
      label: "Canjeables",
      value: affordableCount,
      icon: "check-circle",
      colorCls: "text-green-400",
    },
    {
      label: "Mis puntos",
      value: `${pointsBalance.toLocaleString()}`,
      icon: "star",
      colorCls: "text-itec-rewards",
    },
    {
      label: "Canjeados",
      value: redeemedCount,
      icon: "history",
      colorCls: "text-itec-blue-skye",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-itec-card border border-white/5 rounded-2xl p-3.5 flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-1.5">
            <Icons type={s.icon} className={`size-3.5 ${s.colorCls}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-itec-text/40">
              {s.label}
            </span>
          </div>
          <p className={`text-xl font-black tabular-nums leading-none ${s.colorCls}`}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
};
