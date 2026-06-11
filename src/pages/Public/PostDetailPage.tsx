// src/pages/Public/PostDetailPage.tsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Edit3, Trash2, Loader2,
  ArrowLeft, Share2, Flag,
} from 'lucide-react';

import { getPostDetail, deletePost } from '../../features/User/F16_Post/api';
import VoteControl from '../../features/User/F22_VoteSystem/components/VoteControl';
import CommentList from '../../features/User/F17_Comment/components/CommentList';
import BookmarkToggle from '../../features/User/F24_BookmarkPost/components/BookmarkToggle';
import TrendingSidebar from '../../features/Common/F7_TrendingPopularPost/components/TrendingSidebar';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useAuthStore } from '../../store/useAuthStore';
import type { Comment } from '../../features/User/F17_Comment/types';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} mnt lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

/** Render body with code block support (``` blocks → styled <pre>) */
function PostBody({ body }: { body: string }) {
  const parts = body.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-[15px] text-gray-200 leading-[1.8] space-y-4">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3);
          // Strip optional language identifier on first line
          const firstNewline = code.indexOf('\n');
          const content = firstNewline > 0 && firstNewline < 30 ? code.slice(firstNewline + 1) : code;
          return (
            <pre
              key={i}
              className="bg-[#1A1A1C] border border-[#2A2A2C] rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed"
            >
              <code>{content.trim()}</code>
            </pre>
          );
        }
        return part ? (
          <p key={i} className="whitespace-pre-wrap">{part}</p>
        ) : null;
      })}
    </div>
  );
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostDetail(id!),
    enabled: !!id,
  });

  const post = data?.data;
  const isOwner = user?.id === post?.user_id;

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id!),
    onSuccess: () => navigate('/'),
  });

  const handleDelete = () => {
    if (window.confirm('Yakin ingin menghapus postingan ini?')) {
      deleteMutation.mutate();
    }
  };

  // ─── Loading ───
  if (isLoading) {
    return (
      <div className="flex gap-6 py-8 px-6 max-w-6xl mx-auto">
        <div className="flex-1 min-w-0 space-y-6">
          <Skeleton className="w-3/4 h-10" />
          <div className="flex gap-2"><Skeleton className="w-24 h-6 rounded-full" /><Skeleton className="w-24 h-6 rounded-full" /></div>
          <Skeleton className="w-full h-4" /><Skeleton className="w-full h-4" /><Skeleton className="w-2/3 h-4" />
        </div>
        <aside className="w-[320px] flex-shrink-0 hidden xl:block"><TrendingSidebar /></aside>
      </div>
    );
  }

  // ─── Error ───
  if (isError || !post) {
    return (
      <div className="flex gap-6 py-8 px-6 max-w-6xl mx-auto">
        <div className="flex-1 text-center py-20">
          <p className="text-gray-400 text-lg mb-4">Postingan tidak ditemukan atau telah dihapus.</p>
          <Button variant="outline" onClick={() => navigate('/')} className="border-[#2A2A2C] text-gray-400 hover:bg-[#161618]">
            <ArrowLeft className="w-4 h-4 mr-2" />Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const allComments: Comment[] = (post as any).comments || [];
  const topLevelComments = allComments.filter((c) => !c.parent_id);
  topLevelComments.sort((a, b) => {
    if (a.is_accepted && !b.is_accepted) return -1;
    if (!a.is_accepted && b.is_accepted) return 1;
    return b.vote_score - a.vote_score;
  });

  return (
    <div className="flex gap-6 py-8 px-6 max-w-6xl mx-auto">
      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0">

        {/* ── Title ── */}
        <h1 className="text-[26px] font-bold text-white leading-snug mb-4">
          {post.title}
        </h1>

        {/* ── Tags + Metadata Row ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            {post.category && (
              <Link to={`/categories`}>
                <Badge variant="outline" className="text-xs bg-[#1E1E20] text-gray-400 border-[#2A2A2C] px-3 py-1 h-auto hover:border-[#D4AF37]/40 transition-colors">
                  {post.category.name}
                </Badge>
              </Link>
            )}
            {post.tags?.map((tag) => (
              <Link key={tag.id} to={`/tags/${tag.slug}`}>
                <Badge variant="outline" className="text-xs bg-[#1E1E20] text-gray-400 border-[#2A2A2C] px-3 py-1 h-auto hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            Ditanyakan {timeAgo(post.created_at)} &bull; Dilihat {formatCount(post.view_count)} kali
          </span>
        </div>

        {/* ── Question Body with Vote ── */}
        <div className="flex gap-5 mb-6">
          <VoteControl
            targetId={post.id}
            targetType="post"
            initialScore={post.vote_score}
            className="pt-1"
          />
          <div className="flex-1 min-w-0">
            <PostBody body={post.body} />
          </div>
        </div>

        {/* ── Action Buttons Row ── */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#2A2A2C]">
          {user && <BookmarkToggle postId={post.id} />}
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#D4AF37] transition-colors px-2 py-1.5 rounded hover:bg-[#1A1A1C]"
          >
            <Share2 className="w-3.5 h-3.5" />
            Bagikan
          </button>
          {user && !isOwner && (
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded hover:bg-[#1A1A1C]">
              <Flag className="w-3.5 h-3.5" />
              Report
            </button>
          )}
          {isOwner && (
            <>
              <button
                onClick={() => navigate(`/posts/${post.id}/edit`)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#D4AF37] transition-colors px-2 py-1.5 rounded hover:bg-[#1A1A1C]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded hover:bg-[#1A1A1C] disabled:opacity-50"
              >
                {deleteMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Hapus
              </button>
            </>
          )}

          {/* Author badge — right-aligned */}
          {post.user && (
            <Link
              to={`/profile/${post.user.id}`}
              className="flex items-center gap-2.5 ml-auto hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-9 w-9">
                {post.user.avatar_url ? (
                  <AvatarImage src={post.user.avatar_url} alt={post.user.username} />
                ) : null}
                <AvatarFallback className="bg-[#D4AF37] text-black text-[11px] font-bold">
                  {post.user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors">
                  {post.user.username}
                </p>
                <p className="text-[11px] text-gray-500">
                  Rep: {post.user.reputation_points.toLocaleString()}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* ── Answers / Comments Section ── */}
        <CommentList
          postId={post.id}
          comments={topLevelComments}
          postOwnerId={post.user_id}
          acceptedAnswerId={post.accepted_answer_id}
        />
      </div>

      {/* ── Right Sidebar ── */}
      <aside className="w-[320px] flex-shrink-0 hidden xl:block">
        <TrendingSidebar />
      </aside>
    </div>
  );
}
