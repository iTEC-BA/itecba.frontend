import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
interface QuickLink {
  href: string;
  emoji: string;
  label: string;
  sublabel?: string;
  color: string;
  bg: string;
}
const LINKS: QuickLink[] = [
  { href: "/grupos",   emoji: "💬", label: "Grupos",    sublabel: "WhatsApp",  color: "text-itec-emerald", bg: "hover:bg-itec-emerald/8 hover:border-itec-emerald/30" },
  { href: "/cursos",   emoji: "🎥", label: "Cursos",    sublabel: "Videos",    color: "text-itec-sky",     bg: "hover:bg-itec-sky/8 hover:border-itec-sky/30" },
  { href: "/aportes",  emoji: "📂", label: "BiblioTEC", sublabel: "Archivos",  color: "text-orange-400",   bg: "hover:bg-orange-400/8 hover:border-orange-400/30" },
  { href: "/progreso", emoji: "📊", label: "Progreso",  sublabel: "Académico", color: "text-itec-purple",  bg: "hover:bg-itec-purple/8 hover:border-itec-purple/30" },
  { href: "/rewards",  emoji: "🎁", label: "Canjes",    sublabel: "Puntos",    color: "text-itec-amber",   bg: "hover:bg-itec-amber/8 hover:border-itec-amber/30" },
  { href: "/faqs",     emoji: "🤖", label: "IA iTEC",   sublabel: "Chatbot",   color: "text-itec-sky",     bg: "hover:bg-itec-sky/8 hover:border-itec-sky/30" },
];
export const ProfileQuickLinks: React.FC = () => (
  <div className="grid grid-cols-3 gap-2">
    {LINKS.map((link) => (
      <Link
        key={link.href}
        to={link.href}
        className={cn(
          "flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl text-center",
          "bg-itec-surface/60 border border-itec-border",
          "transition-all duration-200 hover:scale-[1.04]",
          link.bg
        )}
      >
        <span className="text-xl">{link.emoji}</span>
        <span className={cn("text-[11px] font-black", link.color)}>{link.label}</span>
        {link.sublabel && (
          <span className="text-[9px] text-itec-muted">{link.sublabel}</span>
        )}
      </Link>
    ))}
  </div>
);
