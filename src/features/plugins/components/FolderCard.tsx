import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import { FolderItem } from "../types";

interface Props {
  folder: FolderItem;
  onClick: () => void;
}

export const FolderCard: React.FC<Props> = ({ folder, onClick }) => (
  <button
    onClick={onClick}
    className="
      w-full flex items-center gap-3 p-4 text-left
      bg-itec-card border border-white/7 rounded-xl
      hover:border-white/16 hover:bg-white/3
      active:scale-[0.98] transition-all duration-150 cursor-pointer
    "
    aria-label={`Abrir carpeta ${folder.label}`}
  >
    {/* Ícono */}
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${folder.iconColor}`}
    >
      <div className="w-5 h-5">
        <Icons type={folder.iconName} className="w-full h-full" />
      </div>
    </div>

    {/* Textos */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-medium text-itec-text">{folder.label}</p>
        {folder.tag && (
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${folder.tagColor}`}
          >
            {folder.tag}
          </span>
        )}
      </div>
      {folder.description && (
        <p className="text-xs text-[#5a6475] mt-0.5 truncate">{folder.description}</p>
      )}
    </div>

    {/* Contador + flecha */}
    <div className="flex items-center gap-2 shrink-0 text-[#5a6475]">
      <span className="text-xs tabular-nums">{folder.links.length}</span>
      <div className="w-4 h-4">
        <Icons type="chevronDown" className="w-full h-full -rotate-90" />
      </div>
    </div>
  </button>
);