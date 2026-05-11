import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@components/ui/icons/Icons";
import { BentoCard } from "@features/home/components/atoms/BentoCard";
import { SectionLabel } from "@features/home/components/atoms/SectionLabel";

import { CalendarWidget } from "@/features/calendar/components/CalendarWidget";

const QUICK_ACTIONS = [
  {
    href: "/faqs",
    icon: "message",
    label: "Consultas AI",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    href: "/perfil",
    icon: "user",
    label: "Mi perfil",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    href: "/aulas",
    icon: "map-pin",
    label: "Aulas",
    color: "text-itec-red",
    bg: "bg-itec-red/10",
  },
  {
    href: "/plugins",
    icon: "tool",
    label: "Herramientas",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

export const QuickStatsRow: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 items-stretch">
    <BentoCard className="p-4 h-full" hover={false}>
      <div className="h-54 overflow-auto relative">
        <CalendarWidget />
      </div>
    </BentoCard>
    <BentoCard className="p-4 h-full" hover={false}>
      <SectionLabel>Accesos rápidos</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.href}
            to={a.href}
            className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-white/6 hover:border-white/15 transition-all duration-150 text-center hover:-translate-y-0.5"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.bg} group-hover:scale-105 transition-transform`}
            >
              <Icons type={a.icon} className={`w-4 h-4 ${a.color}`} />
            </div>
            <span className="text-[11px] font-semibold text-itec-gray group-hover:text-itec-text transition-colors leading-tight">
              {a.label}
            </span>
          </Link>
        ))}
      </div>
    </BentoCard>
  </div>
);
