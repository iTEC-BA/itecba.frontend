import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickLink {
  href: string;
  emoji: string;
  label: string;
  sublabel?: string;
  color: string;
  border: string;
}

const LINKS: QuickLink[] = [
  { href: "/grupos", emoji: "💬", label: "Grupos", sublabel: "WhatsApp", color: "text-itec-emerald", border: "hover:border-itec-emerald/30 hover:bg-itec-emerald/5" },
  { href: "/cursos", emoji: "🎥", label: "Cursos", sublabel: "Videos", color: "text-itec-sky", border: "hover:border-itec-sky/30 hover:bg-itec-sky/5" },
  { href: "/aportes", emoji: "📂", label: "BiblioTEC", sublabel: "Archivos", color: "text-orange-400", border: "hover:border-orange-400/30 hover:bg-orange-400/5" },
  { href: "/progreso", emoji: "📊", label: "Progreso", sublabel: "Académico", color: "text-itec-purple", border: "hover:border-itec-purple/30 hover:bg-itec-purple/5" },
  { href: "/rewards", emoji: "🎁", label: "Canjes", sublabel: "Puntos", color: "text-itec-amber", border: "hover:border-itec-amber/30 hover:bg-itec-amber/5" },
  { href: "/faqs", emoji: "🤖", label: "IA iTEC", sublabel: "Chatbot", color: "text-itec-sky", border: "hover:border-itec-sky/30 hover:bg-itec-sky/5" },
];

export const ProfileQuickLinks: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {LINKS.map((link) => (
      <Link
        key={link.href}
        to={link.href}
        className={cn(
          "group flex flex-col items-center gap-1.5 rounded-[1.3rem] border border-itec-border",
          "bg-itec-box/80 px-3 py-4 text-center transition-all duration-300",
          "hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.24)]",
          link.border
        )}
      >
        <span className="text-2xl transition-transform group-hover:scale-110">{link.emoji}</span>
        <span className={cn("text-[11px] font-black tracking-wide", link.color)}>{link.label}</span>
        {link.sublabel && <span className="text-[9px] text-itec-muted">{link.sublabel}</span>}
      </Link>
    ))}
  </div>
);
