import React, { useState, useCallback } from "react";
import { Icons } from "@components/ui/icons/Icons";
import { SectionData, FolderItem } from "../types";
import { FolderCard } from "./FolderCard";
import { FolderModal } from "./FolderModal";

const THEME_COLORS: Record<string, string> = {
  orange:  "text-orange-400",
  blue:    "text-blue-400",
  purple:  "text-purple-400",
  teal:    "text-teal-400",
  green:   "text-green-400",
  yellow:  "text-yellow-400",
  red:     "text-red-400",
  pink:    "text-pink-400",
  indigo:  "text-indigo-400",
  cyan:    "text-cyan-400",
  emerald: "text-emerald-400",
  slate:   "text-slate-400",
};

interface Props { section: SectionData; }

export const SectionBlock: React.FC<Props> = ({ section }) => {
  const [activeFolder, setActiveFolder] = useState<FolderItem | null>(null);
  const openFolder  = useCallback((f: FolderItem) => setActiveFolder(f), []);
  const closeFolder = useCallback(() => setActiveFolder(null), []);

  const titleColor = THEME_COLORS[section.colorTheme] ?? "text-slate-400";

  return (
    <section className="mb-8">
      {/* Encabezado de sección */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-4 h-4 shrink-0 ${titleColor}`}>
          <Icons type={section.iconName} className="w-full h-full" />
        </div>
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${titleColor}`}>
          {section.title}
        </h2>
        <div className="flex-1 h-px bg-white/6 ml-1" />
        <span className="text-xs text-[#5a6475] tabular-nums">
          {section.folders.length} carpetas
        </span>
      </div>

      {/* Grid de carpetas — siempre 2 columnas en sm, sin shifts de altura */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {section.folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onClick={() => openFolder(folder)}
          />
        ))}
      </div>

      {/* Modal de la carpeta activa */}
      <FolderModal folder={activeFolder} onClose={closeFolder} />
    </section>
  );
};