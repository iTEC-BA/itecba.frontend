import React from "react";

interface Props {
  emoji?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ emoji = "✨", title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-3 select-none px-4">
    <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-1">
      <span className="text-3xl">{emoji}</span>
    </div>
    <p className="text-itec-text font-bold text-sm">{title}</p>
    {subtitle && (
      <p className="text-itec-text/40 text-xs max-w-xs leading-relaxed">{subtitle}</p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
