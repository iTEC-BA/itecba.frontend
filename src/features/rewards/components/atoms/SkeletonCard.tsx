import React from "react";

interface Props {
  variant?: "default" | "featured";
}

export const SkeletonCard: React.FC<Props> = ({ variant = "default" }) => {
  if (variant === "featured") {
    return (
      <div className="bg-itec-card border border-white/5 rounded-xl p-6 animate-pulse col-span-full sm:col-span-2">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-white/5 shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 bg-white/5 rounded-full w-2/3" />
            <div className="h-3 bg-white/5 rounded-full w-1/3" />
          </div>
        </div>
        <div className="space-y-2 mb-5">
          <div className="h-3 bg-white/5 rounded-full w-full" />
          <div className="h-3 bg-white/5 rounded-full w-4/5" />
        </div>
        <div className="h-12 bg-white/5 rounded-xl w-full" />
      </div>
    );
  }
  return (
    <div className="bg-itec-card border border-white/5 rounded-xl p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 bg-white/5 rounded-full w-3/4" />
          <div className="h-2.5 bg-white/5 rounded-full w-1/3" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-2.5 bg-white/5 rounded-full w-full" />
        <div className="h-2.5 bg-white/5 rounded-full w-5/6" />
      </div>
      <div className="h-2 bg-white/5 rounded-full w-full mb-1" />
      <div className="h-9 bg-white/5 rounded-xl w-full mt-4" />
    </div>
  );
};
