import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@components/ui/icons/Icons";
import { SectionData, ToolLink } from "../types";

// ─── tipos ────────────────────────────────────────────────────────────────────
interface FlatResult extends ToolLink {
  sectionTitle: string;
  folderLabel: string;
}

// ─── búsqueda flat ────────────────────────────────────────────────────────────
function flattenSections(sections: SectionData[], query: string): FlatResult[] {
  const q = query.toLowerCase().trim();
  const results: FlatResult[] = [];

  for (const section of sections) {
    for (const folder of section.folders) {
      for (const link of folder.links) {
        const matches =
          link.label.toLowerCase().includes(q) ||
          (link.description ?? "").toLowerCase().includes(q) ||
          folder.label.toLowerCase().includes(q) ||
          section.title.toLowerCase().includes(q);

        if (matches) {
          results.push({
            ...link,
            sectionTitle: section.title,
            folderLabel: folder.label,
          });
        }
      }
    }
  }

  return results;
}

// ─── tarjeta de resultado ─────────────────────────────────────────────────────
const ResultCard: React.FC<{ r: FlatResult }> = ({ r }) => {
  const inner = (
    <div className="flex items-start gap-3 bg-itec-card border border-white/7 rounded-xl p-4 hover:border-white/14 transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center shrink-0 text-[#9aa3b0]">
        <div className="w-4 h-4">
          <Icons type={r.iconName ?? "externalLink"} className="w-full h-full" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-itec-text group-hover:text-white transition-colors">
          {r.label}
        </p>
        {r.description && (
          <p className="text-xs text-[#5a6475] mt-0.5 line-clamp-2">{r.description}</p>
        )}
        <p className="text-[10px] text-[#5a6475]/60 mt-1">
          {r.sectionTitle} · {r.folderLabel}
        </p>
      </div>
      <div className="w-4 h-4 text-[#5a6475] shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Icons type={r.isExternal ? "externalLink" : "send"} className="w-full h-full" />
      </div>
    </div>
  );

  return r.isExternal ? (
    <a href={r.url} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <Link to={r.url}>{inner}</Link>
  );
};

// ─── componente principal ─────────────────────────────────────────────────────
interface Props {
  query: string;
  sections: SectionData[];
}

export const SearchResults: React.FC<Props> = ({ query, sections }) => {
  const results = flattenSections(sections, query);

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-[#5a6475]">
        <div className="w-10 h-10 mx-auto mb-3 opacity-30">
          <Icons type="search" className="w-full h-full" />
        </div>
        <p className="text-sm">Sin resultados para &ldquo;{query}&rdquo;</p>
        <p className="text-xs mt-1 opacity-60">Probá con otra palabra clave</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[#5a6475] mb-3">
        {results.length} resultado{results.length !== 1 ? "s" : ""} para &ldquo;{query}&rdquo;
      </p>
      {results.map((r) => <ResultCard key={r.id} r={r} />)}
    </div>
  );
};