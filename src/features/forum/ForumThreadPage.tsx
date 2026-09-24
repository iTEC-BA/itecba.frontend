import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout }                 from '@components/templates/MainLayout';
import { LayoutModal }                from '@components/templates/LayoutModal';
import { Button }                     from '@/components/ui/Button';
import { ThreadView }                 from '@features/forum/components/organisms/ThreadView';
import { usePageTitle }               from '@hooks/usePageTitle';
import { forumService }               from '@features/forum/services/forumService';
import type { ForumPost }             from '@features/forum/types/forum';

export const ForumThreadPage: React.FC = () => {
  usePageTitle('Hilo · Foro Anónimo · iTEC BA');
  const { "*": splat }                 = useParams();
  const pathIds = (splat ?? '').split('/').filter(Boolean);
  const postId = pathIds[pathIds.length - 1];
  const navigate                      = useNavigate();
  const [post,         setPost]       = useState<ForumPost | null>(null);
  const [replies,      setReplies]    = useState<ForumPost[]>([]);
  const [loading,      setLoading]    = useState(true);
  const [error,        setError]      = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [ancestors, setAncestors] = useState<ForumPost[]>([]);
  const [deleting,     setDeleting]   = useState(false);

  useEffect(() => {
    const routeIds = (splat ?? '').split('/').filter(Boolean);
    const routePostId = routeIds[routeIds.length - 1];

    if (!routePostId || routeIds.some(id => !/^\d+$/.test(id))) {
      setError('Hilo inválido');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all(routeIds.map(id => forumService.getThread(Number(id))))
      .then(results => {
        const current = results[results.length - 1];
        setAncestors(results.slice(0, -1).map(result => result.post));
        setPost(current.post);
        setReplies(current.replies);
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false));
  }, [splat]);

  const handleVote = async (id: number, value: 1 | -1) => {
    const { upvotes } = await forumService.vote(id, value);
    const upd = (p: ForumPost): ForumPost =>
      p.id === id ? { ...p, upvotes, user_vote: p.user_vote === value ? 0 : value } : p;
    if (post) setPost(upd(post));
    setReplies(prev => prev.map(upd));
  };

  const handleRepost = async (id: number) => {
    const { reposts, is_reposted } = await forumService.repost(id);
    const upd = (p: ForumPost): ForumPost =>
      p.id === id ? { ...p, reposts, is_reposted } : p;
    if (post) setPost(upd(post));
  };

  // Abre el modal de confirmación
  const requestDelete = (id: number) => setDeleteTarget(id);

  const confirmDelete = async () => {
    if (deleteTarget === null) return;
    setDeleting(true);
    try {
      await forumService.deletePost(deleteTarget);
      if (post?.id === deleteTarget) {
        navigate('/foro', { replace: true });
      } else {
        setReplies(prev => prev.filter(r => r.id !== deleteTarget));
        if (post) setPost(p => p ? { ...p, reply_count: Math.max(0, (p.reply_count || 1) - 1) } : p);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleReply = async (_parentId: number, body: string) => {
    const reply = await forumService.createReply(Number(postId), body);
    setReplies(prev => [...prev, reply]);
    if (post) setPost(p => p ? { ...p, reply_count: (p.reply_count || 0) + 1 } : p);
    navigate(`/foro/${[...pathIds, reply.id].join('/')}`);
    return reply;
  };

  const openReply = (id: number) => {
    navigate(`/foro/${[...pathIds, id].join('/')}`);
  };

  if (error) return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-itec-muted text-sm">{error}</p>
        <button
          onClick={() => navigate('/foro')}
          className="text-itec-red text-sm mt-4 hover:underline"
        >
          Volver al foro
        </button>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto w-full">
        <div className="rounded-xl border border-itec-border/50 overflow-hidden bg-itec-bg">
          {post ? (
            <>
              {ancestors.length > 0 && (
                <div className="border-b border-itec-border/50 bg-itec-card px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-itec-muted">
                    Hilo
                  </p>
                  <div className="flex flex-wrap items-center gap-1 text-xs">
                    <Link to="/foro" className="text-itec-red hover:underline">Foro</Link>
                    {ancestors.map((ancestor, index) => (
                      <React.Fragment key={ancestor.id}>
                        <span className="text-itec-muted">/</span>
                        <Link
                          to={`/foro/${pathIds.slice(0, index + 1).join('/')}`}
                          className="max-w-32 truncate text-itec-muted hover:text-itec-text"
                        >
                          {ancestor.pseudonym}
                        </Link>
                      </React.Fragment>
                    ))}
                    <span className="text-itec-muted">/</span>
                    <span className="font-semibold text-itec-text">{post.pseudonym}</span>
                  </div>
                </div>
              )}
              <ThreadView
                post={post}
                replies={replies}
                loading={loading}
                onClose={() => navigate('/foro')}
                onVote={handleVote}
                onRepost={handleRepost}
                onDelete={requestDelete}
                onReply={handleReply}
                onOpenReply={openReply}
              />
            </>
          ) : (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-itec-border/50 border-t-itec-red rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmación de borrado */}
      <LayoutModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar publicación"
        description="Esta acción es permanente y no se puede deshacer."
        maxWidth="max-w-sm"
      >
        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          <Button variant="secondary" hierarchy="ghost" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            hierarchy="solid"
            onClick={confirmDelete}
            isLoading={deleting}
          >
            Sí, eliminar
          </Button>
        </div>
      </LayoutModal>
    </MainLayout>
  );
};

export default ForumThreadPage;
