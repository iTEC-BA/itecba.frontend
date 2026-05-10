import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }     from 'react-router-dom';
import { MainLayout }                 from '@components/templates/MainLayout';
import { LayoutModal }                from '@components/templates/LayoutModal';
import { Button }                     from '@/components/ui/Button';
import { ThreadView }                 from '@features/forum/components/organisms/ThreadView';
import { usePageTitle }               from '@hooks/usePageTitle';
import { forumService }               from '@features/forum/services/forumService';
import type { ForumPost }             from '@features/forum/types/forum';

export const ForumThreadPage: React.FC = () => {
  usePageTitle('Hilo · Foro Anónimo · iTEC BA');
  const { postId }                    = useParams<{ postId: string }>();
  const navigate                      = useNavigate();
  const [post,         setPost]       = useState<ForumPost | null>(null);
  const [replies,      setReplies]    = useState<ForumPost[]>([]);
  const [loading,      setLoading]    = useState(true);
  const [error,        setError]      = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting,     setDeleting]   = useState(false);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    forumService
      .getThread(Number(postId))
      .then(data => { setPost(data.post); setReplies(data.replies); })
      .catch(e => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false));
  }, [postId]);

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
        <div className="rounded-2xl border border-itec-border overflow-hidden bg-itec-bg">
          {post ? (
            <ThreadView
              post={post}
              replies={replies}
              loading={loading}
              onClose={() => navigate('/foro')}
              onVote={handleVote}
              onRepost={handleRepost}
              onDelete={requestDelete}
              onReply={handleReply}
            />
          ) : (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-itec-border border-t-itec-red rounded-full animate-spin" />
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
