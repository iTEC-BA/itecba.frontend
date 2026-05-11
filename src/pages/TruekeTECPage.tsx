// src/pages/TruekeTECPage.tsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { ArrowLeftRight, Plus, ShieldAlert, Sparkles } from "lucide-react";
import { MainLayout } from "@components/templates/MainLayout";
import { Button } from "@components/ui/Button";
import { useAuth } from "@context/AuthContext";
import { useTrueketec } from "@features/trueketec/hooks/useTrueketec";
import { TrueketecFiltersBar } from "@features/trueketec/components/molecules/TrueketecFilters";
import { TrueketecFeed } from "@features/trueketec/components/organisms/TrueketecFeed";
import { TrueketecPublishModal } from "@features/trueketec/components/organisms/TrueketecPublishModal";
import { TrueketecCard } from "@features/trueketec/components/molecules/TrueketecCard";

// ── Page (con guards de auth) ────────────────────────────────
const TruekeTECPage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Spinner mientras Firebase resuelve la sesión
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

  // Cuenta no institucional
  if (!isUTN) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-itec-accent/30 bg-itec-accent/10">
            <ShieldAlert size={28} className="text-itec-accent" />
          </div>
          <h2 className="text-2xl font-bold text-itec-text">Acceso restringido</h2>
          <p className="max-w-sm text-sm text-itec-muted">
            TruekeTEC es exclusivo para estudiantes con cuenta institucional{" "}
            <span className="font-semibold text-itec-sky">@frba.utn.edu.ar</span>.
            Tu cuenta actual no cumple este requisito.
          </p>
          <p className="text-xs text-itec-muted">
            Sesión activa: <span className="font-mono text-itec-text">{user?.email}</span>
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <TruekeTECContent
        userId={user!.id ?? ""}
        userEmail={user!.email}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </MainLayout>
  );
};

// ── Contenido principal (separado para mantener guards limpios) ──
interface ContentProps {
  userId:       string;
  userEmail:    string;
  modalOpen:    boolean;
  setModalOpen: (v: boolean) => void;
}

const TruekeTECContent: React.FC<ContentProps> = ({
  userId, modalOpen, setModalOpen,
}) => {
  const {
    posts, matches, total, totalPages, currentPage,
    filters, loading, error,
    applyFilters, goToPage, publish, remove, accept,
  } = useTrueketec();

  const myPosts = posts.filter((p) => p.userId === userId);

  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col gap-5 pb-20">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-itec-sky/30 bg-itec-sky/10">
              <ArrowLeftRight size={16} className="text-itec-sky" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-itec-text">
              TruekeTEC
            </h1>
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
          className="hidden sm:inline-flex rounded-2xl py-2.5 px-5 text-sm"
        />
      </div>

      {/* ── Error global ────────────────────────────────────── */}
      {error && (
        <div className="rounded-2xl border border-itec-accent/30 bg-itec-accent/10 px-4 py-3 text-sm text-itec-accent">
          {error}
        </div>
      )}

      {/* ── Mis matches directos ────────────────────────────── */}
      {matches.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-itec-emerald" />
            <h2 className="text-sm font-bold text-itec-emerald uppercase tracking-widest">
              Tus matches directos ({matches.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matches.map((m) => (
              <TrueketecCard
                key={m._id}
                post={{ ...m, isMatch: true }}
                myPostId={m.myPostId}
                onAccept={accept}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Mis publicaciones activas ───────────────────────── */}
      {myPosts.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-bold text-itec-muted uppercase tracking-widest">
            Mis publicaciones activas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myPosts.map((p) => (
              <TrueketecCard key={p._id} post={p} isOwn onDelete={remove} />
            ))}
          </div>
        </section>
      )}

      {/* ── Filtros ────────────────────────────────────────── */}
      <TrueketecFiltersBar initialFilters={filters} onApply={applyFilters} />

      {/* ── Feed ───────────────────────────────────────────── */}
      <TrueketecFeed
        posts={posts.filter((p) => p.userId !== userId)}
        myUid={userId}
        myPosts={myPosts}
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
        loading={loading}
        onDelete={remove}
        onAccept={accept}
        onPage={goToPage}
      />

      {/* ── Modal de publicación ───────────────────────────── */}
      <TrueketecPublishModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onPublish={publish}
      />

      {/* ── FAB mobile ─────────────────────────────────────── */}
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

export { TruekeTECPage };
export default TruekeTECPage;
