// ProfileSkeleton.tsx — Skeleton para el perfil de usuario
import React from "react";

export const ProfileSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-6 p-4">
    {/* Avatar + nombre */}
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-white/5" />
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-white/5 rounded-lg w-40" />
        <div className="h-3.5 bg-white/5 rounded-md w-56" />
        <div className="h-6 bg-white/5 rounded-full w-24 mt-1" />
      </div>
    </div>
    {/* Stats */}
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-3 space-y-2">
          <div className="h-6 bg-white/5 rounded-md w-12 mx-auto" />
          <div className="h-3 bg-white/5 rounded-md w-16 mx-auto" />
        </div>
      ))}
    </div>
    {/* Tarjeta */}
    <div className="h-48 bg-white/3 border border-white/5 rounded-3xl" />
  </div>
);
