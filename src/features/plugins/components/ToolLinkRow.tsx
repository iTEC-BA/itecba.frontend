import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@components/ui/icons/Icons";
import { ToolLink } from "../types";

interface Props { link: ToolLink; }

export const ToolLinkRow: React.FC<Props> = ({ link }) => {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/4 transition-colors group">
      <div className="w-px h-4 bg-white/10 ml-1 shrink-0" />
      {link.iconName && (
        <div className="w-4 h-4 text-[#5a6475] shrink-0">
          <Icons type={link.iconName} className="w-full h-full" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-itec-text group-hover:text-white transition-colors truncate">
          {link.label}
        </p>
        {link.description && (
          <p className="text-xs text-[#5a6475] truncate mt-0.5">{link.description}</p>
        )}
      </div>
      {link.badge && (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${link.badgeColor}`}>
          {link.badge}
        </span>
      )}
      {link.isExternal && (
        <div className="w-3.5 h-3.5 text-[#5a6475] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icons type="externalLink" className="w-full h-full" />
        </div>
      )}
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
