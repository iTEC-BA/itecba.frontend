import React from "react";
import { Link } from "react-router-dom";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Icons } from "@components/ui/icons/Icons";
import { FolderItem, ToolLink } from "../types";

// ─── Link individual dentro del modal ────────────────────────────────────────
const ModalLinkItem: React.FC<{ link: ToolLink }> = ({ link }) => {
  const inner = (
    <div className="flex items-center gap-3 px-6 py-3.5 hover:bg-white/4 transition-colors group">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/6 text-[#9aa3b0]`}
      >
        <div className="w-4 h-4">
          <Icons type={link.iconName ?? "externalLink"} className="w-full h-full" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-itec-text group-hover:text-white transition-colors">
          {link.label}
        </p>
        {link.description && (
          <p className="text-xs text-[#5a6475] mt-0.5 leading-relaxed">
            {link.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {link.badge && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${link.badgeColor}`}>
            {link.badge}
          </span>
        )}
        <div className="w-4 h-4 text-[#5a6475] group-hover:text-white/60 transition-colors">
          <Icons
            type={link.isExternal ? "externalLink" : "send"}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );

  if (link.isExternal) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return <Link to={link.url} className="block">{inner}</Link>;
};

// ─── Modal principal ──────────────────────────────────────────────────────────
interface Props {
  folder: FolderItem | null;
  onClose: () => void;
}

export const FolderModal: React.FC<Props> = ({ folder, onClose }) => (
  <LayoutModal
    isOpen={folder !== null}
    onClose={onClose}
    title={folder?.label ?? ""}
    description={folder?.description}
    maxWidth="max-w-lg"
  >
    {folder && (
      <div className="py-2 divide-y divide-white/5">
        {folder.links.map((link) => (
          <ModalLinkItem key={link.id} link={link} />
        ))}
      </div>
    )}
  </LayoutModal>
);