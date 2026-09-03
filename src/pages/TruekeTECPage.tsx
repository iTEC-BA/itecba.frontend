import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Handshake, ChevronLeft, ChevronRight, ChevronDown,
  Inbox, Plus, ShieldAlert, SlidersHorizontal, Settings2, PhoneCall
} from "lucide-react";
import { MainLayout } from "@components/templates/MainLayout";
import { Button } from "@components/ui/Button";
import { useAuth } from "@context/AuthContext";
import { useTrueketec } from "@features/trueketec/hooks/useTrueketec";
import { TrueketecFiltersBar } from "@features/trueketec/components/molecules/TrueketecFilters";
import { TrueketecCard } from "@features/trueketec/components/molecules/TrueketecCard";
import { TrueketecPublishModal } from "@features/trueketec/components/organisms/TrueketecPublishModal";
import { ContactModal } from "@features/trueketec/components/organisms/ContactModal";
import { PostulanteModal } from "@features/trueketec/components/organisms/PostulanteModal";
import { MyPostsModal } from "@features/trueketec/components/organisms/MyPostsModal";
import type { TrueketecPost, EstadoPost, Postulante } from "@features/trueketec/types/trueketec.types";
import { PASOS_COMO_FUNCIONA, SOPORTE, MENSAJES, getMateriasDeCarrera } from "@features/trueketec/data";

export const TruekeTECPage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [myPostsModalOpen, setMyPostsModalOpen] = useState(false);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="h-8 w-8 rounded-full border-2 border-itec-surface border-t-itec-section-trueketec animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!user?.email?.endsWith("@frba.utn.edu.ar")) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center gap-5 py-24 px-4 text-center max-w-md mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-itec-surface border border-itec-border">
            <ShieldAlert size={24} className="text-itec-red" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-itec-text mb-2 tracking-tight">Acceso Restringido</h2>
            <p className="text-xs text-itec-muted leading-relaxed">
              El módulo de permutas es de uso exclusivo para alumnos regulares.
              Inicie sesión utilizando una cuenta <strong className="text-itec-text font-mono">@frba.utn.edu.ar</strong>.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <TruekeTECContent userId={user!.id ?? ""} specialty={user?.specialty} modalOpen={modalOpen} setModalOpen={setModalOpen} myPostsModalOpen={myPostsModalOpen} setMyPostsModalOpen={setMyPostsModalOpen} />
    </MainLayout>
  );
};

interface ContentProps {
  userId: string;
  specialty?: string;
  modalOpen: boolean;
  setModalOpen: (v: boolean) => void;
  myPostsModalOpen: boolean;
  setMyPostsModalOpen: (v: boolean) => void;
}

