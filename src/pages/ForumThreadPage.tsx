import React, { useEffect, useState }    from 'react';
import { useParams, useNavigate }        from 'react-router-dom';
import { MainLayout }                    from '@components/templates/MainLayout';
import { ThreadView }                    from '@features/forum/components/organisms/ThreadView';
import { usePageTitle }                  from '@hooks/usePageTitle';
import { forumService }                  from '@features/forum/services/forumService';
import type { ForumPost }                from '@features/forum/types/forum';

export const ForumThreadPage: React.FC = () => {
  usePageTitle('Hilo · Foro Anónimo · iTEC BA');
  const { postId }                = useParams<{ postId: string }>();
  const navigate                  = useNavigate();
  const [post, setPost]           = useState<ForumPost | null>(null);
  const [replies, setReplies]     = useState<ForumPost[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

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
    const upd = (p: ForumPost): ForumPost => p.id === id
      ? { ...p, upvotes, user_vote: p.user_vote === value ? 0 : value }
      : p;
    if (post) setPost(upd(post));
    setReplies(prev => prev.map(upd));
  };

  const handleRepost = async (id: number) => {
    const { reposts, is_reposted } = await forumService.repost(id);
    const upd = (p: ForumPost): ForumPost => p.id === id ? { ...p, reposts, is_reposted } : p;
    if (post) setPost(upd(post));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    await forumService.deletePost(id);
    if (post?.id === id) navigate('/foro', { replace: true });
    else setReplies(prev => prev.filter(r => r.id !== id));
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
        <button onClick={() => navigate('/foro')} className="text-itec-red text-sm mt-4 hover:underline">
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
              onDelete={handleDelete}
              onReply={handleReply}
            />
          ) : (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-itec-border border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ForumThreadPage;
