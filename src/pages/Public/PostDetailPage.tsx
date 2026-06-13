// src/pages/Public/PostDetailPage.tsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Edit3, Trash2, Loader2,
  ArrowLeft, Share2, Flag,
} from 'lucide-react';

import { getPostDetail, deletePost } from '../../features/User/F16_Post/api';
import PostBody from '../../features/User/F16_Post/components/PostBody';
import VoteControl from '../../features/User/F22_VoteSystem/components/VoteControl';
import CommentList from '../../features/User/F17_Comment/components/CommentList';
import BookmarkToggle from '../../features/User/F24_BookmarkPost/components/BookmarkToggle';
import LikeButton from '../../features/User/F23_LikeSystem/components/LikeButton';
import TrendingSidebar from '../../features/Common/F7_TrendingPopularPost/components/TrendingSidebar';
import ReportModal from '../../features/User/F30_UserReport/components/ReportModal';
import PostAuthorCard from '../../features/User/F16_Post/components/PostAuthorCard';

import { timeAgo, formatNumber } from '../../lib/utils';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { useAuthStore } from '../../store/useAuthStore';
import type { Comment } from '../../features/User/F17_Comment/types';
export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostDetail(id!),
    enabled: !!id,
  });

  const post = data?.data;
  const isOwner = user?.id === post?.user_id;
  const isModOrAdmin = user?.role === 'moderator' || user?.role === 'admin';
  const postAgeMinutes = post ? (Date.now() - new Date(post.created_at).getTime()) / 60000 : 0;
  const isEditExpired = !isModOrAdmin && postAgeMinutes > 30;

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

  const allComments: Comment[] = post.comments || [];
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
            Ditanyakan {timeAgo(post.created_at)} &bull; Dilihat {formatNumber(post.view_count)} kali
          </span>
        </div>

        {/* ── Question Body with Vote ── */}
        <div className="flex gap-5 mb-6">
          <VoteControl
            targetId={post.id}
            targetType="post"
            initialScore={post.vote_score}
            userVote={post.user_vote}
            className="pt-1"
          />
          <div className="flex-1 min-w-0">
            <PostBody body={post.body} />
          </div>
        </div>

        {/* ── Action Buttons Row ── */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#2A2A2C]">
          <LikeButton targetId={post.id} targetType="post" initialIsLiked={post.is_liked} initialLikesCount={post.likes_count} />
          {user && <BookmarkToggle postId={post.id} isInitiallyBookmarked={post.is_bookmarked === true} />}
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#D4AF37] transition-colors px-2 py-1.5 rounded hover:bg-[#1A1A1C]"
          >
            <Share2 className="w-3.5 h-3.5" />
            Bagikan
          </button>
          {user && !isOwner && (
            <button 
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded hover:bg-[#1A1A1C]"
            >
              <Flag className="w-3.5 h-3.5" />
              Report
            </button>
          )}
          {isOwner && (
            <>
              <button
                onClick={() => !isEditExpired && navigate(`/posts/${post.id}/edit`)}
                disabled={isEditExpired}
                title={isEditExpired ? "Postingan hanya dapat diedit dalam 30 menit pertama" : "Edit Postingan"}
                className={`flex items-center gap-1.5 text-xs transition-colors px-2 py-1.5 rounded ${
                  isEditExpired 
                    ? 'text-gray-600 cursor-not-allowed opacity-50' 
                    : 'text-gray-500 hover:text-[#D4AF37] hover:bg-[#1A1A1C]'
                }`}
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
            <PostAuthorCard user={post.user} />
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

      {/* ── Report Modal ── */}
      {user && !isOwner && (
        <ReportModal
          open={reportModalOpen}
          onOpenChange={setReportModalOpen}
          targetId={post.id}
          targetType="post"
        />
      )}
    </div>
  );
}
