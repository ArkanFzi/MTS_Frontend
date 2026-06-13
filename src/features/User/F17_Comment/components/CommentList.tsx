// src/features/User/F17_Comment/components/CommentList.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Reply, CornerDownRight, CheckCircle2, Flag } from 'lucide-react';

import type { Comment } from '../types';
import { createComment } from '../api';
import { markAcceptedAnswer } from '../../F18_MarkAcceptedAnswer/api';
import ReplyForm from './ReplyForm';
import VoteControl from '../../F22_VoteSystem/components/VoteControl';
import LikeButton from '../../F23_LikeSystem/components/LikeButton';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';
import { useAuthStore } from '../../../../store/useAuthStore';
import ReportModal from '../../F30_UserReport/components/ReportModal';

interface CommentListProps {
  postId: string;
  comments: Comment[];
  postOwnerId: string;
  acceptedAnswerId: string | null;
}

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

// ─── Accepted Answer Banner ───
function AcceptedBanner() {
  return (
    <div className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-t-lg -mx-5 -mt-5 mb-4">
      <CheckCircle2 className="w-5 h-5 fill-black/20 text-black" />
      <span className="text-sm font-bold">Jawaban Diterima</span>
    </div>
  );
}

// ─── Accept Toggle Button ───
function AcceptToggle({ postId, commentId, isAccepted, isPostOwner }: {
  postId: string;
  commentId: string;
  isAccepted: boolean;
  isPostOwner: boolean;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => markAcceptedAnswer(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  if (isAccepted) return null; // Banner handles the display
  if (!isPostOwner) return null;

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#D4AF37] transition-colors disabled:opacity-50"
      title="Tandai sebagai jawaban terbaik"
    >
      {mutation.isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5" />
      )}
      <span>Tandai Jawaban</span>
    </button>
  );
}

// ─── Author Badge ───
function AuthorBadge({ username, avatarUrl, reputation, createdAt }: {
  username: string;
  avatarUrl?: string | null;
  reputation: number;
  createdAt: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-[#1E1E20]">
      <Avatar className="h-8 w-8">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={username} />
        ) : null}
        <AvatarFallback className="bg-[#D4AF37] text-black text-[10px] font-bold">
          {username.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold text-white">{username}</p>
        <p className="text-[11px] text-gray-500">Rep: {reputation.toLocaleString()}</p>
      </div>
      <span className="text-[11px] text-gray-600 ml-auto">{timeAgo(createdAt)}</span>
    </div>
  );
}

