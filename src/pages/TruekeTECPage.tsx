// src/pages/TruekeTECPage.tsx
import React, { useState } from "react";
import { Navigate }        from "react-router-dom";
import { ArrowLeftRight, ChevronLeft, ChevronRight, Inbox, Plus, ShieldAlert, Sparkles } from "lucide-react";
import { MainLayout }                 from "@components/templates/MainLayout";
import { Button }                     from "@components/ui/Button";
import { useAuth }                    from "@context/AuthContext";
import { useTrueketec }               from "@features/trueketec/hooks/useTrueketec";
import { TrueketecFiltersBar }        from "@features/trueketec/components/molecules/TrueketecFilters";
import { TrueketecCard }              from "@features/trueketec/components/molecules/TrueketecCard";
import { TrueketecPublishModal }      from "@features/trueketec/components/organisms/TrueketecPublishModal";
import { ContactModal }               from "@features/trueketec/components/organisms/ContactModal";
import { PostulanteModal }            from "@features/trueketec/components/organisms/PostulanteModal";
import type { TrueketecPost, EstadoPost, Postulante } from "@features/trueketec/types/trueketec.types";

// ── Guard de acceso ──────────────────────────────────────────────────────
export const TruekeTECPage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 rounded-full border-2 border-itec-sky border-t-transparent animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isUTN = user?.email?.endsWith("@frba.utn.edu.ar");

  if (!isUTN) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-itec-accent/30 bg-itec-accent/10">
            <ShieldAlert size={28} className="text-itec-accent" />
          </div>
          <h2 className="text-2xl font-bold text-itec-text">Acceso restringido</h2>
          <p className="max-w-sm text-sm text-itec-muted">
            TruekeTEC es exclusivo para estudiantes con cuenta institucional{" "}
            <span className="font-semibold text-itec-sky">@frba.utn.edu.ar</span>.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <TruekeTECContent
        userId={user!.id ?? ""}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </MainLayout>
  );
};

// ── Contenido principal ──────────────────────────────────────────────────
interface ContentProps {
  userId:       string;
  modalOpen:    boolean;
  setModalOpen: (v: boolean) => void;
}

const TruekeTECContent: React.FC<ContentProps> = ({ userId, modalOpen, setModalOpen }) => {
  const {
    posts, myPosts, matches, total, totalPages, currentPage,
    filters, loading, error, hasSearched,
    applyFilters, goToPage, publish, updateEstadoLocal,
  } = useTrueketec();

  // ── Estado para modales ───────────────────────────────────────────────
  const [contactPost,    setContactPost]    = useState<TrueketecPost | null>(null);
  const [postulante,     setPostulante]     = useState<Postulante | null>(null);

  const handleContact = (p: TrueketecPost) => setContactPost(p);
  const isOwnContact  = contactPost?.userId === userId;

  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col gap-6 pb-24 px-2">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-itec-sky/30 bg-itec-sky/10">
              <ArrowLeftRight size={16} className="text-itec-sky" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-itec-text">TruekeTEC</h1>
          </div>
          <p className="text-sm text-itec-muted">
            Intercambio de comisiones entre estudiantes de UTN FRBA.
          </p>
        </div>
        <Button
          variant="success"
          hierarchy="solid"
          text="Publicar intercambio"
          onClick={() => setModalOpen(true)}
          className="hidden sm:inline-flex rounded-xl py-2.5 px-5 text-sm"
        />
      </div>

      {/* ── Error ────────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl border border-itec-accent/30 bg-itec-accent/10 px-4 py-3 text-sm text-itec-accent">
          {error}
        </div>
      )}

      {/* ── Matches perfectos ─────────────────────────────────────────── */}
      {matches.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">
              Tus matches perfectos ({matches.length})
            </h2>
          </div>
          {/* Banner destacado de match perfecto */}
          <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matches.map((m) => (
                <TrueketecCard
                  key={m._id}
                  post={{ ...m, isPerfectMatch: true }}
                  onContact={handleContact}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Mis publicaciones activas ──────────────────────────────── */}
      {myPosts.filter(p => p.estado === "Activo").length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-bold text-itec-muted uppercase tracking-widest">
            Mis publicaciones activas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myPosts.filter(p => p.estado === "Activo").map((p) => (
              <TrueketecCard key={p._id} post={p} onContact={handleContact} />
            ))}
          </div>
        </section>
      )}

      {/* ── Filtros (obligatorio buscar) ───────────────────────────── */}
      <TrueketecFiltersBar initialFilters={filters} onApply={applyFilters} />

      {/* ── Feed ──────────────────────────────────────────────────────── */}
      {!hasSearched ? (
        <div className="flex flex-col items-center gap-3 py-12 text-itec-muted/60">
          <ArrowLeftRight size={36} className="opacity-30" />
          <p className="text-sm text-center">
            Usá los filtros de arriba para buscar intercambios disponibles.
          </p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 rounded-xl border border-itec-border bg-itec-box animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-itec-muted">
          <Inbox size={36} className="opacity-30" />
          <p className="text-sm font-medium">No hay solicitudes activas con esos filtros.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-itec-muted">
            {total} solicitud{total !== 1 ? "es" : ""} activa{total !== 1 ? "s" : ""} encontrada{total !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {posts.map((p) => (
              <TrueketecCard
                key={p._id}
                post={p}
                onContact={handleContact}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 rounded-xl border border-itec-border px-3 py-2 text-sm text-itec-muted transition-colors hover:bg-itec-surface disabled:opacity-30"
              >
                <ChevronLeft size={14} /> Anterior
              </button>
              <span className="text-xs text-itec-muted px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 rounded-xl border border-itec-border px-3 py-2 text-sm text-itec-muted transition-colors hover:bg-itec-surface disabled:opacity-30"
              >
                Siguiente <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Modal 1: Contacto / gestión del dueño ────────────────────── */}
      <ContactModal
        post={contactPost}
        isOwn={!!isOwnContact}
        onClose={() => setContactPost(null)}
        onEstadoChanged={(id, estado) => {
          updateEstadoLocal(id, estado as EstadoPost);
          setContactPost((prev) => prev ? { ...prev, estado: estado as EstadoPost } : null);
        }}
        onOpenPostulante={(p) => {
          setContactPost(null);
          setPostulante(p);
        }}
      />

      {/* ── Modal 2: Ofertas del interesado ──────────────────────────── */}
      <PostulanteModal
        postulante={postulante}
        onClose={() => setPostulante(null)}
      />

      {/* ── Modal de publicación ──────────────────────────────────────── */}
      <TrueketecPublishModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onPublish={publish}
      />

      {/* ── FAB mobile ────────────────────────────────────────────────── */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 sm:hidden flex items-center justify-center w-14 h-14 rounded-full bg-itec-emerald shadow-lg shadow-itec-emerald/30 text-white transition-transform active:scale-95 hover:brightness-110"
        aria-label="Publicar intercambio"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default TruekeTECPage;
