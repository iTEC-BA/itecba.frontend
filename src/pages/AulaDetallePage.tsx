// src/pages/AulaDetallePage.tsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link }   from "react-router-dom";
import { MainLayout }        from "@components/templates/MainLayout";
import { useAuth }           from "@context/AuthContext";
import { useAulaDetalle }    from "@features/aulas/hooks/useAulaDetalle";
import { FuncionBadge }      from "@features/aulas/components/atoms/FuncionBadge";
import { MediaSlider }       from "@features/aulas/components/molecules/MediaSlider";
import { AulaFormModal }     from "@features/aulas/components/organisms/AulaFormModal";
import { MediaManagerModal } from "@features/aulas/components/organisms/MediaManagerModal";
import { invalidateAulasCache } from "@features/aulas/hooks/useAulas";
import {
  ArrowLeft, MapPin, Layers, Users, Info, Navigation,
  Pencil, ImagePlus,
} from "lucide-react";

const SEDE_LABEL: Record<string, string> = { medrano: "Medrano", campus: "Campus" };


// Mini-renderer de Markdown para la página de detalle
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => (
  <ReactMarkdown
    components={{
      p:          ({ children }) => <p className="text-sm text-itec-text leading-relaxed mb-2 last:mb-0">{children}</p>,
      h1:         ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 text-itec-text">{children}</h1>,
      h2:         ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 text-itec-text">{children}</h2>,
      h3:         ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2 text-itec-text">{children}</h3>,
      ul:         ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-0.5">{children}</ul>,
      ol:         ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>,
      li:         ({ children }) => <li className="text-sm text-itec-text">{children}</li>,
      strong:     ({ children }) => <strong className="font-bold text-itec-text">{children}</strong>,
      em:         ({ children }) => <em className="italic text-itec-text/90">{children}</em>,
      code:       ({ children }) => <code className="px-1.5 py-0.5 rounded bg-white/10 text-itec-sky font-mono text-xs">{children}</code>,
      pre:        ({ children }) => <pre className="bg-white/5 rounded-xl p-3 overflow-x-auto mb-2 text-xs font-mono">{children}</pre>,
      hr:         () => <hr className="border-itec-border my-3" />,
      blockquote: ({ children }) => <blockquote className="border-l-4 border-itec-sky/50 pl-4 italic text-itec-muted/80 my-2">{children}</blockquote>,
      a:          ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer"
           className="text-itec-sky underline underline-offset-2 hover:text-itec-sky/80">
          {children}
        </a>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

export const AulaDetallePage: React.FC = () => {
  const { slug }   = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();
  const { aula, loading, error, reload } = useAulaDetalle(slug ?? "");

  const [showEdit,  setShowEdit]  = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const handleSaved = () => {
    invalidateAulasCache();
    reload();
    setShowEdit(false);
    setShowMedia(false);
  };

  return (
    <MainLayout>
      {/* Volver */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/aulas"
          className="flex items-center gap-1.5 text-sm text-itec-muted hover:text-itec-text transition-colors"
        >
          <ArrowLeft size={15} /> Volver al buscador
        </Link>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-6 animate-pulse max-w-3xl">
          <div className="h-8 w-1/3 rounded-2xl bg-white/5" />
          <div className="h-64 rounded-2xl bg-white/5" />
          <div className="h-32 rounded-2xl bg-white/5" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/25 px-6 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Aula no encontrada */}
      {!loading && !error && !aula && (
        <div className="flex flex-col items-center gap-3 py-20 text-itec-muted">
          <span className="text-4xl">🔍</span>
          <p>No se encontró el aula solicitada.</p>
          <Link to="/aulas" className="text-sm text-itec-blue-skye hover:underline">
            Volver al buscador
          </Link>
        </div>
      )}

      {/* Contenido del aula */}
      {aula && (
        <div className="flex flex-col gap-6 max-w-3xl">

          {/* ── Header ────────────────────────────────────────────────────────── */}
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-itec-muted uppercase tracking-widest">
                  {SEDE_LABEL[aula.sede] ?? aula.sede}
                </span>
                <FuncionBadge funcion={aula.funcion} size="sm" />
              </div>
              <h1 className="text-3xl font-black text-itec-text">{aula.numero}</h1>
              {aula.carrera && (
                <p className="text-sm text-itec-muted">{aula.carrera}</p>
              )}
            </div>

            {/* Admin controls */}
            {isAdmin && (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-itec-surface border border-itec-border text-itec-muted hover:text-white hover:border-white/20 transition-colors text-sm"
                >
                  <Pencil size={13} /> Editar
                </button>
                <button
                  onClick={() => setShowMedia(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-itec-surface border border-itec-border text-itec-muted hover:text-itec-sky hover:border-itec-sky/40 transition-colors text-sm"
                >
                  <ImagePlus size={13} /> Gestionar fotos
                </button>
              </div>
            )}
          </header>

          {/* ── Datos clave ───────────────────────────────────────────────────── */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1 p-4 rounded-2xl bg-itec-surface border border-itec-border">
              <div className="flex items-center gap-1.5 text-xs text-itec-muted font-medium uppercase tracking-widest">
                <Layers size={11} /> Piso
              </div>
              <span className="text-xl font-black text-itec-text">{aula.piso}°</span>
            </div>

            {aula.pasillo && (
              <div className="flex flex-col gap-1 p-4 rounded-2xl bg-itec-surface border border-itec-border">
                <div className="flex items-center gap-1.5 text-xs text-itec-muted font-medium uppercase tracking-widest">
                  <MapPin size={11} /> Pasillo
                </div>
                <span className="text-sm font-bold text-itec-text">{aula.pasillo}</span>
              </div>
            )}

            {aula.ala && (
              <div className="flex flex-col gap-1 p-4 rounded-2xl bg-itec-surface border border-itec-border">
                <div className="flex items-center gap-1.5 text-xs text-itec-muted font-medium uppercase tracking-widest">
                  <Navigation size={11} /> Ala
                </div>
                <span className="text-sm font-bold text-itec-text">{aula.ala}</span>
              </div>
            )}

            {aula.capacidad && (
              <div className="flex flex-col gap-1 p-4 rounded-2xl bg-itec-surface border border-itec-border">
                <div className="flex items-center gap-1.5 text-xs text-itec-muted font-medium uppercase tracking-widest">
                  <Users size={11} /> Capacidad
                </div>
                <span className="text-xl font-black text-itec-text">{aula.capacidad}</span>
              </div>
            )}
          </section>

          {/* ── Slider de medios ──────────────────────────────────────────────── */}
          <section>
            <h2 className="text-xs font-bold text-itec-muted uppercase tracking-widest mb-3">
              Fotos y videos
            </h2>
            <MediaSlider imagenes={aula.imagenes} videos={aula.videos} />
          </section>

          {/* ── Cómo llegar ───────────────────────────────────────────────────── */}
          {aula.referencias && (
            <section className="flex flex-col gap-2 p-5 rounded-2xl bg-itec-surface border border-itec-border">
              <div className="flex items-center gap-2 text-xs font-bold text-itec-muted uppercase tracking-widest">
                <Navigation size={12} /> Cómo llegar
              </div>
              <MarkdownContent content={aula.referencias} />
            </section>
          )}

          {/* ── Descripción ───────────────────────────────────────────────────── */}
          {aula.descripcion && (
            <section className="flex flex-col gap-2 p-5 rounded-2xl bg-itec-surface border border-itec-border">
              <div className="flex items-center gap-2 text-xs font-bold text-itec-muted uppercase tracking-widest">
                <Info size={12} /> Información adicional
              </div>
              <MarkdownContent content={aula.descripcion} />
            </section>
          )}

        </div>
      )}

      {/* ── Modales admin ───────────────────────────────────────────────────── */}
      <AulaFormModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSaved={handleSaved}
        aula={aula}
      />
      <MediaManagerModal
        isOpen={showMedia}
        onClose={() => setShowMedia(false)}
        onSaved={handleSaved}
        aula={aula}
      />
    </MainLayout>
  );
};
