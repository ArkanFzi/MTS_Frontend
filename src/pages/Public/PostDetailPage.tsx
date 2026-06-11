// src/pages/Public/PostDetailPage.tsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Eye, Calendar, MessageCircle, Edit3, Trash2, Loader2,
  ArrowLeft, Share2,
} from 'lucide-react';

import { getPostDetail, deletePost } from '../../features/User/F16_Post/api';
import VoteControl from '../../features/User/F22_VoteSystem/components/VoteControl';
import CommentList from '../../features/User/F17_Comment/components/CommentList';
import BookmarkToggle from '../../features/User/F24_BookmarkPost/components/BookmarkToggle';
import TrendingSidebar from '../../features/Common/F7_TrendingPopularPost/components/TrendingSidebar';

import { Card } from '../../components/ui/card';
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
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

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
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-3/4 h-8" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
          <div className="flex gap-2">
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
        </div>
        <aside className="w-[320px] flex-shrink-0 hidden xl:block">
          <TrendingSidebar />
        </aside>
      </div>
    );
  }

  // ─── Error ───
  if (isError || !post) {
    return (
      <div className="flex gap-6 py-8 px-6 max-w-6xl mx-auto">
        <div className="flex-1 text-center py-20">
          <p className="text-gray-400 text-lg mb-4">Postingan tidak ditemukan atau telah dihapus.</p>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-[#2A2A2C] text-gray-400 hover:bg-[#161618]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  // Extract top-level comments (parent_id === null) from the post data
  const allComments: Comment[] = (post as any).comments || [];
  const topLevelComments = allComments.filter((c) => !c.parent_id);

  // Sort: accepted answer first, then by vote_score desc
  topLevelComments.sort((a, b) => {
    if (a.is_accepted && !b.is_accepted) return -1;
    if (!a.is_accepted && b.is_accepted) return 1;
    return b.vote_score - a.vote_score;
  });

  return (
    <div className="flex gap-6 py-8 px-6 max-w-6xl mx-auto">
      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0 space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-gray-400 line-clamp-1">{post.title}</span>
        </div>

        {/* ── Post Card ── */}
        <Card className="border-[#2A2A2C] bg-[#161618]">
          <div className="p-6">
            <div className="flex gap-5">
              {/* Vote */}
              <VoteControl
                targetId={post.id}
                targetType="post"
                initialScore={post.vote_score}
                className="pt-1"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Status badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {post.is_answered && (
                    <Badge className="bg-green-950/50 text-green-400 border-green-900 text-[10px] h-5 font-bold uppercase tracking-wider">
                      Sudah Dijawab
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`text-[10px] h-5 ${
                      post.status === 'open'
                        ? 'border-blue-900 text-blue-400'
                        : 'border-gray-700 text-gray-500'
                    }`}
                  >
                    {post.status === 'open' ? 'Open' : 'Closed'}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold text-white leading-snug mb-4">
                  {post.title}
                </h1>

                {/* Body */}
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mb-5">
                  {post.body}
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap mb-5">
                  {post.category && (
                    <Badge
                      variant="outline"
                      className="text-[11px] bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] px-2.5 py-0.5 h-auto"
                    >
                      {post.category.name}
                    </Badge>
                  )}
                  {post.tags?.map((tag) => (
                    <Link key={tag.id} to={`/tags/${tag.slug}`}>
                      <Badge
                        variant="outline"
                        className="text-[11px] bg-[#1A1A1C] text-[#D4AF37] border-[#2A2A2C] px-2.5 py-0.5 h-auto hover:border-[#D4AF37]/50 cursor-pointer transition-colors"
                      >
                        #{tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500 pb-4 border-b border-[#2A2A2C]">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {post.view_count.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {timeAgo(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {allComments.length} komentar
                  </span>
                </div>

                {/* Author + Actions */}
                <div className="flex items-center justify-between pt-4">
                  {post.user && (
                    <Link
                      to={`/profile/${post.user.id}`}
                      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="h-8 w-8">
                        {post.user.avatar_url ? (
                          <AvatarImage src={post.user.avatar_url} alt={post.user.username} />
                        ) : null}
                        <AvatarFallback className="bg-[#D4AF37] text-black text-[11px] font-bold">
                          {post.user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white hover:text-[#D4AF37] transition-colors">
                          {post.user.username}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {post.user.reputation_points} poin
                        </p>
                      </div>
                    </Link>
                  )}

                  {/* Owner actions */}
                  <div className="flex items-center gap-2">
                    {user && (
                      <BookmarkToggle postId={post.id} />
                    )}
                    <button
                      onClick={() => navigator.clipboard.writeText(window.location.href)}
                      className="p-2 text-gray-500 hover:text-[#D4AF37] transition-colors rounded-md hover:bg-[#2A2A2C]"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {isOwner && (
                      <>
                        <button
                          onClick={() => navigate(`/posts/${post.id}/edit`)}
                          className="p-2 text-gray-500 hover:text-[#D4AF37] transition-colors rounded-md hover:bg-[#2A2A2C]"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-md hover:bg-[#2A2A2C] disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Comments Section ── */}
        <Card className="border-[#2A2A2C] bg-[#161618]">
          <div className="p-6">
            <CommentList
              postId={post.id}
              comments={topLevelComments}
              postOwnerId={post.user_id}
              acceptedAnswerId={post.accepted_answer_id}
            />
          </div>
        </Card>
      </div>

      {/* ── Right Sidebar ── */}
      <aside className="w-[320px] flex-shrink-0 hidden xl:block">
        <TrendingSidebar />
      </aside>
    </div>
  );
}