// ─── Single Reply ───
function ReplyItem({ reply, postId, postOwnerId, acceptedAnswerId, onReport }: {
  reply: Comment;
  postId: string;
  postOwnerId: string;
  acceptedAnswerId: string | null;
  onReport: (id: string) => void;
}) {
  const { user } = useAuthStore();
  const isPostOwner = user?.id === postOwnerId;

  return (
    <div className="flex gap-3 py-3">
      <CornerDownRight className="w-4 h-4 text-gray-700 flex-shrink-0 mt-1" />
      <Avatar className="h-7 w-7 flex-shrink-0">
        {reply.user?.avatar_url ? (
          <AvatarImage src={reply.user.avatar_url} alt={reply.user.username} />
        ) : null}
        <AvatarFallback className="bg-[#2A2A2C] text-gray-400 text-[10px] font-bold">
          {reply.user?.username?.substring(0, 2).toUpperCase() ?? '??'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-300">
            {reply.user?.username ?? 'Anonim'}
          </span>
          <span className="text-[10px] text-gray-600">{timeAgo(reply.created_at)}</span>
          {reply.is_accepted && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#D4AF37]">
              <CheckCircle2 className="w-3 h-3" /> Jawaban Diterima
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{reply.body}</p>
        <div className="mt-2 flex items-center gap-3">
          <VoteControl
            targetId={reply.id}
            targetType="comment"
            initialScore={reply.vote_score}
            userVote={reply.user_vote}
            className="flex-row gap-2"
          />
          <LikeButton 
            targetId={reply.id} 
            targetType="comment" 
            initialIsLiked={reply.is_liked}
            initialLikesCount={reply.likes_count}
          />
          {!reply.is_accepted && acceptedAnswerId === null && (
            <AcceptToggle postId={postId} commentId={reply.id} isAccepted={false} isPostOwner={isPostOwner} />
          )}
          {user && user.id !== reply.user_id && (
            <button
              onClick={() => onReport(reply.id)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors ml-auto"
              title="Laporkan"
            >
              <Flag className="w-3.5 h-3.5" />
              Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Single Comment / Answer Card ───
function CommentItem({ comment, postId, postOwnerId, acceptedAnswerId, onReport }: {
  comment: Comment;
  postId: string;
  postOwnerId: string;
  acceptedAnswerId: string | null;
  onReport: (id: string) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user } = useAuthStore();
  const isPostOwner = user?.id === postOwnerId;
  const replies = comment.replies || [];
  const isAccepted = comment.is_accepted;

  return (
    <div
      className={`rounded-lg border ${
        isAccepted
          ? 'border-[#D4AF37] bg-[#1A1810]'
          : 'border-[#2A2A2C] bg-[#161618]'
      } mb-5 overflow-hidden`}
    >
      <div className="p-5">
        {/* Accepted banner */}
        {isAccepted && <AcceptedBanner />}

        <div className="flex gap-5">
          {/* Vote */}
          <VoteControl
            targetId={comment.id}
            targetType="comment"
            initialScore={comment.vote_score}
            userVote={comment.user_vote}
            className="pt-0.5"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Body */}
            <p className="text-[15px] text-gray-200 leading-[1.8] whitespace-pre-wrap">
              {comment.body}
            </p>

            {/* Reply button */}
            <div className="flex items-center gap-4 mt-4">
              <LikeButton 
                targetId={comment.id} 
                targetType="comment" 
                initialIsLiked={comment.is_liked}
                initialLikesCount={comment.likes_count}
              />
              {user && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#D4AF37] transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" />
                  Balas
                </button>
              )}
              {!isAccepted && acceptedAnswerId === null && (
                <AcceptToggle postId={postId} commentId={comment.id} isAccepted={false} isPostOwner={isPostOwner} />
              )}
              {user && user.id !== comment.user_id && (
                <button
                  onClick={() => onReport(comment.id)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors ml-auto"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Report
                </button>
              )}
            </div>

            {/* Reply form */}
            {showReplyForm && (
              <div className="mt-3 pt-3 border-t border-[#2A2A2C]">
                <ReplyForm postId={postId} commentId={comment.id} />
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="text-xs text-gray-600 hover:text-gray-400 mt-2"
                >
                  Batal
                </button>
              </div>
            )}

            {/* Author badge */}
            <AuthorBadge
              username={comment.user?.username ?? 'Anonim'}
              avatarUrl={comment.user?.avatar_url}
              reputation={comment.user?.reputation_points ?? 0}
              createdAt={comment.created_at}
            />
          </div>
        </div>

        {/* Nested replies */}
        {replies.length > 0 && (
          <div className="mt-4 ml-12 border-l-2 border-[#2A2A2C] pl-4">
            {replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                postId={postId}
                postOwnerId={postOwnerId}
                acceptedAnswerId={acceptedAnswerId}
                onReport={onReport}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main CommentList ───
export default function CommentList({ postId, comments, postOwnerId, acceptedAnswerId }: CommentListProps) {
  const [commentBody, setCommentBody] = useState('');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [reportTarget, setReportTarget] = useState<string | null>(null);

  const commentMutation = useMutation({
    mutationFn: () => createComment(postId, { body: commentBody }),
    onSuccess: () => {
      setCommentBody('');
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    commentMutation.mutate();
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-xl font-bold text-white mb-6">
        {comments.length} Jawaban
      </h2>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.username} />
              ) : null}
              <AvatarFallback className="bg-[#D4AF37] text-black text-[10px] font-bold">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Tulis jawaban kamu..."
                rows={4}
                className="w-full rounded-lg border border-[#2A2A2C] bg-[#0B0B0C] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-y"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!commentBody.trim() || commentMutation.isPending}
                  className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 disabled:opacity-50 h-9 px-5 text-sm font-semibold"
                >
                  {commentMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Jawaban'
                  )}
                </Button>
              </div>
              {commentMutation.isError && (
                <p className="text-xs text-red-400">
                  {(commentMutation.error as any)?.response?.data?.message || 'Gagal mengirim jawaban.'}
                </p>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 text-center py-5 border border-dashed border-[#2A2A2C] rounded-lg">
          <p className="text-sm text-gray-500">
            <a href="/login" className="text-[#D4AF37] hover:underline font-medium">Login</a> untuk menulis jawaban.
          </p>
        </div>
      )}

      {/* Comments / Answers */}
      {comments.length === 0 ? (
        <p className="text-center text-gray-600 py-12 text-sm">
          Belum ada jawaban. Jadilah yang pertama memberikan jawaban!
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            postOwnerId={postOwnerId}
            acceptedAnswerId={acceptedAnswerId}
            onReport={setReportTarget}
          />
        ))
      )}

      {user && (
        <ReportModal
          open={!!reportTarget}
          onOpenChange={(open) => !open && setReportTarget(null)}
          targetId={reportTarget || ''}
          targetType="comment"
        />
      )}
    </div>
  );
}