const TruekeTECContent: React.FC<ContentProps> = ({ userId, specialty, modalOpen, setModalOpen, myPostsModalOpen, setMyPostsModalOpen }) => {
  const { posts, myPosts, matches, allowedDepts, total, totalPages, currentPage, filters, loading, error, hasSearched, applyFilters, goToPage, publish, updateEstadoLocal } = useTrueketec();

  const [contactPost, setContactPost] = useState<TrueketecPost | null>(null);
  const [postulante, setPostulante] = useState<Postulante | null>(null);
  const [comoFuncionaOpen, setComoFuncionaOpen] = useState(false);

  const materiaOptions = useMemo(() => getMateriasDeCarrera(specialty), [specialty]);

  const handleContact = (p: TrueketecPost) => setContactPost(p);
  const isOwnContact = contactPost?.userId === userId;
  const misActivos = myPosts.filter(p => p.estado === "Activo");

  return (
    <div className="mx-auto max-w-5xl w-full flex flex-col gap-6 pb-24 px-2 sm:px-4 mt-2">

      {/* ── ENCABEZADO + ACCESOS RÁPIDOS (siempre visible, arriba de todo) ── */}
      <header className="flex flex-col gap-5 ">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-itec-surface border border-itec-border text-itec-section-trueketec">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Módulo Académico</p>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none mt-0.5">TruekeTEC</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="slate" hierarchy="outline" icon={<Settings2 className="w-4 h-4"/>} text={misActivos.length > 0 ? `Mis Solicitudes (${misActivos.length})` : "Mis Solicitudes"} onClick={() => setMyPostsModalOpen(true)} className="flex-1 sm:flex-none py-2.5 rounded-xl bg-itec-surface border-itec-border" />
            <Button variant="primary" hierarchy="solid" icon={<Plus className="w-4 h-4"/>} text="Cargar Solicitud" onClick={() => setModalOpen(true)} className="flex-1 sm:flex-none py-2.5 rounded-xl bg-itec-section-trueketec text-white font-bold hover:bg-itec-section-trueketec/80" />
          </div>
        </div>

        {matches.length > 0 && (
          <button
            onClick={() => setMyPostsModalOpen(true)}
            className="flex items-center justify-between gap-3 bg-itec-section-trueketec/10 border border-itec-section-trueketec/30 rounded-2xl px-4 py-3 text-left hover:bg-itec-section-trueketec/15 transition-colors"
          >
            <span className="flex items-center gap-2 text-xs font-bold text-itec-section-trueketec">
              <Handshake size={14} /> Tenés {matches.length} coincidencia{matches.length !== 1 ? "s" : ""} esperando gestión
            </span>
            <ChevronRight size={14} className="text-itec-section-trueketec shrink-0" />
          </button>
        )}
      </header>

      {error && (
        <div className="bg-itec-box rounded-2xl p-4 flex items-center gap-3 text-xs text-itec-red font-medium border border-itec-border">
          <ShieldAlert className="w-4 h-4 shrink-0" /> <p>{error}</p>
        </div>
      )}

      {/* ── AVISO DE SOPORTE (línea corta, siempre visible) ── */}
      <div className="flex items-center gap-3 bg-itec-box rounded-2xl px-5 py-3 border border-itec-border text-xs text-itec-muted">
        <PhoneCall size={14} className="text-itec-section-trueketec shrink-0" />
        <p>Si gestión no da lugar al trueque, avisá de inmediato al <strong className="text-itec-text">{SOPORTE.telefono} ({SOPORTE.contactoNombre})</strong>.</p>
      </div>

      {/* ── ACORDEÓN: ¿CÓMO FUNCIONA? (fondo /10 y borde /60 del acento) ── */}
      <div className="bg-itec-section-trueketec/10 rounded-3xl border border-itec-section-trueketec/60 overflow-hidden">
        <button
          onClick={() => setComoFuncionaOpen(v => !v)}
          className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left"
          aria-expanded={comoFuncionaOpen}
        >
          <span className="text-sm font-bold text-white">¿Cómo funciona el trueque en la plataforma?</span>
          <ChevronDown size={18} className={`text-itec-section-trueketec transition-transform ${comoFuncionaOpen ? "rotate-180" : ""}`} />
        </button>

        {comoFuncionaOpen && (
          <div className="px-6 pb-6 flex flex-col gap-4 border-t border-itec-section-trueketec/60 pt-5">
            <ol className="flex flex-col gap-3 text-xs sm:text-sm text-itec-text/80">
              {PASOS_COMO_FUNCIONA.map((paso, i) => (
                <li key={paso.titulo} className="flex gap-2">
                  <span className="text-itec-section-trueketec font-bold">{i + 1}.</span>
                  <p><strong className="text-white">{paso.titulo}:</strong> {paso.detalle}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* ── DIRECTORIO PÚBLICO ── */}
      <section className="bg-itec-surface flex flex-col gap-6">
        <TrueketecFiltersBar initialFilters={filters} onApply={applyFilters} allowedDepts={allowedDepts} materiaOptions={materiaOptions} />
        <div className="mt-2">
          {!hasSearched ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl bg-itec-box border border-itec-border">
              <SlidersHorizontal className="w-8 h-8 text-white/20" />
              <p className="text-sm font-medium text-white/50 text-center max-w-sm px-4">
                {MENSAJES.estadoInicial}
              </p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-itec-box border border-itec-border animate-pulse" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl bg-itec-box border border-itec-border">
              <Inbox className="w-8 h-8 text-white/20" />
              <p className="text-sm font-medium text-white/50 text-center">{MENSAJES.sinResultados}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Resultados del Directorio</span>
                <span className="text-[10px] font-mono text-itec-muted bg-itec-box px-2 py-0.5 rounded border border-itec-border">Total: {total}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((p) => <TrueketecCard key={p._id} post={p} onContact={handleContact} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} className="p-2 rounded-xl bg-itec-box border border-itec-border disabled:opacity-30 text-white hover:bg-itec-bg"><ChevronLeft size={16} /></button>
                  <span className="text-xs font-mono font-bold text-white/70 px-4 py-2 bg-itec-box rounded-xl border border-itec-border">Pág {currentPage} de {totalPages}</span>
                  <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages} className="p-2 rounded-xl bg-itec-box border border-itec-border disabled:opacity-30 text-white hover:bg-itec-bg"><ChevronRight size={16} /></button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── MODALES ── */}
      <MyPostsModal isOpen={myPostsModalOpen} onClose={() => setMyPostsModalOpen(false)} matches={matches} myPosts={myPosts} onContact={handleContact} />
      <ContactModal post={contactPost} isOwn={!!isOwnContact} onClose={() => setContactPost(null)} onEstadoChanged={(id, estado) => { updateEstadoLocal(id, estado as EstadoPost); setContactPost((prev) => prev ? { ...prev, estado: estado as EstadoPost } : null); }} onOpenPostulante={(p) => { setContactPost(null); setPostulante(p); }} />
      <PostulanteModal postulante={postulante} onClose={() => setPostulante(null)} />
      <TrueketecPublishModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onPublish={publish} allowedDepts={allowedDepts} materiaOptions={materiaOptions} />
    </div>
  );
};

export default TruekeTECPage;
