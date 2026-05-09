import React from "react";

const COLORS = [
  "bg-itec-accent",
  "bg-itec-blue",
  "bg-itect-red",
  "bg-emerald-600",
  "bg-amber-500",
  "bg-sky-600",
  "bg-itec-groups",
  "bg-rose-600",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-lime-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-yellow-600",
  "bg-pink-500",
  "bg-stone-600",
  "bg-slate-600",
  "bg-emerald-400",
  "bg-amber-300",
  "bg-sky-400",
  "bg-rose-400",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-fuchsia-400",
  "bg-lime-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-yellow-400",
  "bg-pink-400",
  "bg-stone-400",
  "bg-slate-400",
  "bg-gray-500",
  "bg-black",
  "bg-white/10",
];

const colorFrom = (name: string): string => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
};

interface Props {
  pseudonym: string;
  size?: "sm" | "md" | "lg";
}
const SZ = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-11 h-11 text-sm",
};

export const AnonAvatar: React.FC<Props> = ({ pseudonym, size = "md" }) => (
  <div
    className={`${SZ[size]} ${colorFrom(pseudonym)} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none`}
    aria-label={`Avatar de ${pseudonym}`}
  >
    {pseudonym.slice(0, 2).toUpperCase()}
  </div>
);
