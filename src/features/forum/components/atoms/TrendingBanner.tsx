import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { useBanners } from '../../hooks/useBanners';
import { BannerAdminModal } from '../molecules/BannerAdminModal';

export const TrendingBanner: React.FC = () => {
  const { isAdmin }                   = useAuth();
  const { banners, loading, refresh } = useBanners(true);   // solo activos
  const [current, setCurrent]         = useState(0);
  const [adminOpen, setAdminOpen]     = useState(false);

  // Auto-avance cada 5 s
  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  const prev = useCallback(() => setCurrent(c => (c - 1 + banners.length) % banners.length), [banners.length]);
  const next = useCallback(() => setCurrent(c => (c + 1)                  % banners.length), [banners.length]);

  if (loading) {
    return <div className="h-16 mx-4 my-2 rounded-2xl bg-white/5 animate-pulse" />;
  }

  return (
    <>
      <div className="relative mx-4 my-2">
        {banners.length > 0 ? (
          <a
            href={banners[current].redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full bg-itec-card border border-itec-border rounded-2xl px-4 py-3 hover:border-itec-red/40 transition-all group"
          >
            {/* SVG / icono */}
            {banners[current].svg_content ? (
              <div
                className="w-10 h-10 shrink-0 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: banners[current].svg_content }}
              />
            ) : (
              <div className="w-10 h-10 shrink-0 rounded-xl bg-itec-red/10 flex items-center justify-center text-itec-red font-bold text-lg">
                📢
              </div>
            )}

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-itec-text truncate">{banners[current].title}</p>
              {banners[current].description && (
                <p className="text-xs text-itec-muted truncate">{banners[current].description}</p>
              )}
            </div>

            {/* Flechas (múltiples banners) */}
            {banners.length > 1 && (
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={e => { e.preventDefault(); prev(); }}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-itec-muted hover:text-white transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] text-itec-muted font-mono">{current + 1}/{banners.length}</span>
                <button onClick={e => { e.preventDefault(); next(); }}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-itec-muted hover:text-white transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </a>
        ) : (
          <div className="flex items-center gap-3 w-full bg-itec-card border border-dashed border-itec-border rounded-2xl px-4 py-3 opacity-50">
            <span className="text-xs text-itec-muted">Sin banners activos</span>
          </div>
        )}

        {/* Botón admin */}
        {isAdmin && (
          <button
            onClick={() => setAdminOpen(true)}
            title="Gestionar banners"
            className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-itec-bg border border-itec-border text-itec-muted hover:text-itec-text hover:border-white/20 transition-colors z-10"
          >
            <Settings size={11} />
          </button>
        )}
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-1 mb-1">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-itec-red w-3' : 'bg-itec-border'}`}
            />
          ))}
        </div>
      )}

      {/* Modal admin */}
      {isAdmin && (
        <BannerAdminModal
          isOpen={adminOpen}
          onClose={() => { setAdminOpen(false); refresh(); }}
        />
      )}
    </>
  );
};
