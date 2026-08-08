import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@context/AuthContext";
import { Icons } from "@components/ui/icons/Icons";
import { auth } from "@/lib/firebase";
import { Link } from "react-router-dom";

export const BenefitsWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const { data: benefits = [], isLoading } = useQuery({
    queryKey: ["benefits", "premium"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/benefits?type=points`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      return Array.isArray(data.benefits) ? data.benefits : [];
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-itec-text/40">Catálogo</p>
        <div className="flex items-center gap-1 text-xs font-bold text-itec-rewards">
          <Icons type="star" className="w-3 h-3" />
          <span className="tabular-nums">{(user?.points || 0).toLocaleString()} pts</span>
        </div>
      </div>
      {isLoading ? ( <div className="animate-pulse h-14 bg-white/5 rounded-xl"/> ) : benefits.length === 0 ? (
        <p className="text-xs text-itec-text/40 text-center py-4">Sin recompensas aún</p>
      ) : (
        benefits.slice(0,4).map((b: any) => (
          <Link to="/beneficios" key={b._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="min-w-0 flex-1 pr-3">
              <p className="text-xs font-bold text-itec-text truncate">{b.title}</p>
              <p className="text-[10px] text-itec-muted truncate capitalize">{b.category}</p>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-itec-rewards bg-itec-rewards/10 px-2 py-1 rounded-md border border-itec-rewards/20">
              <Icons type="star" className="w-3 h-3" />
              <span className="text-[10px] font-bold">{b.pointsCost}</span>
            </div>
          </Link>
        ))
      )}
    </section>
  );
};
