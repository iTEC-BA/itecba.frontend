// src/features/aulas/components/atoms/FuncionBadge.tsx
import React from "react";
import {
  BookOpen, Monitor, FlaskConical, Users, ClipboardList,
  Star, Coffee, FileText, HelpCircle,
} from "lucide-react";
import type { FuncionAula } from "../../types/aulas.types";

interface Props {
  funcion:    FuncionAula;
  size?:      "sm" | "md" | "lg";
  showLabel?: boolean;
}

const CONFIG: Record<FuncionAula, { label: string; icon: React.ElementType; cls: string }> = {
  aula_comun:               { label: "Aula",             icon: BookOpen,      cls: "bg-blue-500/15 text-blue-400 border-blue-500/25"      },
  laboratorio_informatica:  { label: "Lab. Informática",  icon: Monitor,       cls: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25"      },
  laboratorio_especialidad: { label: "Laboratorio",       icon: FlaskConical,  cls: "bg-purple-500/15 text-purple-400 border-purple-500/25" },
  departamento:             { label: "Departamento",      icon: Users,         cls: "bg-amber-500/15 text-amber-400 border-amber-500/25"   },
  bedelia:                  { label: "Bedelía",           icon: ClipboardList, cls: "bg-green-500/15 text-green-400 border-green-500/25"   },
  ceit:                     { label: "CEIT",              icon: Star,          cls: "bg-red-500/15 text-red-400 border-red-500/25"         },
  sala_reunion:             { label: "Sala de reunión",   icon: Coffee,        cls: "bg-teal-500/15 text-teal-400 border-teal-500/25"      },
  secretaria:               { label: "Secretaría",        icon: FileText,      cls: "bg-slate-500/15 text-slate-400 border-slate-500/25"   },
  otro:                     { label: "Otro",              icon: HelpCircle,    cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"      },
};

export const FuncionBadge: React.FC<Props> = ({ funcion, size = "sm", showLabel = true }) => {
  const { label, icon: Icon, cls } = CONFIG[funcion] ?? CONFIG.otro;
  const sizeMap = {
    sm: { pill: "px-2 py-0.5 text-[11px]", icon: 11 },
    md: { pill: "px-2.5 py-1 text-xs",     icon: 12 },
    lg: { pill: "px-3 py-1.5 text-sm",     icon: 14 },
  };
  const s = sizeMap[size];
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${s.pill} ${cls}`}>
      <Icon size={s.icon} className="shrink-0" />
      {showLabel && label}
    </span>
  );
};

/** Retorna solo el ícono sin pill */
export const FuncionIcon: React.FC<{ funcion: FuncionAula; size?: number; className?: string }> = ({
  funcion, size = 16, className = "",
}) => {
  const { icon: Icon, cls } = CONFIG[funcion] ?? CONFIG.otro;
  const color = cls.split(" ").find((c) => c.startsWith("text-")) ?? "text-zinc-400";
  return <Icon size={size} className={`${color} ${className}`} />;
};
