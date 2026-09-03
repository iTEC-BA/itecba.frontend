import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { 
  Handshake, ChevronLeft, ChevronRight, 
  Inbox, Plus, ShieldAlert, Search, SlidersHorizontal, Settings2
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

export const TruekeTECPage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [myPostsModalOpen, setMyPostsModalOpen] = useState(false);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="h-8 w-8 rounded-full border-2 border-itec-surface border-t-itec-blue-skye animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!user?.email?.endsWith("@frba.utn.edu.ar")) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center gap-5 py-24 px-4 text-center max-w-md mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-itec-surface">
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
      <TruekeTECContent userId={user!.id ?? ""} modalOpen={modalOpen} setModalOpen={setModalOpen} myPostsModalOpen={myPostsModalOpen} setMyPostsModalOpen={setMyPostsModalOpen} />
    </MainLayout>
  );
};

interface ContentProps {
  userId: string;
  modalOpen: boolean;
  setModalOpen: (v: boolean) => void;
  myPostsModalOpen: boolean;
  setMyPostsModalOpen: (v: boolean) => void;
}

const TruekeTECContent: React.FC<ContentProps> = ({ userId, modalOpen, setModalOpen, myPostsModalOpen, setMyPostsModalOpen }) => {
  const { posts, myPosts, matches, allowedDepts, total, totalPages, currentPage, filters, loading, error, hasSearched, applyFilters, goToPage, publish, updateEstadoLocal } = useTrueketec();

  const [contactPost, setContactPost] = useState<TrueketecPost | null>(null);
  const [postulante, setPostulante] = useState<Postulante | null>(null);

  const handleContact = (p: TrueketecPost) => setContactPost(p);
  const isOwnContact  = contactPost?.userId === userId;

  return (
    <div className="mx-auto max-w-5xl w-full flex flex-col gap-6 pb-24 px-2 sm:px-4 mt-2">

      {/* ── ENCABEZADO Y ACCIONES RÁPIDAS ── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-itec-box rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-itec-surface text-itec-blue-skye">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Módulo Académico</p>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none mt-0.5">TruekeTEC</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="slate" hierarchy="outline" icon={<Settings2 className="w-4 h-4"/>} text="Mis Solicitudes" onClick={() => setMyPostsModalOpen(true)} className="flex-1 sm:flex-none py-2.5 rounded-xl bg-itec-surface border-transparent" />
          <Button variant="primary" hierarchy="solid" icon={<Plus className="w-4 h-4"/>} text="Cargar Solicitud" onClick={() => setModalOpen(true)} className="flex-1 sm:flex-none py-2.5 rounded-xl bg-itec-blue-skye text-black font-bold hover:bg-itec-blue" />
        </div>
      </header>

      {error && (
        <div className="bg-itec-box rounded-2xl p-4 flex items-center gap-3 text-xs text-itec-red font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0" /> <p>{error}</p>
        </div>
      )}

      {/* ── BANNER INFORMATIVO (ADAPTADO A LA PLATAFORMA TRUEKETEC) ── */}
      <div className="flex items-start gap-4 bg-itec-blue-skye/10 border border-itec-blue-skye/20 rounded-3xl p-5 sm:p-6 text-sm text-itec-text/80 leading-relaxed">
        <div className="flex flex-col gap-4">
          
          <strong className="text-white font-bold text-base">¿Cómo funciona el trueque en la plataforma?</strong>
          
          <ol className="flex flex-col gap-3 text-xs sm:text-sm">
            <li className="flex gap-2">
              <span className="text-itec-blue-skye font-bold">1.</span>
              <p>
                <strong className="text-white">Cargá tu solicitud:</strong> Hacé clic en el botón <strong className="text-white">"Cargar Solicitud"</strong> de arriba para publicar tu comisión actual y las que te sirven de destino.
              </p>
            </li>
            <li className="flex gap-2">
              <span className="text-itec-blue-skye font-bold">2.</span>
              <p>
                <strong className="text-white">Buscá tu match:</strong> Usá los filtros del <strong className="text-white">Directorio General</strong> de acá abajo para encontrar a alguien compatible y contactalo.
              </p>
            </li>
            <li className="flex gap-2">
              <span className="text-itec-blue-skye font-bold">3.</span>
              <p>
                <strong className="text-white">Oficializá el cambio:</strong> Cuando ambos estén de acuerdo, es fundamental que <strong className="text-white">LOS DOS</strong> envíen un mail a <a href="mailto:sguglielmino@frba.utn.edu.ar" className="text-itec-blue-skye font-bold hover:underline">sguglielmino@frba.utn.edu.ar</a> para que la gestión actualice el registro oficial.
              </p>
            </li>
          </ol>

          <div className="mt-2 flex items-start gap-2 bg-itec-box/50 p-3 rounded-xl border border-white/5">
            <span className="text-lg leading-none">⚠️</span>
            <p className="text-[11px] sm:text-xs text-itec-muted">
              En caso de que en gestión no den la posibilidad del trueque, den aviso de inmediato al <strong className="text-white">1128629988 (Santiago)</strong>.
            </p>
          </div>
          
        </div>
      </div>

      {/* ── DIRECTORIO PÚBLICO BENTO ── */}
      <section className="bg-itec-surface rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Search className="w-5 h-5 text-white/50" />
          <h2 className="text-lg font-bold text-white tracking-tight">Directorio General</h2>
        </div>
        
        <TrueketecFiltersBar initialFilters={filters} onApply={applyFilters} allowedDepts={allowedDepts} />

        <div className="mt-2">
          {!hasSearched ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl bg-itec-box">
              <SlidersHorizontal className="w-8 h-8 text-white/20" />
              <p className="text-sm font-medium text-white/50 text-center max-w-sm px-4">
                Establezca los parámetros de búsqueda para consultar el directorio oficial.
              </p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-itec-box animate-pulse" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl bg-itec-box">
              <Inbox className="w-8 h-8 text-white/20" />
              <p className="text-sm font-medium text-white/50 text-center">Sin resultados para esta búsqueda.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Resultados del Directorio</span>
                <span className="text-[10px] font-mono text-itec-muted bg-itec-box px-2 py-0.5 rounded">Total: {total}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((p) => <TrueketecCard key={p._id} post={p} onContact={handleContact} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} className="p-2 rounded-xl bg-itec-box disabled:opacity-30 text-white hover:bg-itec-bg"><ChevronLeft size={16} /></button>
                  <span className="text-xs font-mono font-bold text-white/70 px-4 py-2 bg-itec-box rounded-xl">Pág {currentPage} de {totalPages}</span>
                  <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages} className="p-2 rounded-xl bg-itec-box disabled:opacity-30 text-white hover:bg-itec-bg"><ChevronRight size={16} /></button>
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
      <TrueketecPublishModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onPublish={publish} allowedDepts={allowedDepts} />
    </div>
  );
};

export default TruekeTECPage;
